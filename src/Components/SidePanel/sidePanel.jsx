import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import LoginPage from "../Login&Registation/loginForm";
import { isAuthenticated } from "../../utils/auth";
import Profile from "../../assets/profile.svg";

const Sidebar = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [username, setUsername] = useState("Guest User");
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const profileImage = userData?.profileImage || Profile;

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const storedFirstName = userData ? userData.firstName : null;
    if (storedFirstName) {
      setUsername(storedFirstName);
    }

    // Retrieve the selected menu option from localStorage
    const storedOption = localStorage.getItem("selectedOption");
    if (storedOption) {
      setSelectedOption(storedOption);
    }

    if (!isAuthenticated() && location.pathname !== "/") {
      setIsLoginVisible(true);
    }
    if (location.pathname === "/profile-edit") {
      setSelectedOption("Profile");
    }
  }, [location.pathname]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    // Save the selected option to localStorage
    localStorage.setItem("selectedOption", option);
    setIsSidebarOpen(false);
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
  };

  const menuItems = [
    { name: "Home", path: "/", icon: "fa-home" },
    { name: "Related Keywords", path: "/related-keywords", icon: "fa-link" },
    { name: "Long-Tail Keywords", path: "/long-tail-keywords", icon: "fa-key" },
    { name: "Search Volume", path: "/search-volume", icon: "fa-chart-line" },
    { name: "Keyword Difficulty", path: "/keyword-difficulty", icon: "fa-chart-bar" },
    { name: "Keyword Spam Score", path: "/Keyword-spam-score", icon: "fa-shield-alt" },
    { name: "Keyword Trend", path: "/keyword-trend", icon: "fa-chart-area" },
    { name: "CPC (Cost Per Click)", path: "/CPC", icon: "fa-dollar-sign" },
    { name: "Ad Competitions", path: "/ad-Competition", icon: "fa-ad" },
  ];

  return (
    <>
      {!isSidebarOpen && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button onClick={toggleSidebar} className="border-none">
            <i
              className={`fas fa-arrow-right text-2xl text-black/50`}
            ></i>
          </button>
        </div>
      )}
      
    
      <div
        className={`bg-[#12153D] text-white p-6 w-72 lg:min-h-screen fixed md:relative transition-all duration-300 ease-in-out z-10 top-16 md:top-0 ${
          isSidebarOpen
            ? "translate-x-0 rounded-none"
            : "-translate-x-full rounded-t-md"
        } md:translate-x-0 md:ml-6 md:mr-4 ${
          isSidebarOpen ? "w-full h-full" : "w-72"
        }`}
        style={{
          height: isSidebarOpen ? "100vh" : "auto",
          fontFamily: "wantedsans",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <Link to="/profile-edit">
            <div
              className={`flex justify-center items-center space-x-5.5 transition-all duration-300 ease-in-out transform hover:scale-105 ${
                selectedOption === "Profile"
                  ? "bg-[#E5590F] rounded-lg p-1.5"
                  : "b"
              }`}
              id="profile"
              onClick={handleProfileClick}
            >
              <img
                src={profileImage}
                alt="Profile"
                className="w-20 h-20 object-cover rounded-full transition-transform duration-300 hover:rotate-12"
              />
              <span className="mr-3">{username}</span>
            </div>
          </Link>

          <button
            onClick={toggleSidebar}
            className="md:hidden bg-transparent border-none"
          >
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>

        {menuItems.map((option) => (
          <Link to={option.path} key={option.name}>
            <div
              className={`mb-4 p-3 cursor-pointer rounded flex items-center transition-all duration-300 ease-in-out transform ${
                selectedOption === option.name
                  ? "bg-[#E5590F] text-[#12153d] rounded-lg translate-x-2"
                  : "hover:translate-x-2"
              } hover:bg-[#E5590F] hover:text-[#12153d] hover:rounded-lg hover:scale-105`}
              onClick={() => handleOptionClick(option.name)}
            >
              <i
                className={`fas ${option.icon} mr-3 w-5 transition-transform duration-300 group-hover:rotate-12`}
              ></i>
              {option.name}
            </div>
          </Link>
        ))}
      </div>
      {isLoginVisible && (
        <LoginPage isVisible={isLoginVisible} onClose={hideLogin} />
      )}
    </>
  );
};

export default Sidebar;