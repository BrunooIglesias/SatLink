import { insertResult, getUsersInRegion, insertRequest } from '../dataAccess/userRequests';
import { promises as fsPromises } from 'fs';
import { requestDto } from '../dtos/requestDto';

export class UserLogic {


  createRequest = async (landsatCollection : requestDto) => {
      let coordinates = [landsatCollection.latitude, landsatCollection.longitude]
      let dateFilters = {startDate: landsatCollection.fromDate, endDate: landsatCollection.toDate}
      await insertRequest(landsatCollection.email, landsatCollection.name, coordinates, landsatCollection.satellite, landsatCollection.cloudThreshold, dateFilters, landsatCollection.metadata, landsatCollection.dataValues, landsatCollection.spectralSignature);
      return "Request created";
  }

  
}
