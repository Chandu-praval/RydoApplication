import axios from "axios";

export const api=axios.create({
    baseURL:"/",
    withCredentials:true
})
export const rideApi=axios.create({
     baseURL:"/Ride",
    withCredentials:true
})