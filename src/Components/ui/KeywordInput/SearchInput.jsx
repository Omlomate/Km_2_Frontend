import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import useKeywordData from "../../../hooks/useKeywordData";
import CountrySelect from "./CountrySelect";
import ServerSelect from "./ServerSelect";
import SelectCurrency from "./SelectCurrency";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SearchInput = ({
  onSearch,
  onCountryChange = () => {},
  onServerChange = () => {},
  onCurrencyChange = () => {},
  placeholder = "Search Keyword...", // Default placeholder
  icon = null, // Default icon
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

  const handleSearch = () => {
    if (location.pathname === "/CPC") {
      if (!country || !currency) {
        toast.error("Country and Currency are required");
        return;
      }
    } else {
      if (!country || !server) {
        toast.error("Country and Search engine are required");
        return;
      }
    }
    setSearchTerm(inputValue);
    console.log("Searching for:", inputValue);
    onSearch(inputValue);
  };

  // const handleKeyPress = (e) => {
  //   if (e.key === "Enter") {
  //     handleSearch();
  //   }
  // };

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
    <div className="w-full max-w-3xl mx-auto space-y-6 pt-4">
      {/* Search Input */}
      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-full flex overflow-hidden rounded-lg border-1 border-gray-300 shadow-sm bg-white">
           {icon && (
            <div className="w-fit h-full my-auto flex items-center justify-center bg-[#E5590F]/10 py-4 px-4">
              {icon}
            </div>
           )}
          <input
            className="flex-grow min-w-0 w-full py-2 sm:py-3 px-1 sm:px-2 text-sm sm:text-base focus:outline-none bg-transparent truncate"
            type="search"
            placeholder={placeholder} // Use the placeholder prop
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            aria-label="Search"
          />
          {/* Search Button */}
          <button
            className="px-3 sm:px-4 py-2 sm:py-3 text-white bg-gradient-to-r from-[#E5590F] to-[#E5590F]/90 flex items-center justify-center hover:from-[#E5590F]/90 hover:to-[#E5590F] transition-all duration-300 active:scale-95 touch-manipulation"
            aria-label="Search"
            onClick={handleSearch}
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.795 13.408l5.204 5.204a1 1 0 01-1.414 1.414l-5.204-5.204a7.5 7.5 0 111.414-1.414zM8.5 14A5.5 5.5 0 103 8.5 5.506 5.506 0 008.5 14z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Select Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
        <div className="w-full">
          <CountrySelect onCountryChange={handleCountryChange} />
        </div>
        <div className="w-full">
          {location.pathname === "/CPC" ? (
            <SelectCurrency onCurrencyChange={handleCurrencyChange} />
          ) : (
            <ServerSelect onServerChange={handleServerChange} />
          )}
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default SearchInput;