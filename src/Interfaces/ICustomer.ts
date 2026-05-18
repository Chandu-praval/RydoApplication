import type { IUserCommonData } from "./IUserData";
import type { IRideList } from "./IRide";
export interface ICustomer extends IUserCommonData {
  userId: string;
  customerId: number;
  ridesList: IRideList[];
}