import { useState } from "react";
import { Home, Users, Settings, BarChart } from "lucide-react";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} /> },
    { name: "Users", icon: <Users size={20} /> },
    { name: "Analytics", icon: <BarChart size={20} /> },
    { name: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold text-center text-blue-600">Admin Panel</h1>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className={`flex items-center p-3 my-2 rounded-md cursor-pointer transition-all hover:bg-blue-100 ${
                activeTab === item.name ? "bg-blue-200" : ""
              }`}
              onClick={() => setActiveTab(item.name)}
            >
              {item.icon}
              <span className="ml-3 text-gray-700 font-medium">{item.name}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h2 className="text-3xl font-semibold text-gray-800">{activeTab}</h2>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-xl font-bold">Users</p>
            <p className="text-2xl text-blue-600">1,234</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-xl font-bold">Revenue</p>
            <p className="text-2xl text-green-600">$12,345</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-xl font-bold">Orders</p>
            <p className="text-2xl text-red-600">567</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
