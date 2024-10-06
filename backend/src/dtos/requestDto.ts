export class requestDto {
  latitude: string;
  longitude: string;
  name: string | null;
  email: string | null;
  satellite: string;
  cloudThreshold: number;
  mostRecent : boolean;
  metadata : boolean;
  dataValues : boolean;
  spectralSignature : boolean;
  fromDate : Date | null;
  toDate : Date | null;
}
