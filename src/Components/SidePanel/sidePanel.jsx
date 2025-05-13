import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoginPage from "../Login&Registation/loginForm";
import { isAuthenticated } from "../../utils/auth";
import Profile from "../../assets/profile.svg";
import { useSidebar } from '../../context/SidebarContext';

const Sidebar = () => {
  const { toggleSidebar, isSidebarOpen } = useSidebar();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [username, setUsername] = useState("Guest User");
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const location = useLocation();
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const profileImage = userData?.profileImage || Profile;

  useEffect(() => {
    const authStatus = isAuthenticated();
    setIsLoggedIn(authStatus);

    const userData = JSON.parse(localStorage.getItem("userData"));
    const storedFirstName = userData ? userData.firstName : null;
    if (storedFirstName) {
      setUsername(storedFirstName);
    }

    const currentPath = location.pathname;
    const currentOption = menuItems.find(item => item.path === currentPath)?.name;
    
    if (currentOption) {
      setSelectedOption(currentOption);
      localStorage.setItem("selectedOption", currentOption);
    } else if (authStatus && currentPath === "/") {
      setSelectedOption("Related Keywords");
      localStorage.setItem("selectedOption", "Related Keywords");
    } else if (currentPath === "/profile-edit") {
      setSelectedOption("Profile");
      localStorage.setItem("selectedOption", "Profile");
    }

    if (!authStatus && currentPath !== "/related-keywords") {
      setIsLoginVisible(true);
    } else {
      setIsLoginVisible(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleLoginSuccess = () => {
      setIsLoggedIn(true);
      setSelectedOption("Related Keywords");
      localStorage.setItem("selectedOption", "Related Keywords");
      navigate("/related-keywords", { replace: true });
    };

    window.addEventListener("login-success", handleLoginSuccess);

    return () => {
      window.removeEventListener("login-success", handleLoginSuccess);
    };
  }, [navigate]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    localStorage.setItem("selectedOption", option);

    const currentPath = menuItems.find((item) => item.name === option)?.path;
    if (currentPath && location.pathname !== currentPath) {
      navigate(currentPath);
    }
  };

  const handleProfileClick = () => {
    setSelectedOption("Profile");
    localStorage.setItem("selectedOption", "Profile");
    navigate("/profile-edit");
  };

  const hideLogin = () => {
    setIsLoginVisible(false);

    if (isAuthenticated() && !isLoggedIn) {
      setIsLoggedIn(true);
      setSelectedOption("Related Keywords");
      localStorage.setItem("selectedOption", "Related Keywords");
      navigate("/related-keywords");
    }
  };

  const menuItems = [
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
      {/* Overlay for closing the sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent backdrop-blur-xl bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`bg-white text-black p-6 fixed md:relative transition-all duration-300 ease-in-out z-45 top-0 md:top-0 overflow-y-auto ${
          isSidebarOpen
            ? "translate-x-0 rounded-none w-80"
            : "-translate-x-full rounded-r-xl w-96"
        } md:translate-x-0 md:ml-0 md:w-96`}
        style={{
          width: isSidebarOpen ? "100%" : "25rem",
          maxWidth: "320px",
          height: "100vh",
          fontFamily: "wantedsans",
          marginTop: "20px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {isSidebarOpen && (
          <div className="md:hidden absolute top-4 right-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-full bg-white shadow-sm border border-gray-200"
            >
              <i className="fas fa-times text-xl text-[#E5590F]"></i>
            </button>
          </div>
        )}
        
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <div className="pt-12 md:pt-0 pb-20">
          <Link to="/profile-edit" onClick={handleProfileClick}>
            <div className="flex flex-col items-center justify-center mb-10 mt-4">
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