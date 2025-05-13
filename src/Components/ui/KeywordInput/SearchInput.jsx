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
  }, [inputValue, country, server, currency, location.pathname]);

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
    <div className="w-full max-w-3xl mx-auto space-y-4 p-4">
      {/* Search Input */}
      {/* <div className="relative group">
        <div className="flex items-center w-full bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 group-hover:shadow-md group-hover:border-orange-400">
          <input
            className="flex-grow p-3 text-sm sm:text-base text-gray-700 placeholder-gray-400 bg-transparent outline-none focus:ring-0"
            type="text"
            placeholder="Search keyword..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button
            className="p-3 text-gray-500 hover:text-orange-500 transition-colors duration-300 flex-shrink-0"
            onClick={handleSearch}
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="24"
              height="24"
              viewBox="0 0 48 48"
            >
              <path
                fill="#616161"
                d="M34.6 28.1H38.6V45.1H34.6z"
                transform="rotate(-45.001 36.586 36.587)"
              ></path>
              <path
                fill="#616161"
                d="M20 4A16 16 0 1 0 20 36A16 16 0 1 0 20 4Z"
              ></path>
              <path
                fill="#37474F"
                d="M36.2 32.1H40.2V44.400000000000006H36.2z"
                transform="rotate(-45.001 38.24 38.24)"
              ></path>
              <path
                fill="#64B5F6"
                d="M20 7A13 13 0 1 0 20 33A13 13 0 1 0 20 7Z"
              ></path>
              <path
                fill="#BBDEFB"
                d="M26.9,14.2c-1.7-2-4.2-3.2-6.9-3.2s-5.2,1.2-6.9,3.2c-0.4,0.4-0.3,1.1,0.1,1.4c0.4,0.4,1.1,0.3,1.4-0.1C16,13.9,17.9,13,20,13s4,0.9,5.4,2.5c0.2,0.2,0.5,0.4,0.8,0.4c0.2,0,0.5-0.1,0.6-0.2C27.2,15.3,27.2,14.6,26.9,14.2z"
              ></path>
            </svg>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></div>
      </div> */}
   
      <div className="relative max-w-sm mx-auto mt-1 lg:max-w-3xl">
        <input
          className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E5590f] focus:border-[#E5590f]/50 transition-all duration-300 lg:py-3 lg:px-6"
          type="search"
          placeholder="Search Keyword..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          aria-label="Search"
        />
        <button
          className="absolute cursor-pointer inset-y-0 right-0 flex items-center px-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-r-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E5590F]/50 focus:border-[#E5590F]/50 lg:px-6"
          aria-label="Search"
          onClick={handleSearch}
        >
          <svg
            className="h-5 w-5 lg:h-6 lg:w-6"
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



      {/* <div className="flex items-center justify-center p-5">
        <div className="rounded-lg p-5">
          <div className="flex">
            <div className="flex w-10 items-center justify-center rounded-tl-lg rounded-bl-lg border-r border-gray-200 bg-white p-5">
              <svg
                viewBox="0 0 20 20"
                aria-hidden="true"
                className="pointer-events-none absolute w-5 fill-gray-500 transition"
              >
                <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z"></path>
              </svg>
            </div>
            <input
              type="text"
              className="w-full max-w-[160px] bg-white pl-2 text-base font-semibold outline-0"
              placeholder="Search Keyword..."
              id=""
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <input
              type="button"
              value="Search"
              onClick={handleSearch}
              aria-label="Search"
              className="bg-[#E5590F] p-2 rounded-tr-lg rounded-br-lg text-white font-semibold hover:bg-[#E5590F]/70 transition-colors"
            />
          </div>
        </div>
      </div> */}

      {/* Select Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
