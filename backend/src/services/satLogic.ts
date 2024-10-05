
export class SatLogic {

  getSatelliteLocation = async (landsatCollection) => {
      
      var ee = require('@google/earthengine');
      var fs = require('fs');
      console.log('Earth Engine client initialized.');

      var region = ee.Geometry.Polygon([
        [[-58.5, -34.5], [-58.5, -30.0], [-53.0, -30.0], [-53.0, -34.5]]
      ]);



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
    let satellites : string[] = [ "LANDSAT/LC09/C02/T1_L2"];//["LANDSAT/LC09/C02/T1_L2", "LANDSAT/LC08/C02/T1_L2", "NASA/HLS/HLSL30/v002"];

    for (let i = 0; i < satellites.length; i++) {
      await this.checkAndSendPictures(satellites[i]);
    }
  }

  checkAndSendPictures = async (satellite) => {
    let coordinates = await this.getSatelliteLocation(satellite);
    console.log("Coordinates of " + satellite + ": ", coordinates);
    let usersData = this.getInterestedUsers(coordinates, satellite);
    for (let i = 0; i < usersData.length; i++) {
      this.generateData(usersData[i]);
    }
  }
    

   getInterestedUsers = (coordinates: void, satellite:string) => {
    var ee = require('@google/earthengine');
      var region = ee.Geometry.Polygon([
        [[-58.5, -34.5], [-58.5, -30.0], [-53.0, -30.0], [-53.0, -34.5]]
      ]);
      return [{userMail:"santimoron001@gmail.com", coordinates:region, sat: satellite }];
    }

    generateData = (userData) => {
    var ee = require('@google/earthengine');
    var fs = require('fs');
    var https = require('https');
    var privateKey = JSON.parse(fs.readFileSync('./private-key.json', 'utf8'));
    console.log("Generating data for user: ", userData.userMail);
    ee.data.authenticateViaPrivateKey(privateKey, function() {
      ee.initialize(null, null, function() {
        console.log('Earth Engine client initialized.');
        var endDate = ee.Date(Date.now());
        var startDate = endDate.advance(-20, 'day');

        var collection = ee.ImageCollection("LANDSAT/LC08/C02/T1_RT")
            .filterDate(startDate, endDate)
            .filterBounds(userData.coordinates)
            .sort('system:time_start', false);


        var mosaic = collection.mosaic(); // Usar mosaic para combinar imágenes


        if (mosaic) {

          var downloadURL = mosaic.getDownloadURL({
            name: 'Landsat_8_Uruguay_Mosaico',
            bands: ['B4', 'B3', 'B2'], // Bandas RGB
            region: userData.coordinates,
            scale: 400,
            format: 'GEO_TIFF'
          });


          console.log('Download URL for the mosaic of Landsat 8 image in Uruguay:', downloadURL);


          const file = fs.createWriteStream(userData.userMail + ".tif");
          https.get(downloadURL, function(response) {
            response.pipe(file);
            file.on('finish', function() {
              file.close();
              console.log("Image downloaded to " + userData.userMail + ".tif");
            });
          }).on('error', function(err) {
            console.error('Error downloading the image:', err.message);
          });

        } else {
          console.log('No images found for the specified region and date range.');
        }


          }, function(e) {
            console.error('Error al inicializar Earth Engine: ' + e);
          });
        }, function(e) {
          console.error('Error al autenticar: ' + e);
        });

    }

}


