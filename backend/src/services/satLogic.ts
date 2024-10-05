import { insertResult, getUsersInRegion } from '../dataAccess/userRequests';
import { promises as fsPromises } from 'fs';

export class SatLogic {


  getSatelliteLocation = async (landsatCollection) => {
      
      var ee = require('@google/earthengine');
      var fs = require('fs');
      console.log('Earth Engine client initialized.');



      var endDate = ee.Date(Date.now());
      var startDate = endDate.advance(-7, 'day');

      var collection = ee.ImageCollection(landsatCollection)
                          .filterDate(startDate, endDate)
      var latestImage = collection.sort('system:time_start', false).first();

      var imageDate = latestImage.getInfo().properties.DATE_ACQUIRED;
      var imageTime = latestImage.getInfo().properties.SCENE_CENTER_TIME
      console.log('Fecha y hora de foto más reciente:', imageDate, imageTime);

      var geometry = latestImage.geometry(); 
      var centroid = geometry.centroid();
      var centroidCoordinates = centroid.coordinates().getInfo(); // Obtener información del centro
      console.log('Centro de la imagen:', centroidCoordinates);

      return centroidCoordinates;
  }

  checkSats = async () => {
    let satellites : string[] = ["LANDSAT/LC09/C02/T1_L2"] // , ["LANDSAT/LC08/C02/T1_L2", "NASA/HLS/HLSL30/v002"];

    for (let i = 0; i < satellites.length; i++) {
      await this.checkAndSendPictures(satellites[i]);
    }
  }

  checkAndSendPictures = async (satellite) => {
    let coordinates = await this.getSatelliteLocation(satellite);
    console.log("Coordinates of " + satellite + ": ", coordinates);
    let usersData = this.getInterestedUsers(coordinates, satellite);
    for (let i = 0; i < usersData.length; i++) {
      this.generateData(usersData[i], satellite);
    }
  }
    

   getInterestedUsers = (coordinates: void, satellite:string) => {
    var ee = require('@google/earthengine');
      var region = ee.Geometry.Polygon([
        [[-58.5, -34.5], [-58.5, -30.0], [-53.0, -30.0], [-53.0, -34.5]]
      ]);
      getUsersInRegion(region);
      return [{userMail:"santimoron001@gmail.com", coordinates:region, sat: satellite }];
    }

    generateData = async (userData, satellite) => {
      const ee = require('@google/earthengine');
      const fs = require('fs');
      const https = require('https');
      const sharp = require('sharp');  // Import sharp for image processing
      const privateKey = JSON.parse(fs.readFileSync('./private-key.json', 'utf8'));
  
      console.log("Generating data for user: ", userData.userMail);
  
      await new Promise<void>((resolve, reject) => {
          ee.data.authenticateViaPrivateKey(privateKey, function() {
              ee.initialize(null, null, function() {
                  console.log('Earth Engine client initialized.');
                  const endDate = ee.Date(Date.now());
                  const startDate = endDate.advance(-20, 'day');
  
                  //GET PICTURE
                  const collection = ee.ImageCollection(satellite)
                      .filterDate(startDate, endDate)
                      .filterBounds(userData.coordinates)
                      .sort('system:time_start', false);
  
                  const mosaic = collection.mosaic(); // Usar mosaic para combinar imágenes
  
                  if (mosaic) {
                      const downloadURL = mosaic.getDownloadURL({
                          name: satellite + "_mosaic",
                          bands: ['SR_B4', 'SR_B3', 'SR_B2'], // Bandas RGB
                          region: userData.coordinates,
                          scale: 400,
                          format: 'GEO_TIFF'
                      });
  
                      console.log('Download URL for the mosaic of Landsat 8 image in Uruguay:', downloadURL);
  
                      let filePath = userData.userMail + ".tif";
                      const file = fs.createWriteStream(filePath);
                      https.get(downloadURL, function(response) {
                          response.pipe(file);
                          file.on('finish', async function() {
                              file.close();
                              console.log("Image downloaded to " + userData.userMail + ".tif");
  
                              // Convert the TIFF to JPEG using sharp
                              const jpegFilePath = userData.userMail + ".jpg";
  
                              try {
                                  await sharp(filePath)
                                      .jpeg({ quality: 90 }) // Set JPEG quality if needed
                                      .toFile(jpegFilePath);
  
                                  console.log("Image converted to JPEG: " + jpegFilePath);
  
                                  // Read the JPEG image into a buffer
                                  const imageBuffer = fs.readFileSync(jpegFilePath);
                                  
                                    //SPECTRAL SIGNATURE
                                    var geometry = collection.first().geometry();
                                    var centroid = geometry.centroid(); 
                                    var spectralValues = collection.first().reduceRegion({
                                      reducer: ee.Reducer.first(),
                                      geometry: centroid,
                                      scale: 1000
                                    }).getInfo();
                                
                                    console.log("Spectral values ", spectralValues); 


                                    //METADATA IN CSV FORMAT
                                    
                                    collection.toDictionary().getInfo(function(metadata) {
                                      var csvContent = convertMetadataToCSV(metadata);
                                      fs.writeFileSync('landsat_image_metadata.csv', csvContent);
                                      console.log('Metadata CSV saved as landsat_image_metadata.csv');
                                    });
                                  // Insert the result into the database
                                  insertResult(userData.userMail, userData.sat, imageBuffer);
                                
                                  console.log("Result inserted correctly for: ", userData.userMail);
                                  resolve();
                              } catch (error) {
                                  console.error("Error converting image:", error);
                                  reject(error);
                              }
                          });
                      });
                  } else {
                      console.error("No mosaic found for satellite:", satellite);
                  }
              });
          });
      });
  }
  
    
}

function convertMetadataToCSV(metadata) {
  var csv = 'Property,Value\n';  // Cabecera del CSV
  for (var key in metadata) {
    csv += key + ',' + metadata[key] + '\n';
  }
  return csv;
}