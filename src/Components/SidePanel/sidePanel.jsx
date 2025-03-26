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
        <div className="md:hidden fixed top-4 left-4 z-[60]">
          <button onClick={toggleSidebar} className="bg-white p-2 rounded-lg shadow-md">
            <i className="fas fa-bars text-xl text-[#12153D]"></i>
          </button>
        </div>
      )}
      <div
        className={`bg-[#12153D] text-white p-4 w-full md:w-72 fixed md:relative transition-all duration-300 ease-in-out z-[55] ${
          isSidebarOpen
            ? "translate-x-0 top-0 h-screen"
            : "-translate-x-full"
        } md:translate-x-0 md:h-screen md:ml-6 md:mr-4`}
        style={{ fontFamily: "wantedsans" }}
      >
        <div className="flex items-center justify-between mb-6 pt-2">
          <Link to="/profile-edit">
            <div
              className={`flex items-center gap-4 ${
                selectedOption === "Profile"
                  ? "bg-[#E5590F] rounded-lg p-2"
                  : ""
              }`}
              onClick={handleProfileClick}
            >
              <img
                src={profileImage}
                alt="Profile"
                className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-full"
              />
              <span className="text-lg">{username}</span>
            </div>
          </Link>

          {isSidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="md:hidden bg-transparent text-white"
            >
              <i className="fas fa-times text-2xl"></i>
            </button>
          )}
        </div>

        {menuItems.map((option) => (
          <Link to={option.path} key={option.name}>
            <div
              className={`mb-3 p-3 cursor-pointer rounded-lg flex items-center ${
                selectedOption === option.name
                  ? "bg-[#E5590F] text-[#12153d]"
                  : "hover:bg-[#E5590F] hover:text-[#12153d]"
              }`}
              onClick={() => handleOptionClick(option.name)}
            >
              <i className={`fas ${option.icon} mr-3 w-5`}></i>
              <span className="text-base">{option.name}</span>
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
