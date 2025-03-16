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
    { name: "United States", flag: US,map:IndiaMap },
    { name: "India", flag: India,map:IndiaMap },
    { name: "UK", flag: UK,map:IndiaMap },
    { name: "Canada", flag: Canada,map:IndiaMap },
    { name: "South Africa", flag: SA,map:IndiaMap },
    { name: "New Zealand", flag: NZ,map:IndiaMap },
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
        className="p-1.5 rounded-xl text-[#12153d]   font-light border border-gray-50 outline-none flex-grow appearance-none bg-no-repeat hover:shadow-lg hover:scale-105 transition-700 delay-150 ease-in-out"
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
            className="rounded-lg text-gray-500 font-light bg-white text-center text-sm"
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
