
import type { IVehicle } from "./IVehicle";
import type { IRideList } from "./IRide";
import type { IUserCommonData } from "./IUserData";
export interface IDriver extends IUserCommonData {
  driverId:string,
  licenseNumber:string,
  licenseExpiryDate :string,
  experienceYears:string,
  vehicles:IVehicle[],
  rating:string,
  ridesList:IRideList[]
}