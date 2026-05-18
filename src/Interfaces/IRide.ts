export interface IRide {
  availabilityId: number;
  startTime: string;
  endTime: string;
  availableDate: string;
  fromLocation: string;
  toLocation: string;
  vehicleNumber: string;
  price: number;
}
export interface IRideList {
  bookingId: number;
  vehicleNumber: string;
  price: number;
  status: number;
  customerName: string;
  fromLocation: string;
  toLocation: string;
  availableDate: string; 
  startTime: string;     
  endTime: string;
}
export interface IRideSearch {
  fromLocation: string;
  toLocation: string;
  selectedDate: string;
  vehicleType: string;
}
export interface IRideFormData {
  FromLocation: string;
  ToLocation: string;
  AvailableDate: string;
  VehicleId: string;
  StartTime: string;
  EndTime: string;
  Price: string;
}

export interface IRideCreationData {
  DriverId: number;
  DriverName: string;
  VehicleId: number;
  FromLocation: string;
  ToLocation: string;
  AvailableDate: string;
  StartTime: string;
  EndTime: string;
  Price: number;
}