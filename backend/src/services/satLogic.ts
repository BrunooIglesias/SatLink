import { insertResult, getUsersInRegion } from '../dataAccess/userRequests';
import { promises as fsPromises } from 'fs';

export class SatLogic {


  getSatelliteLocation = async (landsatCollection) => {
      
      var ee = require('@google/earthengine');
      var fs = require('fs');
      console.log('Earth Engine client initialized.');



      var endDate = ee.Date(Date.now());
      var startDate = endDate.advance(-30, 'day');

      var collection = ee.ImageCollection(landsatCollection)
                          .filterDate(startDate, endDate)
      var latestImage = collection.sort('system:time_start', false).first();

      if(latestImage) {
      var imageDate = latestImage.getInfo().properties.DATE_ACQUIRED;
      var imageTime = latestImage.getInfo().properties.SCENE_CENTER_TIME
      console.log('Fecha y hora de foto más reciente:', imageDate, imageTime);

      var geometry = latestImage.geometry(); 
      var centroid = geometry.centroid();
      var centroidCoordinates = centroid.coordinates().getInfo(); // Obtener información del centro
      console.log('Centro de la imagen:', centroidCoordinates);

      return centroidCoordinates;
      }
      return null;
  }

  checkSats = async () => {
    let satellites : string[] = ["LANDSAT/LC09/C02/T1_L2","LANDSAT/LC08/C02/T1_L2", "NASA/HLS/HLSL30/v002"];

    for (let i = 0; i < satellites.length; i++) {
      await this.checkAndSendPictures(satellites[i]);
    }
  }

  checkAndSendPictures = async (satellite) => {
    let coordinates = await this.getSatelliteLocation(satellite);
    console.log("Coordinates of " + satellite + ": ", coordinates);
    let usersData = await this.getInterestedUsers(coordinates, satellite);
    if (usersData.length == 0) {
      console.log("No users found for satellite: ", satellite);
    }
    let bandsToUse = ['SR_B4', 'SR_B3', 'SR_B2'];
    for (let i = 0; i < usersData.length; i++) {
      this.generateData(usersData[i], satellite, bandsToUse);
    }
  }
    

   getInterestedUsers = async (coordinates: void, satellite:string) => {
    var ee = require('@google/earthengine');
      let InterestedUsers = getUsersInRegion(coordinates, satellite);
      return InterestedUsers;
    }

