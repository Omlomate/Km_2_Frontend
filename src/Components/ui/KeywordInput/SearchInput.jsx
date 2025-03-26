import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import useKeywordData from "../../../hooks/useKeywordData";
import CountrySelect from "./CountrySelect";
import ServerSelect from "./ServerSelect";
import SelectCurrency from "./SelectCurrency";

const SearchInput = ({
  onSearch,
  onCountryChange = () => {},
  onServerChange = () => {},
  onCurrencyChange = () => {},
}) => {
  const { searchTerm, setSearchTerm } = useKeywordData();
  const [country, setCountry] = useState("");
  const [server, setServer] = useState("");
  const [currency, setCurrency] = useState("");
  const location = useLocation();

  const handleSearch = () => {
    if (location.pathname === "/CPC") {
      if (!country || !currency) {
        alert("Country and Currency are required");
        return;
      }
    } else {
      if (!country || !server) {
        alert("Country and Server are required");
        return;
      }
    }
    console.log("Searching for:", searchTerm);
    onSearch(searchTerm);
  };

  const handleCountryChange = (selectedCountry) => {
    setCountry(selectedCountry);
    onCountryChange(selectedCountry);
  };

  const handleServerChange = (selectedServer) => {
    setServer(selectedServer);
    onServerChange(selectedServer);
  };

  const handleCurrencyChange = (selectedCurrency) => {
    setCurrency(selectedCurrency);
    onCurrencyChange(selectedCurrency);
  };

  return (
    <div className="flex flex-col justify-around w-full space-y-3 sm:space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
      <div
        className="w-full lg:w-1/2 max-w-full shadow-sm p-1 rounded-xl flex items-center border border-gray-400 transition-all duration-300 hover:shadow-lg hover:border-[#E5590F] group"
        id="one"
      >
        <input
          className="border-none outline-none flex-grow p-[6.5px] text-sm sm:text-base"
          type="text"
          placeholder="Search keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="transition-transform duration-300 hover:scale-110">
          <i
            className="fa-solid fa-magnifying-glass cursor-pointer text-xl sm:text-2xl p-1 text-gray-500 transition-colors duration-300 hover:text-[#E5590F]"
            onClick={handleSearch}
          ></i>
        </div>
      </div>
      <div
        className="w-full lg:w-1/2 flex sm:flex-row justify-center items-normal
        0 border border-gray-400 p-2 rounded-xl space-y-2 sm:space-y-0 sm:space-x-4 md:space-x-14 transition-all duration-300 hover:shadow-lg hover:border-[#E5590F]"
        id="two"
      >
        <CountrySelect onCountryChange={handleCountryChange} />
        {location.pathname === "/CPC" ? (
          <SelectCurrency onCurrencyChange={handleCurrencyChange} />
        ) : (
          <ServerSelect onServerChange={handleServerChange} />
        )}
      </div>
    </div>
  );
};

export default SearchInput;
