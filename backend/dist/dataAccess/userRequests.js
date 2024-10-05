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
const promise_1 = __importDefault(require("mysql2/promise"));
function insertRequest(email, name, coordinates, satellite) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield promise_1.default.createConnection({
                host: 'localhost',
                port: 3306,
                user: 'myuser', // Replace with your MySQL username
                password: 'mypassword', // Replace with your MySQL password
                database: 'mydatabase', // Replace with your MySQL database name
            });
            const pendingRequestQuery = `
            INSERT INTO PendingRequests (email, name, coordinates, satellite) 
            VALUES (?, ?, ?, ?)`;
            yield connection.execute(pendingRequestQuery, [
                email,
                name,
                coordinates,
                satellite
            ]);
            console.log('Inserted into PendingRequests successfully.');
        }
        catch (error) {
        }
    });
}
function insertResult(email, name, image) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield promise_1.default.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'myuser', // Replace with your MySQL username
            password: 'mypassword', // Replace with your MySQL password
            database: 'mydatabase', // Replace with your MySQL database name
        });
        const resultsRequestQuery = `
        INSERT INTO ResultsRequests (email, name, image) 
        VALUES (?, ?, ?)`;
        try {
            yield connection.execute(resultsRequestQuery, [
                email,
                name,
                image
            ]);
            console.log('Inserted into ResultsRequests successfully.');
        }
        catch (error) {
            console.error('Error inserting data:', error);
        }
    });
}
//# sourceMappingURL=userRequests.js.map