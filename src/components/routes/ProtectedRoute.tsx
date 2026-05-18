import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../authContext/AuthContext";
import type { JSX } from "react";
interface IProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[];
}
function ProtectedRoute({ children, allowedRoles }: IProtectedRouteProps): JSX.Element {
  const { isLoading, userData } = useAuth();
  const location = useLocation();
  if (isLoading) {
    return <div>Loading...</div>;
  }
   if (!userData) {
    return (
      <Navigate
        to="/login"
        state={{
          redirectTo: location.pathname + location.search
        }}
        replace
      />
    );
  }
  if (allowedRoles && !allowedRoles.includes(userData.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
export default ProtectedRoute;