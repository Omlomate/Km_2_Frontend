import React, { useState, useEffect } from "react";
import LoginPage from "../Login&Registation/loginForm";
import { isAuthenticated } from "../../utils/auth"; // Import isAuthenticated
import "./navbar.css"; 
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false); // State to track authentication

  useEffect(() => {
    setLoggedIn(isAuthenticated()); // Check if user is authenticated on component mount
  }, []);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const showLogin = () => {
    setIsLoginVisible(true);
  };

  const hideLogin = () => {
    setIsLoginVisible(false);
  };

  const userData = JSON.parse(localStorage.getItem("userData"));

  const handleLogout = () => {
    // ✅ Remove all relevant data from localStorage
    localStorage.clear(); // Clears all stored keys

    // ✅ Clear sessionStorage if any session data exists
    sessionStorage.clear();

    // ✅ Reset authentication state
    setLoggedIn(false);

    // ✅ Optionally, clear cookies if authentication relies on them
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // ✅ Redirect user to login or home page
    window.location.href = "/login"; // OR use navigate("/login");
  };

  // useEffect(() => {
  //   console.log("isLoginVisible:", isLoginVisible);
  // }, [isLoginVisible]);

  return (
    <>
     
      <nav
        className="bg-white w-full px-8 md:px-auto shadow-sm transition-all duration-300"
        style={{ fontFamily: "wantedsans" }}
      >
        <div className="md:h-16 h-28 mx-auto md:px-4 container flex items-center justify-between flex-wrap md:flex-nowrap">
          <div className="flex items-center flex-shrink-0 text-gray-700 order-1 md:order-none md:mr-6 mx-auto md:mx-0">
            <a href="/" className="flex items-center logo-hover">
              <svg
                width="40" // Changed from 50 to 40 for small screens
                height="40" // Changed from 50 to 40 for small screens
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
              <div>
                <span
                  className="text-xl md:text-3xl font-bold transition-colors duration-300 hover:text-[#12153d]"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  Keyword <span className="text-orange-500">Raja</span>
                </span>
              </div>
            </a>
          </div>
          <div className="text-gray-500 order-3 w-full md:w-auto md:order-2">
            <ul className="flex font-semibold justify-between items-center">
              {/* <li className="md:px-4 md:py-2">
                <a href="#" className="nav-link">Homepage</a>
              </li> */}
              <li className="md:px-4 md:py-2">
                <Link to="/blog" className="nav-link">Blog</Link>
              </li>
              <li className="md:px-4 md:py-2">
                <a href="#" className="nav-link">Forum</a>
              </li>
              <li className="md:px-4 md:py-2">
                <a href="#" className="nav-link">Course</a>
              </li>
              <li className="md:px-4 md:py-2">
                {userData?.isAdmin && <a href="/admin-dashboard" className="nav-link">Admin</a>}
              </li>
            </ul>
          </div>
          <div className="order-2 md:order-3">
            {loggedIn ? (
              <button
                onClick={handleLogout}
                className="nav-button px-4 py-2 hover:bg-[#12153D] bg-[#12153de8] text-gray-50 rounded-xl flex items-center gap-2 cursor-pointer transform hover:scale-105"
              >
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={showLogin}
                className="nav-button px-4 py-2 bg-orange-400 hover:bg-orange-500 text-gray-50 rounded-xl flex items-center gap-2 cursor-pointer transform hover:scale-105"
              >
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </nav>
      {isLoginVisible && (
        <LoginPage isVisible={isLoginVisible} onClose={hideLogin} />
      )}
    </>
  );
};

export default Navbar;
