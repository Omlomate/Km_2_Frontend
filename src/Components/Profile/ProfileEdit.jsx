import React, { useState } from "react";
import "./ProfileEdit.css";

// Simple array of commonly used countries
const countries = ["India", "United States", "United Kingdom", "Canada"];
const countriesDiallog = ["+1", "+44", "+92", "+91"];
const ProfileEdit = () => {
  const [formData, setFormData] = useState({
    firstName: " ",
    lastName: "",
    username: " ",
    email: "",
    phoneNumber: "",
    country: "",
  });
  const [avatar, setAvatar] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <>
      {" "}
      <div className="max-w-9xl mx-auto p-4 md:p-10">
  <h1 className="text-3xl md:text-4xl font-semibold mb-4 md:mb-6">Edit Profile</h1>

  <form className="" onSubmit={handleSubmit}>
    {/* Avatar Section */}
    <div className="flex items-center mb-6">
      <div className="relative flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-1.5">
        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300" />
          )}
        </div>
        <label className="mt-2 inline-block px-4 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200">
          Upload Photo
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </label>
      </div>
    </div>

    {/* Form Fields */}
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
            name="lastname"
            value={formData.username}
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
            value={formData.lastName}
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
          <div className="flex">
            <select className="mt-1 block rounded-l-lg border-1 border-gray-500 focus:border-indigo-500 focus:ring-indigo-500 p-2">
              <option>+91</option>
              {countriesDiallog.map((logs) => (
                <option key={logs} value={logs}>
                  {logs}
                </option>
              ))}
            </select>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="mt-1 block rounded-r-lg border-1 border-gray-500 w-full md:w-[20rem] focus:border-indigo-500 focus:ring-indigo-500 p-2"
            />
          </div>
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
        className="mt-6 button1 w-full md:w-[12rem] md:ml-69 bg-[#12153d] text-white py-2 px-4 rounded-md hover:bg-[#101447e8] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Confirm Changes
      </button>
    </div>
  </form>
</div>
    </>
  );
};

export default ProfileEdit;
