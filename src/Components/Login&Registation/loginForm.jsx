import React, { useEffect, useRef, useState } from "react";
import SignupPage from "./signupForm";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { isAuthenticated } from "../../utils/auth";

function LoginPage({ isVisible, onClose }) {
  const modalRef = useRef(null);
  const [transform, setTransform] = useState("scale(0)");
  const [email, setEmail] = useState("");
  const [forgotEmail, setForgotEmail] = useState(""); // Separate state for forgot password email
  const [password, setPassword] = useState("");
  const [isSignupVisible, setSignupVisible] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isVisible) {
      setTransform("scale(0)");
      setTimeout(() => {
        setTransform("scale(1)");
      }, 0);
    } else {
      setTransform("scale(1)");
      setTimeout(() => {
        setTransform("scale(0)");
        setTimeout(onClose, 300);
      }, 0);
    }
  }, [isVisible]);

  const handleClose = () => {
    setTransform("scale(1)");
    setTimeout(() => {
      setTransform("scale(0)");
      setTimeout(onClose, 300);
    }, 0);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleForgotEmailChange = (e) => {
    setForgotEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleGmailClick = (e) => {
    e.preventDefault();
    setSignupVisible(true);
    setTransform("scale(1)");
  };

  const handleCloseSignup = () => {
    setSignupVisible(false);
    handleClose();
  };

  const handleLoginSubmit = async (e) => {
    // console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          email: email,
          password: password,
        }
      );
      localStorage.setItem("userData", JSON.stringify(response.data));
      localStorage.setItem("jwt", response.data.token);
      onClose();
      navigate("/related-keywords", { replace: true });
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordClick = () => {
    setIsForgotPassword(true);
    setMessage("");
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`,
        {
          email: forgotEmail,
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`,
        {
          email: forgotEmail,
          otp,
          newPassword,
        }
      );
      setMessage(response.data.message);
      setIsForgotPassword(false);
      setOtp("");
      setNewPassword("");
      setForgotEmail("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error resetting password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: credentialResponse.credential }), // Send ID token
        }
      );
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("jwt", data.token);
        localStorage.setItem(
          "userData",
          JSON.stringify({
            _id: data._id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            isAdmin: data.isAdmin,
          })
        );
        alert("Google Signup successful");
        navigate("/related-keywords", { replace: true });
        handleClose();
      } else {
        alert(data.message || "Google Signup failed");
      }
    } catch (error) {
      console.error("Google Signup Error:", error);
      alert("An error occurred during Google signup");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      {isSignupVisible ? (
        <div className="w-full max-w-2xl">
          <SignupPage 
            onClose={handleCloseSignup} 
            isVisible={isSignupVisible}
          />
        </div>
      ) : (
        <div
          ref={modalRef}
          className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-4 sm:w-[60%] relative"
          style={{ transform, transition: "transform 0.3s ease-in-out" }}
        >
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-gray-500"
          >
            ×
          </button>

          {isForgotPassword ? (
            <>
              <h1 className="text-2xl font-extrabold p-4 pl-9 text-center">
                Reset Your Password
              </h1>
              <div className="w-full sm:w-[25rem] sm:p-8 mb-8">
                <form
                  onSubmit={otp ? handleResetPassword : handleForgotPassword}
                >
                  <div className="mb-4">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="p-3 bg-[#A1A1A1] border-none rounded-lg text-black w-full"
                      value={forgotEmail}
                      onChange={handleForgotEmailChange}
                      required
                    />
                  </div>
                  {message === "OTP sent to your email" && (
                    <>
                      <div className="mb-4">
                        <input
                          type="text"
                          placeholder="Enter OTP"
                          className="p-3 bg-[#A1A1A1] border-none rounded-lg text-black w-full"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <input
                          type="password"
                          placeholder="Enter new password"
                          className="p-3 bg-[#A1A1A1] border-none rounded-lg text-black w-full"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                      </div>
                    </>
                  )}
                  <button
                    type="submit"
                    className="p-3 bg-[#12153D] text-white rounded-lg w-full flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : otp ? (
                      "Reset Password"
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </form>
                {message && (
                  <p className="mt-4 text-center text-red-500">{message}</p>
                )}
              </div>
            </>
          ) : (
            <>
              <h1
                className="text-2xl font-extrabold p-4 pl-9 text-center sm:text-left"
                style={{ wordSpacing: "7px" }}
              >
                Login to your Keyword Raja account and access all the free of
                cost services
              </h1>
              <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-x-2 sm:space-y-0">
                <div className="w-full sm:w-[25rem] sm:p-8 mb-8">
                  <p className="mt-4 text-justify mb-2 sm:text-left">
                    Create an account
                    <a
                      href="#"
                      className="text-blue-500 ml-1.5"
                      onClick={handleGmailClick}
                    >
                      Click here
                    </a>
                  </p>
                  <form onSubmit={handleLoginSubmit}>
                    <div className="mb-4">
                      <input
                        type="email"
                        placeholder="Enter email or phone number"
                        className="p-3 bg-[#A1A1A1] border-none rounded-lg text-black w-full"
                        value={email}
                        onChange={handleEmailChange}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <input
                        type="password"
                        placeholder="Enter a new password"
                        className="p-3 bg-[#A1A1A1] border-none rounded-lg text-black w-full"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="p-3 bg-[#12153D] text-white rounded-lg w-full flex items-center justify-center"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </button>
                  </form>

                  {/* Add Google login button */}
                  <div className="mt-4">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute border-t border-gray-300 w-full"></div>
                      <div className="relative bg-white px-4 text-sm text-gray-500">
                        Or continue with
                      </div>
                    </div>

                    <GoogleLogin
                      onSuccess={handleGoogleLogin}
                      onError={() => {
                        console.log("Google Login Failed");
                        alert("Google Login Failed");
                        setIsLoading(false);
                      }}
                      render={(renderProps) => (
                        <button
                          onClick={renderProps.onClick}
                          disabled={isLoading || renderProps.disabled}
                          className="mt-4 p-3 bg-white border border-gray-300 rounded-lg w-full flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          {isLoading ? (
                            <svg
                              className="animate-spin h-5 w-5 text-gray-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 48 48"
                                width="24px"
                                height="24px"
                              >
                                <path
                                  fill="#FFC107"
                                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                                />
                                <path
                                  fill="#FF3D00"
                                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                                />
                                <path
                                  fill="#4CAF50"
                                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                                />
                                <path
                                  fill="#1976D2"
                                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                                />
                              </svg>
                              <span>Login with Google</span>
                            </>
                          )}
                        </button>
                      )}
                    />
                  </div>

                  <p className="mt-4 text-justify sm:text-left">
                    Forgot password?{" "}
                    <a
                      href="#"
                      className="text-blue-500 ml-1.5"
                      onClick={handleForgotPasswordClick}
                    >
                      Click Here
                    </a>
                  </p>
                </div>
              </div>
            </>
          )}
          <svg
            className="absolute right-0 bottom-0 hidden sm:block sm:mr-4 sm:mb-4"
            width="250"
            height="300"
            viewBox="0 0 360 398"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M54.9577 182.394L2.36267 391.782C1.56966 394.939 3.95687 398 7.21202 398H352.001C355.867 398 359.001 394.866 359.001 391V0L234.236 195.991L183.814 100.814L109.115 240.666L54.9577 182.394Z"
              fill="#12153D"
            />
            <path
              d="M1 199V398H347.2C353.827 398 359.2 392.627 359.2 386V199L259.7 290.54L180.1 199L100.5 290.54L1 199Z"
              fill="#E5590F"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
