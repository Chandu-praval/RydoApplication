function Validator(){
    const isValidEmail=(email:string):boolean =>{
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,25}$/.test(email.trim());
    }
      const isValidMobile=(mobile:string):boolean=> {
        return /^[6-9][0-9]{9}$/.test(mobile.trim());
    }
    const isValidPassword=(password:string):boolean=>{
        return /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(password);
    }
    const isValidFutureDate=(date:string,isRideRegister:boolean=false):boolean=>{
        const inputDate = new Date(date);
        const today = new Date();
        inputDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        return isRideRegister?inputDate>=today:inputDate>today;
    }
    const isValidName=(name:string)=>{
        return /^[a-zA-Z ]{3,}$/.test(name);
    }
    return {
        isValidEmail,isValidMobile,isValidPassword, isValidFutureDate,isValidName
    }
}
export default Validator;