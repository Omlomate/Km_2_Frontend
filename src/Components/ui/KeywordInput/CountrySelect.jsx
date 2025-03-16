import React, { useState } from "react";
import India from "../../../assets/India.svg";
import US from "../../../assets/US.svg";
import UK from "../../../assets/UK.svg";
import Canada from "../../../assets/Canada.svg";
import SA from "../../../assets/SA.svg";
import NZ from "../../../assets/NZ.svg";
import IndiaMap from "../../../assets/IndiaMap.svg";

const CountrySelect = ({ onCountryChange }) => {
  const [selectedCountry, setSelectedCountry] = useState("Select");

  const countries = [
    { name: "Select Country", flag: "" },
    { name: "United States", flag: US, map: IndiaMap },
    { name: "India", flag: India, map: IndiaMap },
    { name: "UK", flag: UK, map: IndiaMap },
    { name: "Canada", flag: Canada, map: IndiaMap },
    { name: "South Africa", flag: SA, map: IndiaMap },
    { name: "New Zealand", flag: NZ, map: IndiaMap },
  ];

  const handleChange = (event) => {
    const country = countries.find(
      (country) => country.name === event.target.value
    );
    setSelectedCountry(country.name);
    onCountryChange(country);
  };

  return (
    <div>
      <select
        className="p-1.5 rounded-xl text-[#12153d] font-light border-2 border-gray-50 
        outline-none flex-grow appearance-none bg-no-repeat 
        transform transition-all duration-300 ease-out
        hover:shadow-[0_0_15px_rgba(229,89,15,0.3)] 
        hover:scale-105 hover:border-[#E5590F] 
        focus:shadow-[0_0_20px_rgba(229,89,15,0.4)] 
        focus:scale-105 focus:border-[#E5590F]
        active:scale-95"
        id="country-select"
        value={selectedCountry}
        onChange={handleChange}
        style={{
          backgroundColor: "#E5590F",
          textAlign: "center",
          backgroundImage: "none",
          width: "160px",
        }}
      >
        {countries.map((country) => (
          <option
            className="rounded-lg text-gray-500 font-light bg-white text-center text-sm
            transition-colors duration-200 hover:bg-gray-100 hover:text-[#E5590F]"
            key={country.name}
            value={country.name}
          >
            {country.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountrySelect;
