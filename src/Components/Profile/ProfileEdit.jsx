// Remove framer-motion import
import React, { useState, useEffect } from "react";
import "./ProfileEdit.css";
import Profile from "../../assets/profile.svg";

 // Add default avatars array
const defaultAvatars = [
  "https://api.dicebear.com/6.x/avataaars/svg?seed=1",
  "https://api.dicebear.com/6.x/avataaars/svg?seed=2",
  "https://api.dicebear.com/6.x/avataaars/svg?seed=3",
  "https://api.dicebear.com/6.x/avataaars/svg?seed=4",
  "https://api.dicebear.com/6.x/avataaars/svg?seed=5",
  "https://api.dicebear.com/6.x/avataaars/svg?seed=6",
  "https://api.dicebear.com/6.x/avataaars/svg?seed=7",
  "https://api.dicebear.com/6.x/avataaars/svg?seed=8",
  "https://api.dicebear.com/6.x/avataaars/svg?seed=9",
  "https://api.dicebear.com/6.x/avataaars/svg?seed=10",
];

const countries = ["India", "United States", "United Kingdom", "Canada"];
const countriesDiallog = ["+1", "+44", "+92", "+91"];

const ProfileEdit = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    country: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [jwtToken, setJwtToken] = useState("");
  const [avatarFile, setAvatarFile] = useState(null); // Stores the actual file
  const [avatarPreview, setAvatarPreview] = useState(null); // Stores preview URL
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Load user data from localStorage when the component mounts
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    const token = localStorage.getItem("jwt");

    if (storedUserData) {
      const userData = JSON.parse(storedUserData);

      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        username: userData.username || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
        country: userData.country || "",
      });

      // ✅ Fix: Set avatar using profileImage (if it exists)
      if (userData.profileImage) {
        setAvatar(userData.profileImage);
      }
    }

    if (token) {
      setJwtToken(token);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file); // Store the actual File object for uploading
      setAvatarPreview(URL.createObjectURL(file)); // Create a preview URL
    }
  };

  // Add loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Update handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("country", formData.country);
  
    // ✅ Only append profileImage if the user selected a new file
    if (avatarFile instanceof File) {
      formDataToSend.append("profileImage", avatarFile);
    }
  
    console.log([...formDataToSend.entries()]); // Debugging
  
    try {
      const response = await fetch(
        "https://www.keywordraja.com/api/update-profile/profile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          body: formDataToSend, // ✅ Correct way to send FormData
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Profile updated successfully!");
        localStorage.setItem("userData", JSON.stringify(data.updatedUser));
      } else {
        alert("Failed to update profile: " + data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarSelect = (avatarUrl) => {
    setAvatar(avatarUrl);
    setAvatarFile(null);
    setAvatarPreview(null);
    setShowAvatarModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 z-0 md:p-10 min-h-screen bg-gray-50 animate-fadeIn">
      <h1 className="text-2xl md:text-4xl font-semibold mb-8 text-[#12153d] px-4 animate-slideIn">
        Edit Profile
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm p-6 md:p-8"
      >
        <div className="flex items-center justify-center md:justify-start mb-8">
          <div className="relative flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <div
              className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 overflow-hidden shadow-lg hover-scale transition-transform cursor-pointer"
              onClick={() => setShowAvatarModal(true)}
            >
              <img
                src={avatarPreview || avatar || Profile}
                alt="Profile"
                className="w-full h-full object-cover transition-transform hover:scale-110"
              />
            </div>

            <label className="px-6 py-3 bg-[#12153d] text-white rounded-lg cursor-pointer hover:bg-[#101447e8] transition-all duration-300 shadow-md hover:scale-105 active:scale-95">
              Upload Photo
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        {/* Avatar Selection Modal */}
        {showAvatarModal && (
          <div className="fixed inset-0 bg-[#00000057] bg-opacity-50 flex items-center justify-center z-50 mt-4 rounded-lg">
            <div className="bg-white rounded-xl p-6 w-[90%] max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Choose Avatar</h3>
                <button
                  onClick={() => setShowAvatarModal(false)}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {defaultAvatars.map((avatarUrl, index) => (
                  <div
                    key={index}
                    onClick={() => handleAvatarSelect(avatarUrl)}
                    className="cursor-pointer rounded-full overflow-hidden border-2 border-transparent hover:border-[#12153d] transition-all duration-300"
                  >
                    <img
                      src={avatarUrl}
                      alt={`Avatar ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 hover:scale-[1.01] transition-transform">
            <div className="space-y-2">
              <label className="text-lg text-gray-700 font-medium">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#12153d] focus:ring-1 focus:ring-[#12153d] transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-lg text-gray-700 font-medium">
                Username
              </label>
              <div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#12153d] focus:ring-1 focus:ring-[#12153d] transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-lg text-gray-700 font-medium">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#12153d] focus:ring-1 focus:ring-[#12153d] transition-all duration-300"
              />
            </div>
          </div>

          <div className="space-y-4 hover:scale-[1.01] transition-transform">
            <div className="space-y-2">
              <label className="text-lg text-gray-700 font-medium">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#12153d] focus:ring-1 focus:ring-[#12153d] transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-lg text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#12153d] focus:ring-1 focus:ring-[#12153d] transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-lg text-gray-700 font-medium">
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#12153d] focus:ring-1 focus:ring-[#12153d] transition-all duration-300"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        // Update the submit button in the return statement
        <div className="mt-8 flex justify-center md:justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-[#12153d] text-white rounded-lg hover:bg-[#101447e8] transition-all duration-300 shadow-md w-full md:w-auto hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
                <span>Saving...</span>
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
