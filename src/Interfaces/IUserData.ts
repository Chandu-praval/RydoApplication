export interface IUserData{
    userId:string,
    emailId:string,
    role:"user"|"driver"
}
export interface IUserCommonData extends IUserData{
    fullName:string,
    phoneNumber:string,
    address?:string,
}