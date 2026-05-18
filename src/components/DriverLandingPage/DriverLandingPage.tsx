import React, { useEffect, useState } from "react";
import "./DriverLandingPage.scss";
import { useAuth } from "../authContext/AuthContext";
import {getDriverData,registerRide} from "../../services/authService/AuthService";
import Validator from "../../services/ValidatorService";
import { ToastContainer, toast } from "react-toastify";
import FormInput from "../Common/formInput/FormInput";
import LocationInput from "../Common/locationInput/LocationInput";
import type { IRideFormData } from "../../Interfaces/IRide";
import type { IDriver } from "../../Interfaces/IDriver";
const emptyForm: IRideFormData = {
  FromLocation: "",
  ToLocation: "",
  AvailableDate: "",
  VehicleId: "",
  StartTime: "",
  EndTime: "",
  Price: "",
};
function DriverLandingPage() {
  const { userData } = useAuth();
  const [user, setUser] = useState<IDriver | null>(null);
  const [formData, setFormData] = useState<IRideFormData>(emptyForm);
  const [step, setStep] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [conflictError, setConflictError] = useState<string>("");
  useEffect(() => {
    const fetchDriver = async () => {
      if (userData?.role !== "driver") return;
      try {
        const response = await getDriverData(userData.userId);
        if (response?.data?.isSuccess) {
          setUser(response.data.data);
        }
      } catch {
        toast.error("Failed to load driver data");
      }
    };
    fetchDriver();
  }, [userData]);
  const ChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement >) => {
    const { name, value } = e.target;
    console.log(name);
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "StartTime" || name === "EndTime") {
      setConflictError("");
      setErrors((prev) => ({ ...prev, InvalidTime: "" }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.FromLocation)
        newErrors.FromLocation = "From location is required";
      if (!formData.ToLocation)
        newErrors.ToLocation = "To location is required";
      else if (formData.FromLocation &&formData.ToLocation &&formData.FromLocation.trim().toLowerCase() ===
          formData.ToLocation.trim().toLowerCase()
      ) {
        newErrors.SameLocation = "From and To locations cannot be the same";
      }
      if (!formData.AvailableDate) {
        newErrors.AvailableDate = "Date is required";
      } else if (!Validator().isValidFutureDate(formData.AvailableDate, true)) {
        newErrors.AvailableDate = "Select a future date";
      }
    }
    if (currentStep === 2) {
      if (!formData.StartTime) newErrors.StartTime = "Start time is required";
      if (!formData.EndTime) newErrors.EndTime = "End time is required";
      if (
        formData.StartTime &&
        formData.EndTime &&
        formData.StartTime >= formData.EndTime
      ) {
        newErrors.InvalidTime = "End Time must be greater than Start Time";
      }
      if (!formData.VehicleId) newErrors.VehicleId = "Select vehicle";
    }
    if (currentStep === 3) {
      if (!formData.Price || Number(formData.Price) <= 0) {
        newErrors.Price = "Invalid price";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const nextStep = () => {
    setConflictError("");
    if (validateStep(step)) setStep((prev) => prev + 1);
  };
  const prevStep = () => setStep((prev) => prev - 1);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;
    try {
      setLoading(true);
      const payload = {
        DriverId: Number(user?.driverId),
        DriverName: user?.fullName || "",
        VehicleId: Number(formData.VehicleId),
        FromLocation: formData.FromLocation,
        ToLocation: formData.ToLocation,
        AvailableDate: formData.AvailableDate,
        StartTime: formData.StartTime,
        EndTime: formData.EndTime,
        Price: Number(formData.Price),
      };
      const response = await registerRide(payload);
      if (response.data.isSuccess) {
        toast.success("Ride registered successfully!");
        setFormData(emptyForm);
        setStep(1);
        setErrors({});
      } else {
        toast.error("Failed to register ride");
      }
    } catch (err: any) {
      const apiResponse = err?.response?.data;
      if (apiResponse?.message) {
        setConflictError(apiResponse.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
       <ToastContainer autoClose={1000} />
        <div className="home-hero">
      <div className="left-section">
        <h1>Welcome, {user?.fullName || "User"}</h1>
        <p>Where you want to go today?</p>
        <ul>
          <li>Instant Ride</li>
          <li>Affordable Pricing</li>
          <li>Instant Payment</li>
        </ul>
      </div>
      <div className="right-section d-flex justify-content-center">
        <form className="booking-card" onSubmit={handleSubmit}>
          <h3 className="text-center mb-3 fw-bold">
            Register Ride (Step {step}/3)
          </h3>
          {step === 1 && (
            <>
              <div>
                <LocationInput
                  value={formData.FromLocation}
                  label="From"
                  onChange={(val) => {
                    setFormData((prev) => ({ ...prev, FromLocation: val }));

                    setErrors((prev) => ({
                      ...prev,
                      FromLocation: "",
                      ToLocation: "",
                      SameLocation:""
                    }));
                  }}
                  onSelect={(name, coords) =>
                    setFormData((prev) => ({
                      ...prev,
                      FromLocation: name,
                      FromCoords: coords,
                    }))
                  }
                  className="form-control"
                />
              <small className="text-danger p-0 error">{errors.FromLocation||""}</small> 
              </div>
              <div>
                <LocationInput
                  value={formData.ToLocation}
                  onChange={(val) => {
                    setFormData((prev) => ({ ...prev, ToLocation: val }));
                    setErrors((prev) => ({
                      ...prev,
                      ToLocation: "",
                        SameLocation:""
                    }));
                  }}
                  onSelect={(name, coords) =>
                    setFormData((prev) => ({
                      ...prev,
                      ToLocation: name,
                      ToCoords: coords,
                    }))
                  }
                  className="form-control"
                  label="To"
                />
              <small className="text-danger">{errors.ToLocation||""}</small>   
              </div>
              <FormInput
              required
                label="Date"
                type="date"
                name="AvailableDate"
                value={formData.AvailableDate}
                onChange={ChangeInput}
                error={errors.AvailableDate}
              />
              {errors.SameLocation && (
                <small className="text-danger">{errors.SameLocation||""}</small>
              )}
            </>
          )}
          {step === 2 && (
            <>
              <FormInput
                label="Start Time"
                type="time"
                required
                name="StartTime"
                value={formData.StartTime}
                onChange={ChangeInput}
                error={errors.StartTime}
              />
              <FormInput
                label="End Time"
                type="time"
                name="EndTime"
                required
                value={formData.EndTime}
                onChange={ChangeInput}
                error={errors.EndTime}
              />
              <div>
                <label className="vehicle d-flex"> <span >Vehicle</span> <span className="text-danger ms-1">*</span></label>
                <select
                  name="VehicleId"
                  className="form-select VehicleNumber"
                  value={formData.VehicleId}
                  onChange={ChangeInput}
                >
                  <option value="">Select vehicle</option>
                  {user?.vehicles?.map((v: any) => (
                    <option
                      key={v.vehicleId || v.VehicleId}
                      value={v.vehicleId || v.VehicleId}
                    >
                      {v.vehicleNumber || v.VehicleNumber}
                    </option>
                  ))}
                </select>
                <small className="text-danger">{errors.VehicleId}</small>
              </div>
                <small className="text-danger">{errors.InvalidTime}</small>
            </>
          )}
          {step === 3 && (
            <FormInput
              label="Price"
              type="number"
              required
              name="Price"
              value={formData.Price}
              onChange={ChangeInput}
              error={errors.Price}
            />
          )}
           {conflictError &&  <div className="alert alert-danger mt-3 py-2 small">
              {conflictError}
            </div>}
          <div className="d-flex gap-1">
            {step > 1 && (
              <button
                type="button"
                className="btn btn-secondary nxt-btn"
                onClick={prevStep}
              >
                Previous
              </button>
            )}
            {step < 3 && (
              <div className="d-flex justify-content-end w-100">
                <button
                  type="button"
                  className="btn btn-primary nxt-btn"
                  onClick={nextStep}
                >
                  Next
                </button>
              </div>
            )}
            {step === 3 && (
              <div className=" d-flex justify-content-end w-100">
                <button
                type="submit"
                className="btn btn-success w-50"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
    </>
   
  );
}
export default DriverLandingPage;
