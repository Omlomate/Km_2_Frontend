import React, { useEffect, useRef, useState } from "react";
import SignupPage from "./signupForm";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { isAuthenticated } from "../../utils/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Updated wrapper component that supports children elements
function LoginDialog({ buttonText, buttonClassName = "p-3 bg-[#12153D] text-white rounded-lg", children, onClick }) {
  const [isVisible, setIsVisible] = useState(false);
  
  const showLogin = () => {
    setIsVisible(true);
    if (onClick) onClick();
  };
  
  const hideLogin = () => setIsVisible(false);
  
  return (
    <>
      <button 
        onClick={showLogin}
        className={buttonClassName}
      >
        {children || buttonText || "Login"}
      </button>
      
      <LoginPage isVisible={isVisible} onClose={hideLogin} />
    </>
  );
}

function LoginPage({ isVisible, onClose }) {
  const modalRef = useRef(null);
  const [transform, setTransform] = useState("scale(0)");
  const [email, setEmail] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
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
      toast.error("Login failed. Please check your credentials.");
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
          body: JSON.stringify({ token: credentialResponse.credential }),
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
        toast.success("Google Signup successful");
        navigate("/related-keywords", { replace: true });
        handleClose();
      } else {
        toast.error(data.message || "Google Signup failed");
      }
    } catch (error) {
      console.error("Google Signup Error:", error);
      toast.error("An error occurred during Google signup");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  const LoadingSpinner = () => (
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
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">
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
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden"
          style={{ transform, transition: "transform 0.3s ease-in-out" }}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">
              {isForgotPassword ? "Reset Your Password" : "Login to Keyword Raja"}
            </h1>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6">
            {isForgotPassword ? (
              <div className="mx-auto max-w-md">
                <p className="mb-4 text-gray-600">
                  Enter your email address below to receive a password reset link.
                </p>
                <form
                  onSubmit={otp ? handleResetPassword : handleForgotPassword}
                  className="space-y-4"
                >
                  <div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="p-3 bg-gray-100 rounded-lg text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={forgotEmail}
                      onChange={handleForgotEmailChange}
                      required
                    />
                  </div>
                  {message === "OTP sent to your email" && (
                    <>
                      <div>
                        <input
                          type="text"
                          placeholder="Enter OTP"
                          className="p-3 bg-gray-100 rounded-lg text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="password"
                          placeholder="Enter new password"
                          className="p-3 bg-gray-100 rounded-lg text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                      </div>
                    </>
                  )}
                  <button
                    type="submit"
                    className="p-3 bg-[#12153D] text-white rounded-lg w-full flex items-center justify-center hover:bg-blue-800 transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner />
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
                  <div className={`mt-4 p-3 rounded ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {message}
                  </div>
                )}
                <button 
                  onClick={() => setIsForgotPassword(false)}
                  className="mt-4 text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to login
                </button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:gap-8">
                <div className="w-full md:w-1/2">
                  <p className="mb-4 text-gray-600">
                    Access all the free of cost services with your account
                  </p>
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <input
                        type="email"
                        placeholder="Email address"
                        className="p-3 bg-gray-100 rounded-lg text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        value={email}
                        onChange={handleEmailChange}
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        placeholder="Password"
                        className="p-3 bg-gray-100 rounded-lg text-gray-800 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="p-3 bg-[#12153D] text-white rounded-lg w-full flex items-center justify-center hover:bg-blue-800 transition-colors"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <LoadingSpinner />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </button>
                  </form>

                  <div className="mt-6">
                    <div className="flex items-center">
                      <div className="flex-grow h-px bg-gray-300"></div>
                      <span className="px-4 text-sm text-gray-500">Or continue with</span>
                      <div className="flex-grow h-px bg-gray-300"></div>
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

                  <div className="mt-6 flex justify-between items-center text-sm">
                    <button
                      onClick={handleForgotPasswordClick}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Forgot password?
                    </button>
                    <button
                      onClick={handleGmailClick}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Create an account
                    </button>
                  </div>
                </div>
                
                <div className="hidden md:block md:w-1/2">
                  <div className="h-full flex items-center justify-center">
                    <svg
                      className="max-w-full h-auto"
                      width="250"
                      height="250"
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
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Export both components
export { LoginDialog };
export default LoginPage;