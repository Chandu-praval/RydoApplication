import React, { useState } from "react";
import type { JSX } from "react";
import "./Signup.scss";
import { useNavigate } from "react-router-dom";
import type { IFormData} from "../../Interfaces/IFormData";
import { createCustomer,createDriver } from "../../services/authService/AuthService";
import FormInput from "../Common/formInput/FormInput";
import Validator from "../../services/ValidatorService";
import { ToastContainer, toast } from "react-toastify";
import signUpImage from "../../assets/RideBook.jpg"
const emptyForm: IFormData = {
  FullName: "",
  EmailId: "",
  Password: "",
  PhoneNumber: "",
  Address: "",
  LicenseNumber: "",
  LicenseExpiryDate: "",
  ExperienceYears: 0,
  VehicleType:"",
  VehicleNumber:""
};
function Signup(): JSX.Element {
  const navigate = useNavigate();
  const [role, setRole] = useState<"customer" | "driver">("customer");
  const [formData, setFormData] = useState<IFormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<number>(1);
  const [isloading, setIsLoading] = useState(false);
  const maxStep = role === "customer" ? 3 : 4;
  const closeModel = () => navigate("/");
  const nextStep = () => {
    if (ValidateStep(step)) {
      setStep((prev) => Math.min(prev + 1, maxStep));
    }
  };
  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };
  const ValidateStep = (step: number): boolean => {
    const newError: Record<string, string> = {};
    switch (step) {
      case 2:
        if (!formData.FullName.trim()) {
          newError.FullName = "Name is required";
        }
        else if(!Validator().isValidName(formData.FullName)){
          newError.FullName = "Name must be at least 3 characters long and contain only letters and spaces.";
        }
        if (!formData.EmailId.trim()) {
          newError.EmailId = "Email is required";
        } else if (!Validator().isValidEmail(formData.EmailId.trim())) {
          newError.EmailId = "Enter a valid email";
        }
        if (!formData.Password.trim()) {
          newError.Password = "Password is required";
        } else if (!Validator().isValidPassword(formData.Password.trim())) {
          newError.Password =
            "Password must include uppercase, number, special character and minimum 8 characters";
        }
        break;
      case 3:
        if (!formData.PhoneNumber.trim()) {
          newError.PhoneNumber = "Phone number is required";
        } else if (!Validator().isValidMobile(formData.PhoneNumber)) {
          newError.PhoneNumber = "Enter a valid phone number";
        }
        if (role === "customer") {
          if (!formData.Address?.trim()) {
            newError.Address = "Address is required";
          }
        } else {
          if (!formData.LicenseNumber?.trim()) {
            newError.LicenseNumber = "License number is required";
          }
         else if ((formData.LicenseNumber?.trim().length || 0) < 6) {
          newError.LicenseNumber = "License number must be greater than 5 characters";
          }
          if (!formData.LicenseExpiryDate) {
            newError.LicenseExpiryDate = "Expiry date is required";
          } else if (
            !Validator().isValidFutureDate(formData.LicenseExpiryDate)
          ) {
            newError.LicenseExpiryDate = "Select a future date";
          }
        }
        break;
      case 4:
        if (role === "driver") {
          if (!formData.ExperienceYears || formData.ExperienceYears <= 0) {
            newError.ExperienceYears = "Experience must be greater than 0";
          }
          if (!formData.Address?.trim()) {
            newError.Address = "Address is required";
          }
          if(!formData.VehicleNumber?.trim() ){
            newError.VehicleNumber="Vehicle number is required"
          }
          if(!formData.VehicleType?.trim()){
            newError.VehicleType="Vehicle type is required"
          }
        }
        break;
    }
    setErrors(newError);
    return Object.keys(newError).length === 0;
  };
  const changeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement|HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    // console.log(name,value)
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const notifySuccess = (message: string) => {
    toast.success(message, {
      onClose: () => navigate("/login"),
    });
  };
  const notifyError = (message: string) => {
    toast.error(message);
  };
  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step !== maxStep || !ValidateStep(step) || isloading) return;
    setIsLoading(true);
    try {
      const response =role === "customer"? await createCustomer(formData): await createDriver(formData);
      if (response.data?.isSuccess) {
        notifySuccess("User Added Successfully");
      }
      else{
        notifyError(response.data?.message);
      }
     
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to add user";
      notifyError(message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1}>
        <ToastContainer autoClose={3000} />
       <div className="">
         <div className="modal-dialog userForm ">
          <div className="modal-content userForm-content">
            <div className="modal-header">
              <h5 className="model-title text-dark">
                Rydo Booking Application
              </h5>
              <button className="btn-close" onClick={closeModel} />
            </div>
            <div className="modal-body p-0">
              <div className="row g-0 h-100">
                <div className="col-md-6">
                  <img
                    src={signUpImage}
                    className="img-fluid h-100 signup-img"
                    alt="Logo"
                  />
                </div>
                <div className="col-md-6 d-flex flex-column">
                  <div className="form-content p-4 flex-grow-1">
                    {step === 1 && (
                      <div>
                        <h3 className="fw-bold">Get Started</h3>
                        <p className="text-muted">Select your account type</p>

                        <div className="row g-3 mt-3">
                          <div className="col-6">
                            <div
                              className={`role-card ${role === "customer" ? "active" : ""}`}
                              onClick={() => {
                                setFormData(emptyForm);
                                setRole("customer");
                              }}
                            >
                              Customer
                            </div>
                          </div>
                          <div className="col-6">
                            <div
                              className={`role-card ${role === "driver" ? "active" : ""}`}
                              onClick={() => {
                                setFormData(emptyForm);
                                setRole("driver");
                              }}
                            >
                              Driver
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <form id="signupForm" onSubmit={submitForm}>
                      {step === 2 && (
                        <>
                          <h4 className="mb-3">
                            {role === "driver"
                              ? "Driver Details"
                              : "Customer Details"}
                          </h4>
                          <FormInput
                            label="Full Name"
                            name="FullName"
                            value={formData.FullName}
                            error={errors.FullName}
                            required
                            onChange={changeInput}
                          />
                          <FormInput
                            label="Email Address"
                            name="EmailId"
                            type="email"
                            value={formData.EmailId}
                            error={errors.EmailId}
                            required
                            onChange={changeInput}
                          />
                          <FormInput
                            label="Password"
                            name="Password"
                            type="Password"
                            value={formData.Password}
                            error={errors.Password}
                            required
                            onChange={changeInput}
                          />
                        </>
                      )}

                      {step === 3 &&
                        (role === "customer" ? (
                          <>
                            <h5 className="mb-3">Address</h5>
                            <FormInput
                              label="Phone Number"
                              name="PhoneNumber"
                              value={formData.PhoneNumber}
                              error={errors.PhoneNumber}
                              required
                              onChange={changeInput}
                            />
                            <FormInput
                              label="Address"
                              name="Address"
                              as="textarea"
                              required
                              value={formData.Address!}
                              error={errors.Address}
                              onChange={changeInput}
                            />
                          </>
                        ) : (
                          <>
                            <h5 className="mb-3">Driver Details</h5>
                            <FormInput
                              label="Phone Number"
                              name="PhoneNumber"
                              value={formData.PhoneNumber}
                              error={errors.PhoneNumber}
                              required
                              onChange={changeInput}
                            />

                            <FormInput
                              label="License Number"
                              name="LicenseNumber"
                              value={formData.LicenseNumber!}
                              error={errors.LicenseNumber}
                              required
                              onChange={changeInput}
                            />

                            <FormInput
                              label="License Expiry Date"
                              name="LicenseExpiryDate"
                              error={errors.LicenseExpiryDate}
                              type="date"
                              value={formData.LicenseExpiryDate!}
                              required
                              onChange={changeInput}
                            />
                          </>
                        ))}
                      {step === 4 && role == "driver" && (
                        <div>
                          <FormInput
                            label="ExperienceYears"
                            name="ExperienceYears"
                            type="text"
                            value={formData.ExperienceYears?.toString() ?? ""}
                            error={errors.ExperienceYears}
                            onChange={(e) => {
                              setErrors((prev)=>({...prev ,ExperienceYears:""}))
                              const val = e.target.value;
                              if (val === "" || /^\d*\.?\d*$/.test(val)) {
                                setFormData((prev) => ({
                                  ...prev,
                                  ExperienceYears:
                                    val === "" ? undefined : (val as any),
                                }));
                              }
                            }}
                          />
                           <div className="mb-4">
                          <label  htmlFor="vehicleType" className="vehicleType">Vehicle Type</label>
                          <select
                            name="VehicleType" 
                            className="form-select"
                            value={formData.VehicleType}
                            onChange={changeInput}
                          >
                            <option value="">Select Type</option> 
                            <option value="bike">Bike</option>
                            <option value="car">Car</option>
                          </select>
                          {errors.VehicleType&& <small className="text-danger">{errors.VehicleType}</small>}
                        </div>
                          <FormInput 
                          label="VehicleNumber"
                          name="VehicleNumber"
                          type="text"
                          error={errors.VehicleNumber}
                          value={formData.VehicleNumber!}
                          onChange={changeInput}
                          />
                          <FormInput
                            label="Address"
                            name="Address"
                            as="textarea"
                            error={errors.Address}
                            required
                            value={formData.Address!}
                            onChange={changeInput}
                          />
                        </div>
                      )}
                    </form>
                  </div>
                  <div className="form-footer p-3 border-top d-flex justify-content-between">
                    {step > 1 && (
                      <button
                        className="btn btn-outline-secondary"
                        onClick={prevStep}
                        type="button"
                      >
                        Back
                      </button>
                    )}
                    {step < maxStep ? (
                      <div className="d-flex justify-content-end w-100">
                        <button
                          className="btn btn-danger px-4"
                          onClick={nextStep}
                          type="button"
                        >
                          Next
                        </button>
                      </div>
                    ) : (
                      <button
                        type="submit"
                        form="signupForm"
                        className="btn btn-primary"
                        disabled={isloading}
                      >
                        {isloading ? "Submitting..." : "Submit"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
       </div>
        <div className="modal-backdrop fade show" onClick={closeModel}></div>
    </>
  );
}
export default Signup;