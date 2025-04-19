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
  const [inputValue, setInputValue] = useState(searchTerm || "");
  const [country, setCountry] = useState("");
  const [server, setServer] = useState("");
  const [currency, setCurrency] = useState("");
  const location = useLocation();

  // Keep hook and local state in sync
  React.useEffect(() => {
    setInputValue(searchTerm || "");
  }, [searchTerm]);

  // Add global Enter key listener
  React.useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
    // eslint-disable-next-line
  }, [inputValue, country, server, currency, location.pathname]);

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
    setSearchTerm(inputValue); // Ensure hook is updated
    console.log("Searching for:", inputValue);
    onSearch(inputValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setSearchTerm(e.target.value);
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
    <div className="flex flex-col justify-around w-full space-y-4">
      <div
        className="w-full max-w-full shadow-sm p-1 rounded-xl flex items-center border border-gray-400 transition-all duration-300 hover:shadow-lg hover:border-[#E5590F] group"
        id="one"
      >
        <input
          className="border-none outline-none flex-grow p-[6.5px] text-sm sm:text-base"
          type="text"
          placeholder="Search keyword..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <div className="transition-transform duration-300 hover:scale-110">
          <i
            className="fa-solid fa-magnifying-glass cursor-pointer text-xl sm:text-2xl p-1 text-gray-500 transition-colors duration-300 hover:text-[#E5590F]"
            onClick={handleSearch}
          ></i>
        </div>
      </div>
      
      <div className="w-full flex flex-row justify-center items-center gap-4">
        <div className="w-1/2 flex justify-center">
          <CountrySelect onCountryChange={handleCountryChange} />
        </div>
        <div className="w-1/2 flex justify-center">
          {location.pathname === "/CPC" ? (
            <SelectCurrency onCurrencyChange={handleCurrencyChange} />
          ) : (
            <ServerSelect onServerChange={handleServerChange} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchInput;