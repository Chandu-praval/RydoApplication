
import type { IFormData } from "../../Interfaces/IFormData";
import type { ILoginFormData } from "../../Interfaces/ILoginFormData";
import type { IRideSearch } from "../../Interfaces/IRide";
import type { IBookRide } from "../../Interfaces/IBookRide";
import type { IRideCreationData } from "../../Interfaces/IRide";
import { api } from "../api/AxiosInstanceService";
export const Userlogin = (data: ILoginFormData) => api.post("/Auth/login", data);
export const getMe = () => api.get("/Auth/me");
export const Userlogout = () => api.post("/Auth/logout");
export const createCustomer = (data: IFormData) => api.post("/Customer", data);
export const getCustomerData = (id: string) => api.get(`/Customer/${id}`);
export const createDriver = (data: IFormData) => api.post("/Driver", data);
export const getDriverData = (id: string) => api.get(`/Driver/${id}`);
export const registerRide = (data: IRideCreationData) => api.post("/Ride/RegisterRide", data);
export const getAllRidesBasedOnUserChocie = (formData: IRideSearch) => {
  const params = new URLSearchParams({
    FromLocation: formData.fromLocation,
    ToLocation: formData.toLocation,
    selectedDate: formData.selectedDate,
    VehicleType: formData.vehicleType
  }).toString();
  return api.get(`/Ride?${params}`);
};
export const UpdateUser = (data: ILoginFormData) => api.post("/User/credentials/reset", data);
export const BookRide = (data: IBookRide) => api.post("/Booking", data);
