import { useEffect, useState } from "react";
import { useAuth } from "../authContext/AuthContext";
import { getCustomerData, getDriverData } from "../../services/authService/AuthService";
import RideTable from "../rideTable/RideTable";
import "./Profile.scss";
import type { IDriver } from "../../Interfaces/IDriver";
import type { ICustomer } from "../../Interfaces/ICustomer";
import type { IVehicle } from "../../Interfaces/IVehicle";
export default function Profile() {
  const { userData } = useAuth();
  const [user, setUser] = useState<IDriver | ICustomer | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      if (!userData?.userId) return;
      try {
        const response =
          userData.role === "user"
            ? await getCustomerData(userData.userId)
            : await getDriverData(userData.userId);

        if (response?.data?.isSuccess) {
          setUser(response.data.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [userData]);

  if (!userData) {
    return <h3 className="text-center mt-5">Please login</h3>;
  }
  if (!user) {
    return <p className="text-center mt-5">Loading profile...</p>;
  }
  const isDriver = (
  u: IDriver | ICustomer
): u is IDriver => "vehicles" in u;

const isCustomer = (
  u: IDriver | ICustomer
): u is ICustomer => !("vehicles" in u);
  return (
    <div className="container mt-2 profile-container">
      <div className="card shadow profile-card p-4">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="profile-name">{user.fullName}</h4>
            <span className="badge roleBadge">
              {isCustomer(user) ? "Customer" : "Driver"}
            </span>
          </div>
        </div>
        <div className="profile-details">
          <div className="profile-item">
            <strong>Phone</strong>
            <span className="profile-content">{user.phoneNumber}</span>
          </div>
          {isCustomer(user) && (
            <>
              <div className="profile-item">
                <strong>Email</strong>
                <span className="profile-content">{user.emailId}</span>
              </div>

              <div className="profile-item">
                <strong>Address</strong>
                <span className="profile-content">{user.address}</span>
              </div>
            </>
          )}
          {isDriver(user) && (
            <div className="profile-item">
              <strong>Vehicle</strong>
              {user.vehicles && user.vehicles?.length > 0 ? (
                user.vehicles.map((vehicle: IVehicle, index: number) => (
                  <span key={index} className="d-block vehicle">
                    {vehicle?.vehicleNumber}
                  </span>
                ))
              ) : (
                <span>No vehicles available</span>
              )}
            </div>
          )}
        </div>
        <h5 className="section-title">Ride History</h5>
        {user.ridesList && user.ridesList?.length > 0 ? (
          <RideTable rides={user.ridesList} role={userData.role.toString()} />
        ) : (
          <div className="d-flex w-100 justify-content-center">
            <h4>No rides found</h4>
          </div>
        )} 
      </div>
    </div>
  );
}