    generateData = async (userData, satellite, bandsToUse) => {
      const ee = require('@google/earthengine');
      const fs = require('fs');
      const https = require('https');
      const sharp = require('sharp');  // Import sharp for image processing
      const privateKey = JSON.parse(fs.readFileSync('./private-key.json', 'utf8'));
  
      console.log("Generating data for user: ", userData.email);
      let point = ee.Geometry.Point([userData.coordinates.lon, userData.coordinates.lat]);

      let box = ee.Geometry.Polygon([[[userData.coordinates.lat - 0.5, userData.coordinates.lon - 0.5], [userData.coordinates.lat - 0.5, userData.coordinates.lon + 0.5], [userData.coordinates.lat + 0.5, userData.coordinates.lon + 0.5], [userData.coordinates.lat + 0.5, userData.coordinates.lon - 0.5]]]);
  
      await new Promise<{} | void>((resolve, reject) => {
          ee.data.authenticateViaPrivateKey(privateKey, function() {
              ee.initialize(null, null, function() {
                  console.log('Earth Engine client initialized.');
                  let endDate = ee.Date(Date.now());
                  let startDate = endDate.advance(-60, 'day');
                  if (userData.dateFilters.startDate != '') {
                      endDate = ee.Date(userData.dateFilters.endDate);
                      startDate = ee.Date(userData.dateFilters.startDate);
                  }
                  const collection = ee.ImageCollection(satellite)
                                       .filterDate(startDate, endDate)
                                       .filterBounds(point)
                                       .sort('system:time_start', false)
                                       .filter(ee.Filter.lt('CLOUD_COVER', userData.cloudCover)).first();
                  try{
                  if (collection) {
                      const downloadURL = collection.getDownloadURL({
                          name: satellite + "_image",
                          bands: bandsToUse, // Bandas RGB
                          region: collection.geometry(),
                          scale: 100,
                          format: 'GEO_TIFF'
                      });
  
                      console.log('Download URL for the mosaic of Landsat 8 image in Uruguay:', downloadURL);
  
                      let filePath = userData.email + ".tif";
                      const file = fs.createWriteStream(filePath);
                      https.get(downloadURL, function(response) {
                          response.pipe(file);
                          file.on('finish', async function() {
                              file.close();
                              console.log("Image downloaded to " + userData.email + ".tif");
  
                              // Convert the TIFF to JPEG using sharp
                              const jpegFilePath = userData.email + ".jpg";
  
                              try {
                                  await sharp(filePath)
                                      .jpeg() // Set JPEG quality if needed
                                      .toFile(jpegFilePath);
  
                                  console.log("Image converted to JPEG: " + jpegFilePath);
  
                                  // Read the JPEG image into a buffer
                                  const imageBuffer = await fs.readFileSync(jpegFilePath);
                                  
                                    //SPECTRAL SIGNATURE
                                  if (userData.spectralSignature) {
                                    var geometry = collection.geometry();
                                    var centroid = geometry.centroid(); 
                                    var spectralValues = await collection.reduceRegion({
                                      reducer: ee.Reducer.first(),
                                      geometry: centroid,
                                      scale: 1000
                                    }).getInfo();
                                
                                  }
                                  //DATA VALUES
                                  if (userData.dataValues == 1) {
                                    var temperatureBand = collection.select(['ST_B10']);
                                    var pixelValue = temperatureBand.reduceRegion({
                                      reducer: ee.Reducer.mean(),
                                      geometry: point,
                                      scale: 30
                                  });
                                  
                                  // Use getInfo() directly and handle the response without chaining .then()
                                  await pixelValue.getInfo(function(result) {
                                    pixelValue = result;
                                  }, function(err) {
                                      console.error("Error getting pixel value:", err);
                                  });
                                  }
                                    //METADATA IN CSV FORMAT
                                  let fileName = '';
                                  if (userData.metadata == 1) {
                                    console.log("Getting csv metadata...");
                                    collection.toDictionary().getInfo(function(metadata) {
                                      var csvContent = convertMetadataToCSV(metadata);
                                      fileName = 'landsat_image_metadata_' + userData.name + '.csv';
                                      fs.writeFileSync(fileName, csvContent);
                                      console.log('Metadata CSV saved as landsat_image_metadata.csv');
                                    });
                                  }
                                  // Insert the result into the database
                                  if (userData.email != "preview" && userData.email != "preview2" && userData.email != "preview3") {
                                    insertResult(userData.email, userData.name, imageBuffer, fileName, pixelValue, spectralValues, downloadURL);
                                    console.log("Result inserted correctly for: ", userData.email);
                                  }

                                  return downloadURL;
                                  resolve();
                              } catch (error) {
                                  console.error("Error converting image:", error);
                                  reject(error);
                              }
                          });
                      });
                  }}catch(error){
                    console.error("No mosaic found for satellite:", satellite, error);
                  }
              });
          });
      });
  }
  generateURL = async (userData, satellite, bandsToUse) => {
    console.log("Generating data for user: ", userData.email);
    const ee = require('@google/earthengine');
      const fs = require('fs');
      const https = require('https');
      const sharp = require('sharp');  // Import sharp for image processing
      const privateKey = JSON.parse(fs.readFileSync('./private-key.json', 'utf8'));
    // Create a point geometry based on user coordinates
    let point = ee.Geometry.Point([userData.coordinates.lon, userData.coordinates.lat]);

    // Create a bounding box geometry around the user's location
    let box = ee.Geometry.Polygon([[
        [userData.coordinates.lon - 0.5, userData.coordinates.lat - 0.5],
        [userData.coordinates.lon - 0.5, userData.coordinates.lat + 0.5],
        [userData.coordinates.lon + 0.5, userData.coordinates.lat + 0.5],
        [userData.coordinates.lon + 0.5, userData.coordinates.lat - 0.5]
    ]]);

    return new Promise<{buffer,data}>((resolve, reject) => {
        ee.data.authenticateViaPrivateKey(privateKey, function() {
            ee.initialize(null, null, async function() {
                console.log('Earth Engine client initialized.');

                // Define date range based on user input or default to last 60 days
                let endDate = ee.Date(Date.now());
                let startDate = endDate.advance(-60, 'day');

                if (userData.dateFilters && userData.dateFilters.startDate && userData.dateFilters.endDate) {
                    endDate = ee.Date(userData.dateFilters.endDate);
                    startDate = ee.Date(userData.dateFilters.startDate);
                }

                try {
                    // Fetch the first image from the collection
                    const collection = ee.ImageCollection(satellite)
                        .filterDate(startDate, endDate)
                        .filterBounds(point)
                        .sort('system:time_start', false) // Sort by time, most recent first
                        .filter(ee.Filter.lt('CLOUD_COVER', userData.cloudCover)) // Filter by cloud cover
                        .first();

                    if (collection) {
                        // Get the download URL for the image
                        const downloadURL = await collection.getDownloadURL({
                            name: `${satellite}_image`,
                            bands: bandsToUse,  // Select bands to use, e.g., RGB bands
                            region: box,  // Use the bounding box geometry
                            scale: 100,   // Scale in meters
                            format: 'GEO_TIFF'  // Format to GeoTIFF
                        });

                        console.log('Download URL generated:', downloadURL);
                        let filePath = userData.email + ".tif";
                      const file = fs.createWriteStream(filePath);
                      https.get(downloadURL, function(response) {
                          response.pipe(file);
                          file.on('finish', async function() {
                              file.close();
                              console.log("Image downloaded to " + userData.email + ".tif");
  
                              // Convert the TIFF to JPEG using sharp
                              const jpegFilePath = userData.email + ".jpg";
  
                              try {
                                  await sharp(filePath)
                                      .jpeg() // Set JPEG quality if needed
                                      .toFile(jpegFilePath);
  
                                  console.log("Image converted to JPEG: " + jpegFilePath);
  
                                  // Read the JPEG image into a buffer
                                  const imageBuffer = await fs.readFileSync(jpegFilePath);
                                  
                                 
    
                                  resolve(imageBuffer);
                              } catch (error) {
                                  console.error("Error converting image:", error);
                                  reject(error);
                              }
                          });
                        });
                    } else {
                        reject(new Error(`No images found for satellite: ${satellite}`));
                    }
                } catch (err) {
                    console.error("Error generating URL for satellite:", satellite, err);
                    reject(err);
                }
            });
        });
    });
};


  getPathRow = async (collection)=>{
    var path = "";
    var row = "";
    await collection.toDictionary().getInfo(await function(metadata) {
      console.log("Metadata:", metadata);
        path = metadata.WRS_PATH;
        row = metadata.WRS_ROW;
    });
    return {"path": path, "row":row};
  }
  
    
}

function convertMetadataToCSV(metadata) {
  var csv = 'Property,Value\n';  // Cabecera del CSV
  for (var key in metadata) {
    csv += key + ',' + metadata[key] + '\n';
  }
  return csv;
}
