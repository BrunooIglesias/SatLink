"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const satLogic_1 = require("./services/satLogic");
const axios_1 = __importDefault(require("axios"));
const userLogic_1 = require("./services/userLogic");
const app = (0, express_1.default)();
const port = 3000;
let cors = require('cors');
app.use(express_1.default.json());
app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
const _satLogic = new satLogic_1.SatLogic();
const _userLogic = new userLogic_1.UserLogic();
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/checkSatellites', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield initializeEE();
    yield _satLogic.checkSats();
    res.status(200).json("Satellites checked");
}));
app.get('/results/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield _userLogic.getResults(req.params.id);
    res.status(200).json(result[0][0]);
}));
app.post('/userRequest', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let request = req.body;
    yield _userLogic.createRequest(request);
    res.status(200).json("Request created");
}));
app.post('/preview', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield initializeEE();
    let requestPayload = {
        id: 1,
        email: "preview",
        coordinates: req.body.coordinates,
        satellite: "LANDSAT/LC09/C02/T1_L2",
        cloudCover: 100,
        dateFilters: { startDate: '', endDate: '' },
        metadata: 0,
        dataValues: 0,
        spectralSignature: 0
    };
    let resultNatural = yield _satLogic.generateURL(requestPayload, "LANDSAT/LC09/C02/T1_L2", ['SR_B4', 'SR_B3', 'SR_B2']);
    requestPayload.email = "preview2";
    let resultInfrared = yield _satLogic.generateURL(requestPayload, "LANDSAT/LC09/C02/T1_L2", ['SR_B5', 'SR_B4', 'SR_B3']);
    requestPayload.email = "preview3";
    let resultVegetation = yield _satLogic.generateURL(requestPayload, "LANDSAT/LC09/C02/T1_L2", ['SR_B6', 'SR_B5', 'SR_B4']);
    //let pathRow = await _satLogic.getPathRow(resultNatural);
    res.status(200).json([resultNatural, resultInfrared, resultVegetation]);
}));
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Express is listening at http://localhost:${port}`);
}));
var ee = require('@google/earthengine');
var fs = require('fs');
const initializeEE = () => __awaiter(void 0, void 0, void 0, function* () {
    var serviceAccount = 'my-service-account@...gserviceaccount.com';
    var privateKey = JSON.parse(fs.readFileSync('private-key.json', 'utf8'));
    yield new Promise((resolve, reject) => {
        ee.data.authenticateViaPrivateKey(privateKey, function () {
            ee.initialize(null, null, function () {
                console.log('Earth Engine client initialized.');
                resolve();
            }, function (e) {
                console.error('Error initializing Earth Engine: ', e);
                reject(e);
            });
        }, function (e) {
            console.error('Error authenticating: ', e);
            reject(e);
        });
    });
});
function checkForImages() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get('http://localhost:/' + port + '/checkSatellites');
            console.log('Satellites checked successfully:', response.data);
        }
        catch (error) {
            console.error('Error checking satellites:', error);
        }
    });
}
const cron = require('node-cron');
cron.schedule('0 */12 * * *', () => {
    console.log('Running cron job to check satellites...');
    checkForImages();
});
//# sourceMappingURL=app.js.map