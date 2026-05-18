import { useEffect, useState, type JSX } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Validator from "../../services/ValidatorService";
import { UpdateUser, Userlogin } from "../../services/authService/AuthService";
import type { ILoginFormData, ILoginFormErrors } from "../../Interfaces/ILoginFormData";
import "./LoginPage.scss";
import { useAuth } from "../authContext/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import Input from "@mui/material/Input";

const emptyForm: ILoginFormData = {
  EmailId: "",
  Password: "",
  ConfirmPassword: "",
};

function LoginPage(): JSX.Element {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState<ILoginFormErrors>({});
  const [isValidCredentials, setIsValidCredentials] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const location = useLocation();
  const { rideListFormData } = location?.state || {};
  const { redirectTo } = location?.state || "";
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  useEffect(() => {
    logout();
  }, []);
  const changeUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setIsValidCredentials(true);
  };
  const validateForm = () => {
    const newErrors: ILoginFormErrors = {};
    const validator = Validator();
    if (!formData.EmailId.trim()) {
      newErrors.EmailId = "Email is required";
    } else if (!validator.isValidEmail(formData.EmailId.trim())) {
      newErrors.EmailId = "Enter a valid email";
    }
    if (!isForgotPassword) {
      if (!formData.Password.trim()) {
        newErrors.Password = "Password is required";
      }
    } else {
      if (!formData.Password.trim()) {
        newErrors.Password = "New password is required";
      }
      if (!formData.ConfirmPassword?.trim()) {
        newErrors.ConfirmPassword = "Confirm your password";
      } else if (formData.Password !== formData.ConfirmPassword) {
        newErrors.ConfirmPassword = "Passwords do not match";
      }
    }
    return newErrors;
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      if (isForgotPassword) {
        const response = await UpdateUser({
          EmailId: formData.EmailId,
          Password: formData.Password,
        });

        if (response.data?.isSuccess) {
          toast.success("Password updated successfully");
          setFormData(emptyForm);
          setIsForgotPassword(false);
        }
        return;
      }
      const response = await Userlogin(formData);
      if (response.status === 200) {
        login(response.data);
        const role = response.data.role;
        if (redirectTo) {
          navigate(redirectTo, { state: { formData: rideListFormData } });
        } else {
          navigate(
            role === "user" ? "/#home" :
            role === "driver" ? "/driver" : "/"
          );
        }
      }
    } catch (error: any) {
      if (error?.status === 401) {
        setIsValidCredentials(false);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  return (
    <>
      <ToastContainer autoClose={3000} />
      <div className="login-page">
        <div className="card login-card">
          <div className="row g-0 login-row">
            <div className="col-md-6">
              <img
                src="src/assets/RydoLoginImage.jpg"
                className="img-fluid rounded-start"
                alt="Logo"
              />
            </div>
            <div className="col-md-6 form-container">
              <form
                className="border p-4 shadow-sm h-100 d-flex flex-column"
                onSubmit={submitForm}
              >
                <div className="flex-grow-1">

                  <h2 className="mb-1 fw-bold">Welcome to Rydo</h2>

                  <div className="">
                    <label className="loginLable d-flex "><span>Email</span><span className="text-danger ms-1">*</span></label>
                    <input
                      type="text"
                      name="EmailId"
                      value={formData.EmailId}
                      className="form-control"
                      onChange={changeUserInput}
                    />
                     <small className="text-danger ">
                      {errors.EmailId || ""}
                    </small>
                  </div>
                  {!isForgotPassword && (
                    <div className="">
                      <label className="loginLable d-flex"><span>Password</span> <span className="text-danger ms-1">*</span></label>
                      <input
                        type="password"
                        name="Password"
                        value={formData.Password}
                        className="form-control"
                        onChange={changeUserInput}
                      />
                      <small className="text-danger">
                        {errors.Password || ""}
                      </small>
                    </div>
                  )}
                  {isForgotPassword && (
                    <>
                      <div className="">
                        <label className="loginLable d-flex"><span>New Password </span>  <span className="text-danger ms-1">*</span></label>
                        <input
                          type="password"
                          name="Password"
                          value={formData.Password}
                          className="form-control"
                          onChange={changeUserInput}
                        />
                        <small className="text-danger">
                          {errors.Password || ""}
                        </small>
                      </div>
                      <div className="">
                        <label className="loginLable d-flex"> <span>Confirm Password</span> <span className="text-danger ms-1">*</span></label>
                        <input
                          type="password"
                          name="ConfirmPassword"
                          value={formData.ConfirmPassword}
                          className="form-control m-0"
                          onChange={changeUserInput}
                        />
                         <small className="text-danger p-0">
                          {errors.ConfirmPassword || ""}
                        </small>
                      </div>
                    </>
                  )}
                  <div className="d-flex justify-content-end ">
                    {!isForgotPassword ? (
                      <button
                        type="button"
                        onClick={() => {
                          
                          setIsForgotPassword(true)
                           setFormData(()=>(emptyForm));
                          setErrors(()=>({}))
                        }}
                        className="plain-button"
                      >
                        Forgot password?
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(false);
                          setFormData(()=>(emptyForm));
                          setErrors(()=>({}))
                        }}
                        className="plain-button"
                      >
                        Back
                      </button>
                    )}
                  </div>
                  <small className="text-danger p-0">
                    {isValidCredentials ? "" : "Invalid Email or Password"}
                  </small>
                </div>
                <button className="btn btn-primary w-100 p-2  ">
                  {isForgotPassword ? "Update Password" : "Login"}
                </button>
                {!isForgotPassword && (
                  <div className="text-center mt-3">
                    <small>
                      Don't have account? <Link to="/signup">SignUp</Link>
                    </small>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;