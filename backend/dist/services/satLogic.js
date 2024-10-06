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
exports.SatLogic = void 0;
const userRequests_1 = require("../dataAccess/userRequests");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path")); // Import path module for file path management
class SatLogic {
    constructor() {
        // Method to get satellite location
        this.getSatelliteLocation = (landsatCollection) => __awaiter(this, void 0, void 0, function* () {
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
        });
        // Method to check satellites
        this.checkSats = () => __awaiter(this, void 0, void 0, function* () {
            let satellites = ["LANDSAT/LC09/C02/T1_L2", "LANDSAT/LC08/C02/T1_L2", "NASA/HLS/HLSL30/v002"];
            for (let i = 0; i < satellites.length; i++) {
                yield this.checkAndSendPictures(satellites[i]);
            }
        });
        // Method to check and send pictures
        this.checkAndSendPictures = (satellite) => __awaiter(this, void 0, void 0, function* () {
            let coordinates = yield this.getSatelliteLocation(satellite);
            console.log("Coordinates of " + satellite + ": ", coordinates);
            let usersData = yield this.getInterestedUsers(coordinates, satellite);
            if (usersData.length === 0) {
                console.log("No users found for satellite: ", satellite);
            }
            let bandsToUse = ['SR_B4', 'SR_B3', 'SR_B2'];
            for (let userData of usersData) {
                yield this.generateData(userData, satellite, bandsToUse); // Await the data generation
            }
        });
        // Method to get interested users
        this.getInterestedUsers = (coordinates, satellite) => __awaiter(this, void 0, void 0, function* () {
            var ee = require('@google/earthengine');
            let InterestedUsers = yield (0, userRequests_1.getUsersInRegion)(coordinates, satellite); // Await the result
            return InterestedUsers;
        });
        // Method to generate data
        this.generateData = (userData, satellite, bandsToUse) => __awaiter(this, void 0, void 0, function* () {
            const ee = require('@google/earthengine');
            const fs = require('fs');
            const https = require('https');
            const sharp = require('sharp'); // Import sharp for image processing
            const privateKey = JSON.parse(yield fs_1.promises.readFile('./private-key.json', 'utf8')); // Use fsPromises
            console.log("Generating data for user: ", userData.email);
            let point = ee.Geometry.Point([userData.coordinates.lon, userData.coordinates.lat]);
            let box = ee.Geometry.Polygon([[[userData.coordinates.lon - 0.5, userData.coordinates.lat - 0.5], [userData.coordinates.lon - 0.5, userData.coordinates.lat + 0.5], [userData.coordinates.lon + 0.5, userData.coordinates.lat + 0.5], [userData.coordinates.lon + 0.5, userData.coordinates.lat - 0.5]]]);
            yield new Promise((resolve, reject) => {
                ee.data.authenticateViaPrivateKey(privateKey, function () {
                    ee.initialize(null, null, function () {
                        return __awaiter(this, void 0, void 0, function* () {
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
                                    const downloadURL = yield collection.getDownloadURL({
                                        name: `${satellite}_image`,
                                        bands: bandsToUse, // Bandas RGB
                                        region: collection.geometry(),
                                        scale: 500,
                                        format: 'GEO_TIFF'
                                    });
                                    console.log('Download URL for the mosaic of Landsat image:', downloadURL);
                                    // Use path module to create a valid file path
                                    let filePath = path_1.default.join(__dirname, `${userData.email}.tif`); // Create the full path
                                    const file = fs.createWriteStream(filePath);
                                    https.get(downloadURL, function (response) {
                                        response.pipe(file);
                                        file.on('finish', function () {
                                            return __awaiter(this, void 0, void 0, function* () {
                                                file.close();
                                                console.log("Image downloaded to " + filePath);
                                                // Convert the TIFF to JPEG using sharp
                                                const jpegFilePath = path_1.default.join(__dirname, `${userData.email}.jpg`); // Create JPEG file path
                                                try {
                                                    yield sharp(filePath)
                                                        .jpeg({ quality: 80 })
                                                        .toFile(jpegFilePath);
                                                    console.log("Image converted to JPEG: " + jpegFilePath);
                                                    // Read the JPEG image into a buffer
                                                    const imageBuffer = yield fs_1.promises.readFile(jpegFilePath);
                                                    // Spectral Signature
                                                    let spectralValues = null;
                                                    if (userData.spectralSignature) {
                                                        var geometry = collection.geometry();
                                                        var centroid = geometry.centroid();
                                                        spectralValues = yield collection.reduceRegion({
                                                            reducer: ee.Reducer.first(),
                                                            geometry: centroid,
                                                            scale: 1000
                                                        }).getInfo();
                                                    }
                                                    // Data Values
                                                    let pixelValue = null;
                                                    if (userData.dataValues === 1) {
                                                        var temperatureBand = collection.select(['ST_B10']);
                                                        pixelValue = yield temperatureBand.reduceRegion({
                                                            reducer: ee.Reducer.mean(),
                                                            geometry: point,
                                                            scale: 30
                                                        }).getInfo();
                                                    }
                                                    // Metadata in CSV format
                                                    let fileName = '';
                                                    let csvContent = null;
                                                    if (userData.metadata === 1) {
                                                        console.log("Getting CSV metadata...");
                                                        const metadata = yield collection.toDictionary().getInfo(); // Use await
                                                        csvContent = convertMetadataToCSV(metadata);
                                                    }
                                                    // Insert the result into the database
                                                    if (userData.email !== "preview" && userData.email !== "preview2" && userData.email !== "preview3") {
                                                        yield (0, userRequests_1.insertResult)(userData.email, userData.name, imageBuffer, csvContent, pixelValue, spectralValues, downloadURL);
                                                        console.log("Result inserted correctly for: ", userData.email);
                                                    }
                                                    resolve(downloadURL);
                                                }
                                                catch (error) {
                                                    console.error("Error converting image:", error);
                                                    reject(error);
                                                }
                                            });
                                        });
                                    });
                                }
                                else {
                                    reject(new Error(`No mosaic found for satellite: ${satellite}`));
                                }
                            }
                            catch (error) {
                                console.error("Error retrieving image:", error);
                                reject(error);
                            }
                        });
                    });
                });
            });
        });
        this.generateURL = (userData, satellite, bandsToUse) => __awaiter(this, void 0, void 0, function* () {
            console.log("Generating data for user: ", userData.email);
            const ee = require('@google/earthengine');
            const fs = require('fs');
            const https = require('https');
            const sharp = require('sharp'); // Import sharp for image processing
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
            return new Promise((resolve, reject) => {
                ee.data.authenticateViaPrivateKey(privateKey, function () {
                    ee.initialize(null, null, function () {
                        return __awaiter(this, void 0, void 0, function* () {
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
                                    const downloadURL = yield collection.getDownloadURL({
                                        name: `${satellite}_image`,
                                        bands: bandsToUse, // Select bands to use, e.g., RGB bands
                                        region: box, // Use the bounding box geometry
                                        scale: 100, // Scale in meters
                                        format: 'GEO_TIFF' // Format to GeoTIFF
                                    });
                                    console.log('Download URL generated:', downloadURL);
                                    let filePath = userData.email + ".tif";
                                    const file = fs.createWriteStream(filePath);
                                    https.get(downloadURL, function (response) {
                                        response.pipe(file);
                                        file.on('finish', function () {
                                            return __awaiter(this, void 0, void 0, function* () {
                                                file.close();
                                                console.log("Image downloaded to " + userData.email + ".tif");
                                                // Convert the TIFF to JPEG using sharp
                                                const jpegFilePath = userData.email + ".jpg";
                                                try {
                                                    yield sharp(filePath)
                                                        .jpeg() // Set JPEG quality if needed
                                                        .toFile(jpegFilePath);
                                                    console.log("Image converted to JPEG: " + jpegFilePath);
                                                    // Read the JPEG image into a buffer
                                                    const imageBuffer = yield fs.readFileSync(jpegFilePath);
                                                    resolve(imageBuffer);
                                                }
                                                catch (error) {
                                                    console.error("Error converting image:", error);
                                                    reject(error);
                                                }
                                            });
                                        });
                                    });
                                }
                                else {
                                    reject(new Error(`No images found for satellite: ${satellite}`));
                                }
                            }
                            catch (err) {
                                console.error("Error generating URL for satellite:", satellite, err);
                                reject(err);
                            }
                        });
                    });
                });
            });
        });
        // Method to get path and row
        this.getPathRow = (collection) => __awaiter(this, void 0, void 0, function* () {
            var path = "";
            var row = "";
            yield collection.toDictionary().getInfo((metadata) => __awaiter(this, void 0, void 0, function* () {
                console.log("Metadata:", metadata);
                path = metadata.WRS_PATH;
                row = metadata.WRS_ROW;
            }));
            return { "path": path, "row": row };
        });
    }
}
exports.SatLogic = SatLogic;
// Helper function to convert metadata to CSV
function convertMetadataToCSV(metadata) {
    var csv = 'Property,Value\n'; // Cabecera del CSV
    for (var key in metadata) {
        csv += key + ',' + metadata[key] + '\n';
    }
    return csv;
}
//# sourceMappingURL=satLogic.js.map