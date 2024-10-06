import { insertResult, getUsersInRegion, insertRequest, getResult } from '../dataAccess/userRequests';
import { promises as fsPromises } from 'fs';
import { requestDto } from '../dtos/requestDto';

export class UserLogic {

  createRequest = async (landsatCollection: requestDto) => {
    try {
      if (typeof landsatCollection.latitude !== 'number' || typeof landsatCollection.longitude !== 'number') {
        throw new Error("Latitude and longitude must be numbers.");
      }

      const formattedCoordinates = {
        lat: landsatCollection.latitude,
        lon: landsatCollection.longitude
      };

      const dateFilters = { startDate: landsatCollection.fromDate, endDate: landsatCollection.toDate };

      // Send the request with the single coordinate object
      await insertRequest(
        landsatCollection.email,
        landsatCollection.name,
        formattedCoordinates, 
        landsatCollection.satellite,
        landsatCollection.cloudThreshold,
        dateFilters,
        landsatCollection.metadata,
        landsatCollection.dataValues,
        landsatCollection.spectralSignature
      );

      return { message: "Request created successfully", success: true };
    } catch (error) {
      console.error('Error creating request:', error);
      return { message: "Failed to create request", success: false, error };
    }
  }

  getResults = async (idResult: string) => {
    try {
      const results = await getResult(idResult);
      return results;
    } catch (error) {
      console.error('Error fetching results:', error);
      return { message: "Failed to retrieve results", success: false, error };
    }
  }
}
