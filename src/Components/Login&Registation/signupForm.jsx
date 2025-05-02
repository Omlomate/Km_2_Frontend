import React, { useState, useEffect } from "react";
import LoginPage from "./loginForm";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

function SignupPage({ onClose, isVisible }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transform, setTransform] = useState("scale(0)");
  const [isLoginVisible,setIsLoginVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsOpen(true);
    if (isVisible) {
      setTransform("scale(0)");
      setTimeout(() => {
        setTransform("scale(1)");
      }, 0);
    }
    return () => {
      setIsOpen(false);
      setTransform("scale(0)");
    };
  }, [isVisible]);

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password) {
      alert("Please fill in all fields");
      return;
    }
    if (!agree) {
      alert("You must agree to the privacy policy");
      return;
    }
    setIsLoading(true);
    const userData = { firstName, lastName, email, password };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
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
        alert("Signup successful");
        navigate("/", { replace: true });
        handleClose();
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async (credentialResponse) => {
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

  

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoginVisible(true);
  };

  const handleClose = () => {
  
    setTransform("scale(1)");
    setTimeout(() => {
      setTransform("scale(0)");
      setTimeout(() => {
        setIsOpen(false);
        onClose();
      }, 300);
    }, 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      {isLoginVisible ? (
        <LoginPage 
          isVisible={isLoginVisible} 
          onClose={() => {
            setIsLoginVisible(false);
            onClose();
          }}
        />
      ) : (
        <div
          className="relative w-full max-w-md sm:max-w-3xl transition-transform duration-300"
          style={{ transform }}
        >
          <div
            className="bg-white p-4 sm:p-8 rounded-lg w-full"
            style={{
              borderRadius: "15px",
              background:
                "radial-gradient(80.98% 101.63% at 32.38% 48.5%, rgb(255, 255, 255) 52.19%, rgb(229, 89, 15) 82.56%, rgb(18, 21, 61) 100%)",
            }}
          >
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-100"
            >
              ×
            </button>
            <div className="absolute inset-0 opacity-50 pointer-events-none"></div>
            <div className="p-4 sm:p-6 rounded-lg w-full max-w-md mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold mb-1">
                Create Account
              </h2>
              <p className="mb-4 sm:mb-6 text-sm sm:text-md text-gray-500 text-bold">
                Grow your business like a Raja
              </p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
                <div className="flex-1">
                  <GoogleLogin
                    onSuccess={handleGoogleSignup}
                    onError={() => {
                      console.log("Google Login Failed");
                      alert("Google Login Failed");
                      setIsLoading(false);
                    }}
                    render={(renderProps) => (
                      <button
                        onClick={renderProps.onClick}
                        disabled={isLoading || renderProps.disabled}
                        className="w-full cursor-pointer bg-gray-100 p-2 rounded-lg flex items-center justify-center disabled:opacity-50"
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
                              width="24"
                              height="24"
                              viewBox="0 0 48 48"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill="#FFC107"
                                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                              ></path>
                              <path
                                fill="#FF3D00"
                                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                              ></path>
                              <path
                                fill="#4CAF50"
                                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                              ></path>
                              <path
                                fill="#1976D2"
                                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                              ></path>
                            </svg>
                            Google
                          </>
                        )}
                      </button>
                    )}
                  />
                </div>                
                <button
                  disabled={isLoading}
                  className="flex-1 cursor-pointer bg-gray-100 p-2 rounded-lg flex items-center justify-center disabled:opacity-50"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fill="#ff5722" d="M6 6H22V22H6z"></path>
                    <path fill="#4caf50" d="M26 6H42V22H26z"></path>
                    <path fill="#ffc107" d="M26 26H42V42H26z"></path>
                    <path fill="#03a9f4" d="M6 26H22V42H6z"></path>
                  </svg>
                  Microsoft
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Enter First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  disabled={isLoading}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Enter Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  disabled={isLoading}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Enter Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  disabled={isLoading}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Create Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  disabled={isLoading}
                />
              </div>
              <div className="mb-4 sm:mb-6 flex items-center">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mr-2"
                  disabled={isLoading}
                />
                <label className="text-gray-700">
                  I agree with privacy and policy
                </label>
              </div>
              <button
                onClick={handleSignup}
                disabled={isLoading}
                className="w-full bg-blue-900 text-white p-2 rounded-lg flex items-center justify-center disabled:opacity-50"
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
                    Creating Account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
              <p className="text-center mt-4 text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={handleLogin}
                  className="text-blue-900 font-semibold hover:text-blue-700 transition-colors cursor-pointer"
                >
                  click here
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignupPage;