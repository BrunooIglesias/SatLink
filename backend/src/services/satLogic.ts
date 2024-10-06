import { insertResult, getUsersInRegion } from '../dataAccess/userRequests';
import { promises as fsPromises } from 'fs';
import path from 'path'; // Import path module for file path management

export class SatLogic {

  // Method to get satellite location
  getSatelliteLocation = async (landsatCollection) => {
    var ee = require('@google/earthengine');
    console.log('Earth Engine client initialized.');

    var endDate = ee.Date(Date.now());
    var startDate = endDate.advance(-30, 'day');

    var collection = ee.ImageCollection(landsatCollection)
      .filterDate(startDate, endDate);
    var latestImage = collection.sort('system:time_start', false).first();

    if (latestImage) {
      var imageDate = latestImage.getInfo().properties.DATE_ACQUIRED;
      var imageTime = latestImage.getInfo().properties.SCENE_CENTER_TIME;
      console.log('Fecha y hora de foto más reciente:', imageDate, imageTime);

      var geometry = latestImage.geometry();
      var centroid = geometry.centroid();
      var centroidCoordinates = centroid.coordinates().getInfo(); // Obtener información del centro
      console.log('Centro de la imagen:', centroidCoordinates);

      return centroidCoordinates;
    }
    return null;
  }

  // Method to check satellites
  checkSats = async () => {
    let satellites = ["LANDSAT/LC09/C02/T1_L2", "LANDSAT/LC08/C02/T1_L2", "NASA/HLS/HLSL30/v002"];
    
    for (let i = 0; i < satellites.length; i++) {
      await this.checkAndSendPictures(satellites[i]);
    }
  }

  // Method to check and send pictures
  checkAndSendPictures = async (satellite) => {
    let coordinates = await this.getSatelliteLocation(satellite);
    console.log("Coordinates of " + satellite + ": ", coordinates);
    let usersData = await this.getInterestedUsers(coordinates, satellite);
    if (usersData.length === 0) {
      console.log("No users found for satellite: ", satellite);
    }
    let bandsToUse = ['SR_B4', 'SR_B3', 'SR_B2'];
    for (let userData of usersData) {
      await this.generateData(userData, satellite, bandsToUse);
    }
  }

  getInterestedUsers = async (coordinates, satellite) => {
    var ee = require('@google/earthengine');
    let InterestedUsers = await getUsersInRegion(coordinates, satellite); 
    return InterestedUsers;
  }


