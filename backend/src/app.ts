import express from 'express';
import { SatLogic } from './services/satLogic';
import axios from 'axios';
import { UserLogic } from './services/userLogic';
import { requestDto } from './dtos/requestDto';
const app = express();
const port = 3000;

let cors = require('cors');
app.use(express.json());

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

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

app.get('/results/:id', async (req, res) => {
  let result = await _userLogic.getResults(req.params.id);
  res.status(200).json(result[0][0]);
});

app.post('/userRequest', async (req, res) => {
  let request : requestDto = req.body;
  await _userLogic.createRequest(request);
  res.status(200).json("Request created");
});

app.post('/preview', async (req, res) => {
  await initializeEE();
  let requestPayload = {    //Preview fixed request
    id: 1,
    email: "preview",
    coordinates: req.body.coordinates,
    satellite: "LANDSAT/LC09/C02/T1_L2",
    cloudCover: 100,
    dateFilters: {startDate: '', endDate: ''},
    metadata: 0,
    dataValues: 0,
    spectralSignature: 0

  }

  let resultNatural  = await _satLogic.generateURL(requestPayload, "LANDSAT/LC09/C02/T1_L2", ['SR_B4', 'SR_B3', 'SR_B2']);
  console.log(resultNatural);
  requestPayload.email = "preview2";
  let resultInfrared = await _satLogic.generateURL(requestPayload, "LANDSAT/LC09/C02/T1_L2", ['SR_B5', 'SR_B4', 'SR_B3']);
  requestPayload.email = "preview3";
  let resultVegetation = await _satLogic.generateURL(requestPayload, "LANDSAT/LC09/C02/T1_L2", ['SR_B6', 'SR_B5', 'SR_B4']);
  //let pathRow = await _satLogic.getPathRow(resultNatural);
  res.status(200).json([resultNatural, resultInfrared, resultVegetation]);
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
    const response = await axios.get('http://localhost:/'+port+'/checkSatellites');
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
