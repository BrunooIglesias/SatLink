import express from 'express';
import { SatLogic } from './services/satLogic';
import axios from 'axios';
import { UserLogic } from './services/userLogic';
import { requestDto } from './dtos/requestDto';
const app = express();
const port = 3000;


const _satLogic = new SatLogic();
const _userLogic = new UserLogic();


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/checkSatellites', async (req, res) => {
  await initializeEE();
  await _satLogic.checkSats();
  res.status(200).json("Satellites checked");
});

app.post('/userRequest', async (req, res) => {
  let request : requestDto = req.body;
  await _userLogic.createRequest(request);
  res.status(200).json("Request created");
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
async function checkForImages() {
  try {
    const response = await axios.get('http://localhost:${port}/checkSatellites');
    console.log('Satellites checked successfully:', response.data);
  } catch (error) {
    console.error('Error checking satellites:', error);
  }
}
const cron = require('node-cron');
cron.schedule('0 */12 * * *', () => {
  console.log('Running cron job to check satellites...');
  checkForImages();
});
