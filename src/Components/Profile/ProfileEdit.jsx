import React, { useState, useEffect } from "react";
import "./ProfileEdit.css";
import Profile from "../../assets/profile.svg";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        "https://keyword-research3.onrender.com/api/update-profile/profile",
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
    }
  };

  return (
    <div className="max-w-9xl mx-auto p-4 md:p-10">
      <h1 className="text-3xl md:text-4xl font-semibold mb-4 md:mb-6">
        Edit Profile
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="flex items-center mb-6">
          <div className="relative flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-1.5">
            <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
              {avatarPreview ? (
                // Show the selected image preview if a new file is uploaded
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : avatar ? (
                // Show the stored Base64 image if available
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                // Default profile image
                <img
                  src={Profile}
                  alt="Default Profile"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <label className="mt-2 inline-block px-4 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200">
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

        <div className="">
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 items-center mt-4">
            <div className="flex flex-col w-full md:w-auto">
              <label className="block font-medium text-lg text-gray-700 ml-3">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="mt-1 block rounded-lg border-1 border-gray-500 w-full md:w-[24rem] focus:border-indigo-500 focus:ring-indigo-500 p-2"
              />
            </div>
            <div className="w-full md:w-auto">
              <label className="block font-medium text-lg text-gray-700 ml-3">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="mt-1 block rounded-lg border-1 border-gray-500 w-full md:w-[24rem] focus:border-indigo-500 focus:ring-indigo-500 p-2"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 items-center mt-4">
            <div className="w-full md:w-auto">
              <label className="block font-medium text-lg text-gray-700 ml-3">
                User Name
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="mt-1 block rounded-lg border-1 border-gray-500 w-full md:w-[24rem] focus:border-indigo-500 focus:ring-indigo-500 p-2"
              />
            </div>
            <div className="w-full md:w-auto">
              <label className="block font-medium text-lg text-gray-700 ml-3">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block rounded-lg border-1 border-gray-500 w-full md:w-[24rem] focus:border-indigo-500 focus:ring-indigo-500 p-2"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 items-center mt-4">
            <div className="w-full md:w-auto">
              <label className="block font-medium text-lg text-gray-700 ml-3">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="mt-1 block rounded-lg border-1 border-gray-500 w-full md:w-[20rem] focus:border-indigo-500 focus:ring-indigo-500 p-2"
              />
            </div>
            <div className="w-full md:w-auto">
              <label className="block font-medium text-lg text-gray-700 ml-3">
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="mt-1 block rounded-lg border-1 border-gray-500 w-full md:w-[24rem] focus:border-indigo-500 focus:ring-indigo-500 p-2"
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

        <div className="flex justify-center md:justify-start">
          <button
            type="submit"
            className="mt-6 button1 w-full md:w-[12rem] md:ml-69 bg-[#12153d] text-white py-2 px-4 rounded-md hover:bg-[#101447e8]"
          >
            Confirm Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
