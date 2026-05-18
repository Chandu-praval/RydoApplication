 import type { IUserData } from "./IUserData"
 export interface IAuthContext{
    userData:IUserData|null,
    isLoading:boolean,
    login:(user:IUserData)=>void,
    logout:()=>void
}