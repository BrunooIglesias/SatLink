import { insertResult, getUsersInRegion, insertRequest, getResult} from '../dataAccess/userRequests';
import { promises as fsPromises } from 'fs';
import { requestDto } from '../dtos/requestDto';

export class UserLogic {


  createRequest = async (landsatCollection : requestDto) => {
      let coordinates = [landsatCollection.latitude, landsatCollection.longitude]
      let dateFilters = {startDate: landsatCollection.fromDate, endDate: landsatCollection.toDate}
      await insertRequest(landsatCollection.email, landsatCollection.name, coordinates, landsatCollection.satellite, landsatCollection.cloudThreshold, dateFilters, landsatCollection.metadata, landsatCollection.dataValues, landsatCollection.spectralSignature);
      return "Request created";
  }
  getResults = async (idResult) => {
    let results = await getResult(idResult);
    console.log(results);
    return results;
  }

  
}
