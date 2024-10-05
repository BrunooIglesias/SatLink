import { insertResult, getUsersInRegion, insertRequest, getResult } from '../dataAccess/userRequests';
import { promises as fsPromises } from 'fs';
import { requestDto } from '../dtos/requestDto';

export class UserLogic {

  createRequest = async (landsatCollection: requestDto) => {
    try {
      // Type guard: Ensure latitude and longitude are numbers
      if (typeof landsatCollection.latitude !== 'number' || typeof landsatCollection.longitude !== 'number') {
        throw new Error("Latitude and longitude must be numbers.");
      }

      const coordinates = [landsatCollection.latitude, landsatCollection.longitude];

      // Create bounding box of 4 coordinates around the given point
      const coordinatesBox = [
        [coordinates[0] + 0.1, coordinates[1] + 0.1],
        [coordinates[0] - 0.1, coordinates[1] + 0.1],
        [coordinates[0] + 0.1, coordinates[1] - 0.1],
        [coordinates[0] - 0.1, coordinates[1] - 0.1]
      ];

      const formattedCoordinatesBox = coordinatesBox.map(([lat, lon]) => ({
        lat: lat,
        lon: lon
      }));

      const dateFilters = { startDate: landsatCollection.fromDate, endDate: landsatCollection.toDate };

      await insertRequest(
        landsatCollection.email,
        landsatCollection.name,
        formattedCoordinatesBox,  // Updated this to use the surrounding coordinates
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
      console.log(results);
      return results;
    } catch (error) {
      console.error('Error fetching results:', error);
      return { message: "Failed to retrieve results", success: false, error };
    }
  }
}
