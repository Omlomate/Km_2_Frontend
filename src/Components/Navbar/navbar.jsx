import React, { useState, useEffect } from "react";
import loginLogo from "../../assets/loginLogo.svg";
import logoText from "../../assets/LogoText.svg";
import LoginPage from "../Login&Registation/loginForm";
import SignupPage from "../Login&Registation/signupForm";
import { isAuthenticated } from "../../utils/auth";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";

const Navbar = () => {
  const { toggleSidebar, isSidebarOpen } = useSidebar();
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isRegisterVisible, setIsRegisterVisible] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = isAuthenticated();
      setLoggedIn(isLoggedIn);
      if (isLoggedIn) {
        fetchUnreadCount();
      } else {
        setUnreadCount(0);
        setNotifications([]);
        setShowNotifications(false);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("login-success", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("login-success", checkAuth);
    };
  }, []);

  useEffect(() => {
    let interval;
    if (loggedIn) {
      fetchUnreadCount();
      interval = setInterval(fetchUnreadCount, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loggedIn]);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        setUnreadCount(0);
        console.warn(
          "No JWT token found in localStorage for fetching unread notifications"
        );
        return;
      }

      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/forum/notifications/unread-count`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch unread count: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Error fetching unread notification count:", error.message);
      setUnreadCount(0);
    }
  };

  const markNotificationsRead = async () => {
    try {
      const token = localStorage.getItem("jwt");
      await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/forum/notifications/mark-read`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error.message);
    }
  };

  const handleBellClick = async () => {
    if (!loggedIn) {
      alert("Please log in to view notifications");
      navigate("/login");
      return;
    }

    if (showNotifications) {
      setShowNotifications(false);
      return;
    }

    try {
      setIsLoadingNotifications(true);
      setShowNotifications(true);

      const token = localStorage.getItem("jwt");
      if (!token) {
        console.error(
          "No JWT token found in localStorage for fetching notifications"
        );
        alert("Please log in to view notifications");
        navigate("/login");
        return;
      }

      const url = `${import.meta.env.VITE_BACKEND_URL}/api/forum/notifications`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Response body:", text.slice(0, 100));
        throw new Error(
          `Failed to fetch notifications: ${response.status} ${response.statusText}`
        );
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.slice(0, 100));
        throw new Error("Received non-JSON response from server");
      }

      const data = await response.json();

      setNotifications(data);
      setUnreadCount(0);
      await markNotificationsRead();
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
      alert(`Failed to load notifications: ${error.message}`);
      setShowNotifications(false);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const handleNotificationClick = (postId) => {
    setShowNotifications(false);
    if (postId) {
      navigate(`/forum/${postId}`);
    }
  };

  const showLogin = () => {
    setIsLoginVisible(true);
    setIsRegisterVisible(false);
  };

  const showRegister = () => {
    setIsRegisterVisible(true);
    setIsLoginVisible(false);
  };

  const hideLogin = () => {
    setIsLoginVisible(false);
    const isUserAuthenticated = isAuthenticated();
    setLoggedIn(isUserAuthenticated);
    if (isUserAuthenticated) {
      localStorage.setItem("selectedOption", "Research");
      const loginEvent = new CustomEvent("login-success", {
        detail: { redirectTo: "/related-keywords" },
      });
      window.dispatchEvent(loginEvent);
      navigate("/related-keywords");
    }
  };

  const hideRegister = () => {
    setIsRegisterVisible(false);
    const isUserAuthenticated = isAuthenticated();
    setLoggedIn(isUserAuthenticated);
    if (isUserAuthenticated) {
      localStorage.setItem("selectedOption", "Research");
      const loginEvent = new CustomEvent("login-success", {
        detail: { redirectTo: "/related-keywords" },
      });
      window.dispatchEvent(loginEvent);
      navigate("/related-keywords");
    }
  };

  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    setLoggedIn(false);
    navigate("/related-keywords");
  };

  return (
    <>
      <nav
        className="bg-white w-full px-2 lg:px-8 shadow-sm transition-all duration-300 fixed top-0 z-50 animate-navbar"
        style={{ fontFamily: "wantedsans" }}
      >
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 w-full justify-start md:justify-start md:w-auto lg:ml-0">
            <div className="flex items-center flex-shrink-0 text-gray-700">
              <a
                href="/related-keywords"
                className="flex items-center gap-2 logo-hover"
              >
                <img src={loginLogo} alt="Logo" className="w-8 h-8 md:w-10 md:h-10" />
                <img src={logoText} alt="keywordRaja" className="h-6 md:h-8 xs:block" />
              </a>
            </div>
          </div>

          <div className="hidden max-[882px]:hidden md:block text-gray-900">
            <ul className="flex font-semibold items-center space-x-6">
              <li>
                <Link to="/related-keywords" className="nav-link">
                  Research
                </Link>
              </li>
              <li>
                <Link to="/blog" className="nav-link">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/forum" className="nav-link">
                  Forum
                </Link>
              </li>
              <li>
                <Link to="/courses" className="nav-link">
                  Courses
                </Link>
              </li>
              {userData?.isAdmin && (
                <li>
                  <a href="/admin-dashboard" className="nav-link">
                    Admin
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="flex items-center gap-3">
            {loggedIn ? (
              <div className="flex items-center gap-2 relative">
                <button
                  onClick={handleBellClick}
                  className="relative hidden max-[882px]:hidden md:block text-[#12153D] hover:text-[#E5590F] transition-colors duration-200"
                  aria-label="Notifications"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute top-12 right-30 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-h-[25rem] overflow-y-auto">
                    {isLoadingNotifications ? (
                      <div className="py-6 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#E5590F]"></div>
                        <p className="text-sm text-gray-500 mt-3">
                          Loading notifications...
                        </p>
                      </div>
                    ) : notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className="flex flex-col py-3 px-4 cursor-pointer hover:bg-gray-50 transition-all duration-200 rounded-md hover:shadow-sm  "
                          onClick={() =>
                            handleNotificationClick(notification.postId)
                          }
                        >
                          <p className="text-sm font-medium text-gray-800">
                            {notification.message}
                          </p>
                          <span className="text-xs text-gray-500 mt-1">
                            {new Date(notification.createdAt).toLocaleString(
                              "en-US",
                              {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 flex flex-col items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          />
                        </svg>
                        <p className="text-sm text-gray-500 mt-3">
                          No notifications
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {userData && (
                  <span className="hidden max-[882px]:hidden md:block text-[#12153D] font-medium">
                    Hi, {userData.firstName || "User"}
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="group flex items-center justify-start w-11 h-11 bg-[#12153d] rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1"
                >
                  <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3">
                    <svg className="w-4 h-4" viewBox="0 0 512 512" fill="white">
                      <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                    </svg>
                  </div>
                  <div className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    Logout
                  </div>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={showLogin}
                  className="group flex items-center justify-start w-11 h-11 bg-[#E5590F] rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1"
                >
                  <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group_hover:px-3">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 512 512"
                      fill="white"
                      transform="rotate(180)"
                    >
                      <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                    </svg>
                  </div>
                  <div className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    Login
                  </div>
                </button>
                <button
                  onClick={showRegister}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-[#12153D] hover:bg-[#12153D]/90 text-white rounded-full transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Register</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="md:hidden max-[882px]:block w-full border-t border-gray-100 overflow-hidden">
          <div
            className="overflow-x-auto scrollbar-hide scroll-smooth"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <ul className="flex justify-around font-semibold items-center space-x-5 py-2 px-4 whitespace-nowrap min-w-max transition-transform duration-300 ease-out">
              <li className="px-2">
                <button
                  onClick={toggleSidebar}
                  className="flex items-center gap-1 text-sm hover:text-[#E5590F] transition-colors"
                >
                  <i
                    className={`fas ${
                      isSidebarOpen ? "fa-times" : "fa-arrow-right"
                    } text-[#E5590F] text-lg`}
                  ></i>
                </button>
              </li>
              <li className="px-2">
                <Link to="/related-keywords" className="nav-link text-sm hover:text-[#E5590F] transition-colors">
                  Research
                </Link>
              </li>
              <li className="px-2">
                <Link to="/blog" className="nav-link text-sm hover:text-[#E5590F] transition-colors">
                  Blog
                </Link>
              </li>
              <li className="px-2">
                <Link to="/forum" className="nav-link text-sm hover:text-[#E5590F] transition-colors">
                  Forum
                </Link>
              </li>
              <li className="px-2">
                <Link to="/courses" className="nav-link text-sm hover:text-[#E5590F] transition-colors">
                  Courses
                </Link>
              </li>
              {userData?.isAdmin && (
                <li className="px-2">
                  <a href="/admin-dashboard" className="nav-link text-sm hover:text-[#E5590F] transition-colors">
                    Admin
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <div className="space-x-1">
        {isLoginVisible && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-[1000] p-4 modal-overlay">
            <div className="modal-content">
              <LoginPage
                isVisible={isLoginVisible}
                onClose={hideLogin}
                initialTab="login"
              />
            </div>
          </div>
        )}
        {isRegisterVisible && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-[1000] p-4 modal-overlay">
            <div className="modal-content">
              <SignupPage
                isVisible={isRegisterVisible}
                onClose={hideRegister}
                initialTab="register"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;