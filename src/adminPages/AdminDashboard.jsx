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
        "https://www.keywordraja.com/api/admin/users",
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
        "https://www.keywordraja.com/api/admin/blogs/count",
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

  useEffect(() => {
    fetchUserData();
    fetchBlogCounts();
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
    <div className="flex h-screen bg-gray-100">
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

      <main className="flex-1 p-6">
        <h2 className="text-3xl font-semibold text-gray-800">{activeTab}</h2>

        {activeTab === "Dashboard" && (
          <div className="grid grid-cols-3 gap-4 mt-6">
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
      </main>
    </div>
  );
};

export default AdminPanel;