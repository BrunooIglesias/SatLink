import express from 'express';
import { SatLogic } from './services/satLogic';
const app = express();
const port = 3000;


const _satLogic = new SatLogic();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/checkSatellites', async (req, res) => {
  await initializeEE();
  await _satLogic.checkSats();
  res.status(200).json("Satellites checked");
});

app.listen(port, async () => {
  console.log(`Express is listening at http://localhost:${port}`);
});


var ee = require('@google/earthengine');
var fs = require('fs');


const initializeEE = async () => {
  var serviceAccount = 'my-service-account@...gserviceaccount.com';
  var privateKey = JSON.parse(fs.readFileSync('private-key.json', 'utf8'));

  await new Promise<void>((resolve, reject) => {
    ee.data.authenticateViaPrivateKey(privateKey, function() {
      ee.initialize(null, null, function() {
        console.log('Earth Engine client initialized.');
        resolve();
      }, function(e) {
        console.error('Error initializing Earth Engine: ', e);
        reject(e);
      });
    }, function(e) {
      console.error('Error authenticating: ', e);
      reject(e);
    });
  });
};
