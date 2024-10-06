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
exports.insertRequest = insertRequest;
exports.insertResult = insertResult;
exports.getUsersInRegion = getUsersInRegion;
exports.getResult = getResult;
const promise_1 = __importDefault(require("mysql2/promise"));
function insertRequest(email, name, coordinates, satellite, cloudCover, dateFilters, metadata, dataValues, spectralSignature) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield promise_1.default.createConnection({
                host: 'localhost',
                port: 3306,
                user: 'myuser',
                password: 'mypassword',
                database: 'mydatabase',
            });
            const pendingRequestQuery = `
            INSERT INTO PendingRequests (email, name, coordinates, satellite, cloudCover, dateFilters, metadata, dataValues, spectralSignature) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            yield connection.execute(pendingRequestQuery, [
                email,
                name,
                coordinates,
                satellite,
                cloudCover,
                dateFilters,
                metadata,
                dataValues,
                spectralSignature
            ]);
            console.log('Inserted into PendingRequests successfully.');
        }
        catch (error) {
            console.log('Error inserting data:', error, 'Data received: ', email, name, coordinates, satellite, cloudCover, dateFilters, metadata, dataValues, spectralSignature);
        }
    });
}
function insertResult(email, name, image, metadata, dataValues, spectralSignature, imageFile) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield promise_1.default.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'myuser', // Replace with your MySQL username
            password: 'mypassword', // Replace with your MySQL password
            database: 'mydatabase', // Replace with your MySQL database name
        });
        const resultsRequestQuery = `
        INSERT INTO ResultsRequests (email, name, image, metadata, dataValues, spectralSignature, ImageFile) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
        try {
            const params = [
                email || null,
                "name",
                image || null,
                metadata || null,
                dataValues || null,
                spectralSignature || null,
                imageFile || null
            ];
            yield connection.execute(resultsRequestQuery, params);
            console.log('Inserted into ResultsRequests successfully.');
        }
        catch (error) {
            console.error('Error inserting data:', error);
        }
    });
}
function getUsersInRegion(regionCoordinates, paramSatellite) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield promise_1.default.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'myuser',
            password: 'mypassword',
            database: 'mydatabase',
        });
        try {
            const [rows] = yield connection.execute('SELECT * FROM PendingRequests WHERE satellite = ?', [paramSatellite]);
            const usersInRegion = [];
            rows.forEach((row) => {
                const userCoordinates = row.coordinates; // Assuming coordinates are stored as JSON in DB
                // Check if the user's coordinates are inside the region
                if (isPointInSquare(userCoordinates, regionCoordinates)) {
                    usersInRegion.push({
                        id: row.id,
                        email: row.email,
                        coordinates: userCoordinates,
                        satellite: row.satellite,
                        cloudCover: row.cloudCover,
                        dateFilters: row.dateFilters,
                        metadata: row.metadata,
                        dataValues: row.dataValues,
                        spectralSignature: row.spectralSignature
                    });
                }
            });
            return usersInRegion;
        }
        catch (error) {
            console.error('Error querying the database:', error);
            throw error;
        }
        finally {
            yield connection.end();
        }
    });
}
function getResult(userParamId) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield promise_1.default.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'myuser',
            password: 'mypassword',
            database: 'mydatabase',
        });
        try {
            const rows = yield connection.execute('SELECT dataValues,SpectralSignature,image FROM ResultsRequests WHERE id = ?', [userParamId]);
            if (rows.length === 0) {
                console.log(`No results found for ID: ${userParamId}`);
                return [];
            }
            return rows;
        }
        catch (error) {
            console.error('Error fetching results:', error);
            throw error;
        }
        finally {
            yield connection.end();
        }
    });
}
function isPointInSquare(point, square) {
    return true;
    const [lngP, latP] = point;
    const lats = square.map(coord => coord[1]); // Get latitudes from square
    const lngs = square.map(coord => coord[0]); // Get longitudes from square
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    return (lngP >= minLng && lngP <= maxLng) && (latP >= minLat && latP <= maxLat);
}
//# sourceMappingURL=userRequests.js.map