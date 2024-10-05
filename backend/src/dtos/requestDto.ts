export class requestDto {
  latitude: string;
  longitude: string;
  name: string;
  email: string;
  satellite: string;
  cloudThreshold: number;
  mostRecent : boolean;
  metadata : boolean;
  dataValues : boolean;
  spectralSignature : boolean;
  fromDate : Date | null;
  toDate : Date | null;
}
