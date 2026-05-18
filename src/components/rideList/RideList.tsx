import  { useEffect, useState } from "react";
import type { JSX } from "react";
import "./RideList.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllRidesBasedOnUserChocie,getCustomerData,BookRide } from "../../services/authService/AuthService";
import { useAuth } from "../authContext/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { ICustomer } from "../../Interfaces/ICustomer";
import type { IRide } from "../../Interfaces/IRide";
import ConfirmModal from "../Common/confirmModal/ConfirmModal";
function RideList(): JSX.Element {
  const [totalRides, setTotalRides] = useState<IRide[]>([]);
  const [user, setUser] = useState<ICustomer>();
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isbookingLoading, setIsBookingLoading] = useState(false);
  const [isshowConfirmModal, setIsShowConfirmModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState<IRide | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData;
  const { userData } = useAuth();
  
  const handleBookRide = (ride: IRide):void => {
    if (!userData) {
      navigate("/Login", {
        state: {
          redirectTo: "/rideList",
          rideListFormData: formData,
        },
      });
      return;
    }
    setSelectedRide(ride);
    setIsShowConfirmModal(true);
  };
  useEffect(() => {
    const getUser = async ():Promise<void> => {
      try {
        if (userData?.role === "user" && userData?.userId) {
          const response = await getCustomerData(userData.userId);
          if (!response?.data.isSuccess) {
            throw new Error("Failed to get Customer Data")
          }
           setUser(response.data.data);
        }
      } catch(err:unknown) {
          console.log(err)
      }
    };
    getUser();
  }, [userData]);
   useEffect(() => {
    getRideList();
  }, [formData]);
  const getRideList = async (): Promise<void> => {
    if (!formData) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllRidesBasedOnUserChocie(formData);
      if (!response.data.isSuccess) {
        throw new Error("Failed to fetch rides");
      }
      setTotalRides(response.data.data);
    } catch (err: unknown) {
      const message =err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };
  const confirmBooking = async ():Promise<void> => {
    if (!selectedRide || !user) return;
    try {
      setIsBookingLoading(true);
      const payload = {
        AvailabilityId: selectedRide.availabilityId,
        CustomerId: user.customerId,
        Price: selectedRide.price,
        status: 1,
        CustomerName: user.fullName,
      };
      const response = await BookRide(payload);
      if (response?.data.isSuccess) {
        await getRideList();
        toast.success("Ride booked successfully");
        setIsShowConfirmModal(false);
      } else {
        throw new Error("Booking failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsBookingLoading(false);
    }
  };
  if (!formData) {
    return <h3 className="text-center mt-5">No search data provided</h3>;
  }
  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h3 className="mb-4">Available Rides</h3>
      {isloading && <p>Loading rides...</p>}
      {error && (
        <div className="alert alert-danger">
          <p>{error}</p>
        </div>
      )}
      {!isloading && totalRides?.length === 0 && !error && (
        <div className="alert alert-info shadow-sm">
          <h4>No rides found on this date</h4>
          <p>Try searching for a different location or date.</p>
        </div>
      )}
      <div className="ride-results">
        {totalRides.map((ride) => (
          <div
            className="card w-100 mb-3 shadow-sm ride-card"
            key={ride.availabilityId}
          >
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-3">
                  <h5 className="mb-0">
                    {ride.startTime} - {ride.endTime}
                  </h5>
                  <small className="text-muted">
                    {ride.availableDate}
                  </small>
                </div>
                <div className="col-md-5">
                  <div className="d-flex align-items-center">
                    <strong>{ride.fromLocation}</strong>
                    <span className="mx-2">➔</span>
                    <strong>{ride.toLocation}</strong>
                  </div>
                  <div className="text-secondary small mt-1">
                    Vehicle: {ride.vehicleNumber}
                  </div>
                </div>

                <div className="col-md-2 text-center">
                  <h4 className="text-success mb-0">
                    Rs.{ride.price}
                  </h4>
                </div>
                <div className="col-md-2 text-end">
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => handleBookRide(ride)}
                    disabled={isbookingLoading}
                  >
                    {isbookingLoading ? "Booking..." : "Book Ride"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    {selectedRide &&
    <ConfirmModal isOpenModal={isshowConfirmModal}
    closeModal={()=>setIsShowConfirmModal(false)}
    submit={confirmBooking} 
    confirmText="book this ride?"
    confirmBtnText=""
    /> 
    }
    </div>
    
  );
}
export default RideList;