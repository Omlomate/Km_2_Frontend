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
    { name: " Country", flag: "", apiReference: "" },
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
    <div>
      <select
        className="p-1.5 rounded-xl text-[#12153d] font-light border-2 border-gray-50 
        outline-none flex-grow appearance-none bg-no-repeat 
        hover:shadow-[0_0_15px_rgba(229,89,15,0.3)] 
        hover:border-[#E5590F]
        focus:shadow-[0_0_20px_rgba(229,89,15,0.4)]
        focus:border-[#E5590F]"
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
