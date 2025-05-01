import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoginPage from "../Login&Registation/loginForm";
import { isAuthenticated } from "../../utils/auth";
import Profile from "../../assets/profile.svg";

const Sidebar = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [username, setUsername] = useState("Guest User");
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const location = useLocation();
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const profileImage = userData?.profileImage || Profile;

  useEffect(() => {
    // Check authentication status
    const authStatus = isAuthenticated();

    // If authentication status changed from not logged in to logged in
    if (authStatus && !isLoggedIn) {
      setIsLoggedIn(authStatus);
      setSelectedOption("Home");
      localStorage.setItem("selectedOption", "Home");
      navigate("/");
      return; // Exit early after redirecting
    }

    setIsLoggedIn(authStatus);

    const userData = JSON.parse(localStorage.getItem("userData"));
    const storedFirstName = userData ? userData.firstName : null;
    if (storedFirstName) {
      setUsername(storedFirstName);
    }

    // Retrieve the selected menu option from localStorage
    const storedOption = localStorage.getItem("selectedOption");
    if (storedOption) {
      setSelectedOption(storedOption);
    } else if (authStatus) {
      // If no option is stored but user is logged in, default to Home
      setSelectedOption("Home");
      localStorage.setItem("selectedOption", "Home");
    }

    if (!authStatus && location.pathname !== "/") {
      setIsLoginVisible(true);
    }
    if (location.pathname === "/profile-edit") {
      setSelectedOption("Profile");
    }
  }, [location.pathname, isLoggedIn, navigate]);

  // Listen for login events with stronger redirect behavior
  useEffect(() => {
    const handleLoginSuccess = () => {
      setIsLoggedIn(true);
      setSelectedOption("Home");
      localStorage.setItem("selectedOption", "Home");
      // Force navigation to home route
      navigate("/", { replace: true });
    };

    window.addEventListener("login-success", handleLoginSuccess);

    return () => {
      window.removeEventListener("login-success", handleLoginSuccess);
    };
  }, [navigate]);

  // const hideLogin = () => {
  //   setIsLoginVisible(false);

  //   // Check if user just logged in and force redirect to home
  //   if (isAuthenticated() && !isLoggedIn) {
  //     setIsLoggedIn(true);
  //     setSelectedOption("Home");
  //     localStorage.setItem("selectedOption", "Home");
  //     navigate("/", { replace: true });
  //   }
  // };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    // Save the selected option to localStorage
    localStorage.setItem("selectedOption", option);
    setIsSidebarOpen(false);

    // Make sure we're not triggering unnecessary navigation if we're already on the page
    const currentPath = menuItems.find((item) => item.name === option)?.path;
    if (currentPath && location.pathname !== currentPath) {
      navigate(currentPath);
    }
  };

  const handleProfileClick = () => {
    setSelectedOption("Profile");
    localStorage.setItem("selectedOption", "Profile");
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const hideLogin = () => {
    setIsLoginVisible(false);

    // Check if user just logged in
    if (isAuthenticated() && !isLoggedIn) {
      setIsLoggedIn(true);
      setSelectedOption("Home");
      localStorage.setItem("selectedOption", "Home");
      navigate("/");
    }
  };

  const menuItems = [
    { name: "Home", path: "/", icon: "fa-home" },
    { name: "Related Keywords", path: "/related-keywords", icon: "fa-link" },
    { name: "Long-Tail Keywords", path: "/long-tail-keywords", icon: "fa-key" },
    { name: "Search Volume", path: "/search-volume", icon: "fa-chart-line" },
    {
      name: "Keyword Difficulty",
      path: "/keyword-difficulty",
      icon: "fa-chart-bar",
    },
    {
      name: "Keyword Spam Score",
      path: "/Keyword-spam-score",
      icon: "fa-shield-alt",
    },
    { name: "Keyword Trend", path: "/keyword-trend", icon: "fa-chart-area" },
    { name: "CPC (Cost Per Click)", path: "/CPC", icon: "fa-dollar-sign" },
    { name: "Ad Competitions", path: "/ad-Competition", icon: "fa-ad" },
  ];

  return (
    <>
      {/* Backdrop with blur effect when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {!isSidebarOpen && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full bg-white shadow-md border-none"
          >
            <i className="fas fa-arrow-right text-2xl text-[#E5590F]"></i>
          </button>
        </div>
      )}

      {isSidebarOpen && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full bg-white shadow-md border-none"
          >
            <i className="fas fa-times text-2xl text-[#E5590F]"></i>
          </button>
        </div>
      )}

      <div
        className={`bg-white text-black p-6 fixed md:relative transition-all duration-300 ease-in-out z-45 top-0 md:top-0 overflow-y-auto ${
          isSidebarOpen
            ? "translate-x-0 rounded-none w-1/2"
            : "-translate-x-full rounded-r-xl w-96"
        } md:translate-x-0 md:ml-0 md:w-96`}
        style={{
          width: "19rem",
          height: "101vh",
          fontFamily: "wantedsans",
          maxHeight: "100vh",
          marginTop: "20px",
          scrollbarWidth: "none" /* Firefox */,
          msOverflowStyle: "none" /* IE and Edge */,
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="pt-12 md:pt-0">
          {/* Profile Section */}
          <Link to="/profile-edit">
            <div className="flex flex-col items-center justify-center mb-10 mt-2">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-[#E5590F] shadow-md hover:shadow-lg transition-all duration-300">
                <img
                  src={profileImage}
                  alt={username}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-black font-semibold text-lg">{username}</h3>
            </div>
          </Link>

          {/* Menu Section */}
          <div className="mb-8">
            <h3 className="text-sm uppercase text-gray-700 font-bold mb-4 tracking-wider pl-2">
              Tools
            </h3>

            <div className="space-y-2">
              {menuItems.map((option) => (
                <Link
                  to={option.path}
                  key={option.name}
                  className="block no-underline"
                >
                  <div
                    className={`p-3 cursor-pointer rounded-lg flex items-center transition-all duration-200 ${
                      selectedOption === option.name
                        ? "bg-[#E5590f]/10 text-black shadow-sm"
                        : "hover:bg-gray-100 text-black"
                    }`}
                    onClick={() => handleOptionClick(option.name)}
                  >
                    <div
                      className={`mr-4 w-8 h-8 flex items-center justify-center rounded-md ${
                        selectedOption === option.name
                          ? "bg-[#E5590F]/20"
                          : "bg-gray-100"
                      }`}
                    >
                      <i
                        className={`fas ${option.icon} text-lg ${
                          selectedOption === option.name
                            ? "text-[#E5590F]"
                            : "text-gray-500"
                        }`}
                      ></i>
                    </div>
                    <span
                      className={`text-base font-medium ${
                        selectedOption === option.name ? "font-semibold" : ""
                      }`}
                    >
                      {option.name}
                    </span>

                    {selectedOption === option.name && (
                      <div className="ml-auto w-1.5 h-6 bg-[#E5590F] rounded-full"></div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isLoginVisible && (
        <LoginPage isVisible={isLoginVisible} onClose={hideLogin} />
      )}
    </>
  );
};

export default Sidebar;
