import {useState,useContext,createContext,useEffect} from "react";
import type { ReactNode } from "react";
import { getMe,Userlogout } from "../../services/authService/AuthService";
import type { IAuthContext } from "../../Interfaces/IAuthContext";
import type { IUserData } from "../../Interfaces/IUserData";
export const AuthContext=createContext<IAuthContext|undefined>(undefined);
export const AuthProvider=({children}:{children: ReactNode })=>{
    const [userData,setUserData]=useState<IUserData|null>(null);
    const [isLoading,setIsLoading] =useState<boolean>(true);
     const checkAuthStatus = async ():Promise<void> => {
    try {
      const response = await getMe(); 
      setUserData(response.data); 
    } catch (error) {
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(()=>{
 checkAuthStatus();
  },[])
  const login=(userData:IUserData)=>setUserData(userData);
  const logout=async ():Promise<void>=>{
    try{
        await Userlogout();
    }
    catch(err){
        console.log(err)
    }
    finally{
        setUserData(null);
    }
  }
return (
    <AuthContext.Provider value={{ userData, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};