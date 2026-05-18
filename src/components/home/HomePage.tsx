import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.scss";
import { useAuth } from "../authContext/AuthContext";
import { getCustomerData } from "../../services/authService/AuthService";
import Validator from "../../services/ValidatorService";
import { toast } from "react-toastify";
import type { IDriver } from "../../Interfaces/IDriver";
import type { ICustomer } from "../../Interfaces/ICustomer";
import type { IRideSearch } from "../../Interfaces/IRide";
import LocationInput from "../Common/locationInput/LocationInput";
const trustBadges = [
  {
    icon: "verified",
    label: "Vetted Drivers",
  },
  {
    icon: "timer",
    label: "Real-time Tracking",
  },
];
const emptyForm: IRideSearch = {
  fromLocation: "",
  toLocation: "",
  selectedDate: "",
  vehicleType: "",
};
function HomePage() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [user, setUser] =useState<ICustomer | IDriver | null>(null);
  const [isLoading, setIsLoading] =
    useState<boolean>(true);
  const [formData, setFormData] =
    useState<IRideSearch>(emptyForm);
  const [errors, setErrors] =
    useState<Record<string, string>>({});
  useEffect(() => {
    let isMounted = true;
    const fetchUserData = async () => {
      if (!userData?.userId) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await getCustomerData(
          userData.userId
        );

        if (isMounted && response.data.isSuccess) {
          setUser(response.data.data);
        }
      } catch {
        toast.error("Failed to load user data");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchUserData();
    return () => {
      isMounted = false;
    };
  }, [userData]);
  const isValidForm = (): boolean => {
    const newError: Record<string, string> = {};

    if (!formData.fromLocation.trim()) {
      newError.fromLocation =
        "From location is required";
    }
    if (!formData.toLocation.trim()) {
      newError.toLocation =
        "Destination is required";
    }
    else if (
      formData.fromLocation.trim().toLowerCase() ===
      formData.toLocation.trim().toLowerCase()
    ) {
      newError.sameLocationError =
        "From and To locations cannot be same";
    }
    if (!formData.selectedDate) {
      newError.selectedDate =
        "Date is required";
    } else if (
      !Validator().isValidFutureDate(
        formData.selectedDate,
        true
      )
    ) {
      newError.selectedDate =
        "Select today's or future date";
    }
    setErrors(newError);
    return Object.keys(newError).length === 0;
  };
  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    if (!isValidForm()) return;
    navigate("/rideList", {
      state: { formData },
    });
  };
  return (
    <section className="hero-section">
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXf0xWD9kbQCT2KHVLSleoJ11ZA1WWCkWnMRCPTdih_6Qn3o7v3mD13wFL2OmNQFxyZ5bN_JwCrI1ecrzBub3VdRkgqcLK3nr4P_NUTlVnRDvGnTGf7nalDp68GkmbxjhyhvZQBeLGzFvF3XghogWsiJhiTgO58jjo5OfXjPWTz9fedQKmt-_Lfvts8hy6Z-HMRq_Cy7PRsiruzwpRkAmwiJf3tRHaU9hz3dit5dVhoPR5jnIjeh-mNwCknAwWMyyUXxBaXz4TdbY"
        alt="Hero"
        className="hero-bg-image"
      />
      <div className="hero-overlay "></div>
      <div className="hero-content max-content w-100 mt-0">
        <div className="row align-items-center g-5">
          <div className="col-12 col-lg-6 vh-100 d-flex align-items-center justify-content-center mb-4">
           <div className="mb-5">
             {isLoading ? (
              <h2 className="text-white">
                Loading...
              </h2>
            ) : user ? (
              <h5 className="welcome-text">
                Welcome {user.fullName}
              </h5>
            ) : null}

            <h1 className="hero-display-title">
              Ride Anywhere,
              <br />

              <span className="accent">
                Anytime with Rydo
              </span>
            </h1>

            <p className="hero-subtitle">
              Book your ride instantly. Safe,
              fast and affordable travel.
            </p>
            <div className="d-flex flex-wrap gap-4">
              {trustBadges.map((badge) => (
                <div
                  className="trust-badge"
                  key={badge.label}
                >
                  <span className="material-symbols-outlined badge-icon">
                    {badge.icon}
                  </span>

                  <span>{badge.label}</span>
                </div>
              ))}

            </div>
           </div>
          </div>

          <div className="col-12 col-lg-6  p-0 ">

          <div className="w-100  d-flex justify-content-center p-0 vh-100 ">
              <div className="booking-card w-50 h-100 p-3 px-4 ms-5">
              <h3 className="booking-card-title  ">
                Find a Ride
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-1 mt-1">
                  <LocationInput
                    value={formData.fromLocation}
                    placeholder="From"
                    onChange={(val) => {
                      setFormData((prev) => ({
                        ...prev,
                        fromLocation: val,
                      }));

                      setErrors((prev) => ({
                        ...prev,
                        fromLocation: "",
                        sameLocationError: "",
                      }));
                    }}
                    onSelect={(name, coords) =>
                      setFormData((prev) => ({
                        ...prev,
                        fromLocation: name,
                        fromCoords: coords,
                      }))
                    }
                   className="form-control booking-input "
                   label="To Location"
                  />

                  <small className="text-danger error">
                    {errors.fromLocation || ""}
                  </small>
                </div>

                <div className="mb-1">
                  <LocationInput
                    value={formData.toLocation}
                    placeholder="To"
                    onChange={(val) => {
                      setFormData((prev) => ({
                        ...prev,
                        toLocation: val,
                      }));

                      setErrors((prev) => ({
                        ...prev,
                        toLocation: "",
                        sameLocationError: "",
                      }));
                    }}
                    onSelect={(name, coords) =>
                      setFormData((prev) => ({
                        ...prev,
                        toLocation: name,
                        toCoords: coords,
                      }))
                    }
                    className="form-control booking-input "
                    label="From Location"
                  />
                    <small className="text-danger error">
                    {errors.toLocation || ""}
                  </small>
                 
                </div>

                <div className="mb-1">
                  <label htmlFor="date" className="label d-flex"><span>Date</span> <span className="text-danger required">*</span></label>
                  <input
                    type="date"
                    className="form-control booking-input"
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    value={formData.selectedDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        selectedDate: e.target.value,
                      }))
                    }
                  />

                 <small className="text-danger error">
                    {errors.selectedDate || ""}
                  </small>
                </div>

                <div className="mb-1">
                  <label htmlFor="vehicleType" className="label">Vehicle Type</label>
                  <select
                    className="form-select booking-input"
                    value={formData.vehicleType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        vehicleType: e.target.value,
                      }))
                    }
                  >
                    <option value="" >
                      Select Vehicle
                    </option>

                    <option value="bike">
                      Bike
                    </option>

                    <option value="car">
                      Car
                    </option>
                  </select>
                </div>
                <small className="text-danger d-block  error">
                  {errors.sameLocationError || ""}
                </small>

                <button
                  type="submit"
                  className="booking-search-btn"
                >
                  Search Rides
                </button>

              </form>
              
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default HomePage;