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
const app = (0, express_1.default)();
const port = 3000;
const _satLogic = new satLogic_1.SatLogic();
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/checkSatellites', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield initializeEE();
    yield _satLogic.checkSats();
    res.status(200).json("Satellites checked");
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
//# sourceMappingURL=app.js.map