  generateData = async (userData, satellite, bandsToUse) => {
    const ee = require('@google/earthengine');
    const fs = require('fs');
    const https = require('https');
    const sharp = require('sharp');
    const privateKey = JSON.parse(await fsPromises.readFile('./private-key.json', 'utf8'));

    console.log("Generating data for user: ", userData.email);
    let point = ee.Geometry.Point([userData.coordinates.lon, userData.coordinates.lat]);

    let box = ee.Geometry.Polygon([[[userData.coordinates.lon - 0.5, userData.coordinates.lat - 0.5], [userData.coordinates.lon - 0.5, userData.coordinates.lat + 0.5], [userData.coordinates.lon + 0.5, userData.coordinates.lat + 0.5], [userData.coordinates.lon + 0.5, userData.coordinates.lat - 0.5]]]);

    await new Promise((resolve, reject) => {
      ee.data.authenticateViaPrivateKey(privateKey, function () {
        ee.initialize(null, null, async function () {
          console.log('Earth Engine client initialized.');
          let endDate = ee.Date(Date.now());
          let startDate = endDate.advance(-60, 'day');

          if (userData.dateFilters.startDate !== '') {
            endDate = ee.Date(userData.dateFilters.endDate);
            startDate = ee.Date(userData.dateFilters.startDate);
          }

          try {
            const collection = ee.ImageCollection(satellite)
              .filterDate(startDate, endDate)
              .filterBounds(point)
              .sort('system:time_start', false)
              .filter(ee.Filter.lt('CLOUD_COVER', userData.cloudCover)).first();

            if (collection) {
              const downloadURL = await collection.getDownloadURL({
                name: `${satellite}_image`,
                bands: bandsToUse, //  RGB
                region: collection.geometry(),
                scale: 500,
                format: 'GEO_TIFF'
              });

              console.log('Download URL for the mosaic of Landsat image:', downloadURL);

              let filePath = path.join(__dirname, `${userData.email}.tif`); 
              const file = fs.createWriteStream(filePath);
              https.get(downloadURL, function (response) {
                response.pipe(file);
                file.on('finish', async function () {
                  file.close();
                  console.log("Image downloaded to " + filePath);


                  let jpegFilePath = path.join(__dirname, `${userData.email}.jpg`); // Create JPEG file path

                  try {
                    await sharp(filePath)
                      .jpeg({ quality: 80 })
                      .toFile(jpegFilePath);

                    console.log("Image converted to JPEG: " + jpegFilePath);

                    // Read the JPEG image into a buffer
                    const imageBuffer = await fsPromises.readFile(jpegFilePath);
                    
                    // Spectral Signature
                    let spectralValues = null;
                    if (userData.spectralSignature) {
                      var geometry = collection.geometry();
                      var centroid = geometry.centroid();
                      spectralValues = await collection.reduceRegion({
                        reducer: ee.Reducer.first(),
                        geometry: centroid,
                        scale: 1000
                      }).getInfo();
                    }

                    // Data Values
                    let pixelValue = null;
                    if (userData.dataValues === 1) {
                      var temperatureBand = collection.select(['ST_B10']);
                      pixelValue = await temperatureBand.reduceRegion({
                        reducer: ee.Reducer.mean(),
                        geometry: point,
                        scale: 30
                      }).getInfo();
                      pixelValue = (1321.0789 / Math.log((774.8853 / pixelValue) + 1)) - 273.15;
                    }

                    // Metadata in CSV format
                    let fileName = '';
                    let csvContent = null;
                    if (userData.metadata === 1) {
                      console.log("Getting CSV metadata...");
                      const metadata = await collection.toDictionary().getInfo(); 
                      csvContent = convertMetadataToCSV(metadata);
                    }

                    // Insert the result into the database
                    if (userData.email !== "preview" && userData.email !== "preview2" && userData.email !== "preview3") {
                      await insertResult(userData.email, userData.name, imageBuffer, csvContent, pixelValue, spectralValues, downloadURL);
                      console.log("Result inserted correctly for: ", userData.email);
                    }

                    resolve(downloadURL);
                  } catch (error) {
                    console.error("Error converting image:", error);
                    reject(error);
                  }
                });
              });
            } else {
              reject(new Error(`No mosaic found for satellite: ${satellite}`));
            }
          } catch (error) {
            console.error("Error retrieving image:", error);
            reject(error);
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
    const sharp = require('sharp');  
    const privateKey = JSON.parse(fs.readFileSync('./private-key.json', 'utf8'));

    let point = ee.Geometry.Point([userData.coordinates.lon, userData.coordinates.lat]);


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


                let endDate = ee.Date(Date.now());
                let startDate = endDate.advance(-60, 'day');

                if (userData.dateFilters && userData.dateFilters.startDate && userData.dateFilters.endDate) {
                    endDate = ee.Date(userData.dateFilters.endDate);
                    startDate = ee.Date(userData.dateFilters.startDate);
                }

                try {

                    const collection = ee.ImageCollection(satellite)
                        .filterDate(startDate, endDate)
                        .filterBounds(point)
                        .sort('system:time_start', false) 
                        .filter(ee.Filter.lt('CLOUD_COVER', userData.cloudCover)) 
                        .first();

                    if (collection) {
                        const downloadURL = await collection.getDownloadURL({
                            name: `${satellite}_image`,
                            bands: bandsToUse,  // Select bands to use, e.g., RGB bands
                            region: box,  // Use the bounding box geometry
                            scale: 100,   // Scale in meters
                            format: 'GEO_TIFF'  // Format to GeoTIFF
                        });

                        console.log('Download URL generated:', downloadURL);
                        let timeStamp = new Date().getTime();
                        let filePath = path.join(__dirname, `${userData.email}${timeStamp}.tif`); 
                      const file = fs.createWriteStream(filePath);
                      https.get(downloadURL, function(response) {
                          response.pipe(file);
                          file.on('finish', async function() {
                              file.close();
                              console.log("Image downloaded to " + userData.email + ".tif");
  
                              // Convert the TIFF to JPEG using sharp
                            
                              let jpegFilePath = path.join(__dirname, `${userData.email}${timeStamp}.jpg`); // Create JPEG file path
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

  // Method to get path and row
  getPathRow = async (collection) => {
    var path = "";
    var row = "";
    await collection.toDictionary().getInfo(async (metadata) => {
      console.log("Metadata:", metadata);
      path = metadata.WRS_PATH;
      row = metadata.WRS_ROW;
    });
    return { "path": path, "row": row };
  }
}

// Helper function to convert metadata to CSV
function convertMetadataToCSV(metadata) {
  var csv = 'Property,Value\n'; // Cabecera del CSV
  for (var key in metadata) {
    csv += key + ',' + metadata[key] + '\n';
  }
  return csv;
}
