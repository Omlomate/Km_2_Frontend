import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Home, Users, BarChart, FileText, Tag, MessageSquare } from "lucide-react";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [userCount, setUserCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [blogCounts, setBlogCounts] = useState({
    publishedCount: 0,
    draftCount: 0,
    totalCount: 0,
  });
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [settings, setSettings] = useState({
    sidePanel: {
      relatedKeywords: true,
      longTailKeywords: true,
      searchVolume: true,
      keywordDifficulty: true,
      keywordSpamScore: true,
      keywordTrend: true,
      cpc: true,
      adCompetitions: true,
    },
    navigation: {
      Research: true,
      Blog: true,
      Forum: true,
      Courses: true,
      Admin: true,
    },
    socialLinks: {
      linkedin: "",
      instagram: "",
      youtube: "",
      facebook: "",
    },
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} /> },
    { name: "Users", icon: <Users size={20} /> },
    { name: "Ads Control", icon: <BarChart size={20} /> },
    { name: "Blog Post", icon: <FileText size={20} /> },
    { name: "Control Meta Tags", icon: <Tag size={20} /> },
    { name: "Forum Posts", icon: <MessageSquare size={20} /> },
  ];

  // Fetch user count & users
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserCount(data.userCount);
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch blog counts
  const fetchBlogCounts = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/blogs/count`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBlogCounts({
        publishedCount: data.publishedCount,
        draftCount: data.draftCount,
        totalCount: data.totalCount,
      });
    } catch (error) {
      console.error("Error fetching blog counts:", error);
    }
  };

  // Fetch admin toggle control settings
  const fetchAdminToggleSettings = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("No JWT token found");

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin-toggle-control`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`Failed to fetch settings: ${response.statusText}`);
      const data = await response.json();
      setSettings(data);
    } catch (err) {
      console.error("Error fetching settings:", err.message);
      setError("Failed to load settings");
    }
  };

  // Handle toggle for side panel and navigation
  const handleToggle = (section, key) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: !prev[section][key] },
    }));
  };

  // Handle social links input changes
  const handleSocialLinkChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [field]: value },
    }));
  };

  // Save settings to backend
  const saveSettings = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        setError("No JWT token found. Please log in again.");
        navigate("/login");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin-toggle-control`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save settings: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      setSettings(data);
      setError(null);
      window.dispatchEvent(new Event("adminSettingsChange"));
    } catch (err) {
      console.error("Error saving settings:", err.message);
      setError(err.message.includes("Unauthorized") ? "Unauthorized: Invalid or expired token. Please log in again." : `Failed to save settings: ${err.message}`);
      if (err.message.includes("Unauthorized")) {
        navigate("/login");
      }
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadMessage(""); // Clear previous messages
  };

  // Handle ads.txt upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadMessage("Please select a .txt file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("adsTxt", file);

    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/upload-ads-txt`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUploadMessage(response.data.message);
      setFile(null); // Clear file input
      document.getElementById("adsTxtInput").value = ""; // Reset file input
    } catch (error) {
      setUploadMessage(
        error.response?.data?.message || "Error uploading ads.txt"
      );
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchBlogCounts();
    fetchAdminToggleSettings();
  }, []);

  useEffect(() => {
    if (activeTab === "Users") {
      fetchUserData();
    }
  }, [activeTab]);

  const handleTabClick = (name) => {
    if (name === "Blog Post") {
      navigate("/blog-post");
    } else if (name === "Control Meta Tags") {
      navigate("/control-meta-tags");
    } else if (name === "Forum Posts") {
      navigate("/admin/forum-posts");
    } else {
      setActiveTab(name);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 pb-16"> {/* Changed h-screen to min-h-screen and added pb-16 */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold text-center text-blue-600">
          Admin Panel
        </h1>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className={`flex items-center p-3 my-2 rounded-md cursor-pointer transition-all hover:bg-blue-100 ${
                activeTab === item.name ? "bg-blue-200" : ""
              }`}
              onClick={() => handleTabClick(item.name)}
            >
              {item.icon}
              <span className="ml-3 text-gray-700 font-medium">
                {item.name}
              </span>
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 mb-8"> {/* Added mb-8 for additional bottom margin */}
        <h2 className="text-3xl font-semibold text-gray-800">{activeTab}</h2>

        {activeTab === "Dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* User Count Card */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-xl font-bold">Users</p>
              <p className="text-2xl text-blue-600">{userCount}</p>
            </div>

            {/* Total Blogs Card */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-xl font-bold">Total Blogs</p>
              <p className="text-2xl text-blue-600">{blogCounts.totalCount}</p>
            </div>

            {/* Published Blogs Card */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-xl font-bold">Published Blogs</p>
              <p className="text-2xl text-green-600">{blogCounts.publishedCount}</p>
            </div>

            {/* Draft Blogs Card */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-xl font-bold">Draft Blogs</p>
              <p className="text-2xl text-orange-600">{blogCounts.draftCount}</p>
            </div>
          </div>
        )}

        {activeTab === "Users" && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">User List</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Username</th>
                  <th className="border border-gray-300 p-2">First Name</th>
                  <th className="border border-gray-300 p-2">Last Name</th>
                  <th className="border border-gray-300 p-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.email} className="text-center">
                    <td className="border border-gray-300 p-2">
                      {user.username}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {user.firstName}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {user.lastName}
                    </td>
                    <td className="border border-gray-300 p-2">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "Ads Control" && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Upload ads.txt</h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label htmlFor="adsTxtInput" className="block text-gray-700 font-medium mb-2">
                  Select ads.txt file
                </label>
                <input
                  id="adsTxtInput"
                  type="file"
                  accept=".txt"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Upload
              </button>
            </form>
            {uploadMessage && (
              <p
                className={`mt-4 ${
                  uploadMessage.includes("successfully")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {uploadMessage}
              </p>
            )}
          </div>
        )}

        {activeTab === "Dashboard" && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Toggle Control Settings</h3>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Side Panel Toggles */}
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2 text-gray-700">Side Panel Visibility</h4>
              <div className="space-y-4">
                {Object.keys(settings.sidePanel).map((key) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.sidePanel[key]}
                        onChange={() => handleToggle("sidePanel", key)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-300"></div>
                      <div className="absolute w-4 h-4 bg-white rounded-full top-1 left-1 peer-checked:translate-x-5 transition-transform duration-300"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Toggles */}
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2 text-gray-700">Navigation Visibility</h4>
              <div className="space-y-4">
                {Object.keys(settings.navigation).map((key) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">{key}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.navigation[key]}
                        onChange={() => handleToggle("navigation", key)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-300"></div>
                      <div className="absolute w-4 h-4 bg-white rounded-full top-1 left-1 peer-checked:translate-x-5 transition-transform duration-300"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-2 text-gray-700">Social Media Links</h4>
              <div className="space-y-4">
                {["linkedin", "instagram", "youtube", "facebook"].map((platform) => (
                  <div key={platform}>
                    <label className="block text-gray-700 font-medium capitalize">{platform}</label>
                    <input
                      type="url"
                      value={settings.socialLinks[platform]}
                      onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                      placeholder={`https://www.${platform}.com/...`}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={saveSettings}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Save Settings
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;