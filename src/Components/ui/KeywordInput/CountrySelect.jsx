import React, { useState } from "react";
import India from "../../../assets/India.svg";
import US from "../../../assets/US.svg";
import UK from "../../../assets/UK.svg";
import Canada from "../../../assets/Canada.svg";
import SA from "../../../assets/SA.svg";
import NZ from "../../../assets/NZ.svg";
import IndiaMap from "../../../assets/IndiaMap.svg";
import USA from "../../../assets/USAMap.svg";
import UKMap from "../../../assets/UKMap.svg";
import CanadaMap from "../../../assets/CanadaMap.svg";
import SAMap from "../../../assets/SAMap.svg";
import NZMap from "../../../assets/NZMap.svg";

const CountrySelect = ({ onCountryChange }) => {
  const [selectedCountry, setSelectedCountry] = useState("Select");

  const countries = [
    { name: "Country", flag: "", apiReference: "" },
    { name: "Global", flag: "", apiReference: "" },
    { name: "United States", flag: US, map: USA, apiReference: "us" },
    { name: "India", flag: India, map: IndiaMap, apiReference: "in" },
    { name: "UK", flag: UK, map: UKMap, apiReference: "gb" },
    { name: "Canada", flag: Canada, map: CanadaMap, apiReference: "ca" },
    { name: "South Africa", flag: SA, map: SAMap, apiReference: "za" },
    { name: "New Zealand", flag: NZ, map: NZMap, apiReference: "nz" },
  ];

  const handleChange = (event) => {
    const country = countries.find(
      (country) => country.name === event.target.value
    );
    setSelectedCountry(country.name);
    onCountryChange(country);
  };

  return (
    <div className="flex justify-center w-full">
      <select
        className="w-full p-1.5 rounded-xl text-white font-medium border-none 
        outline-none appearance-none bg-no-repeat 
        hover:bg-[#d14e0d] transition-all duration-300 text-center"
        id="country-select"
        value={selectedCountry}
        onChange={handleChange}
        style={{
          backgroundColor: "#E5590F",
          backgroundImage: "none",
          textAlignLast: "center", // Fix for iOS
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