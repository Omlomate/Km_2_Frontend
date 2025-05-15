import React, { useState, useEffect } from "react"; // Added useEffect
import { Helmet } from "react-helmet"; // Import Helmet
import BannerAds from "../Components/ui/Ads/BannerAds.jsx";
import SearchInput from "../Components/ui/KeywordInput/SearchInput.jsx";
import Loader from "../Components/Loading/Loader.jsx";
import CountrySelect from "../Components/ui/KeywordInput/CountrySelect.jsx";
import SelectCurrency from "../Components/ui/KeywordInput/SelectCurrency.jsx";
// Import the mediaQueries.css file
import "../pages/style/mediaQueries.css";

export const CPCPage = () => {
  const [keywordData, setKeywordData] = useState(null);
  const [loadingState, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState({ symbol: "$" });
  const [metaTags, setMetaTags] = useState({ title: "", description: "" }); // State for meta tags

  // Fetch meta tags for the CPC page
  useEffect(() => {
    const fetchMetaTags = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/meta/cpc`
        );
        const data = await response.json();
        setMetaTags({
          title: data.title,
          description: data.description,
        });
      } catch (error) {
        console.error("Error fetching meta tags:", error);
        // Fallback meta tags in case of error
        setMetaTags({
          title: "CPC - Keyword Raja",
          description:
            "Calculate Cost Per Click (CPC) with Keyword Raja to optimize your ad spend .",
        });
      }
    };
    fetchMetaTags();
  }, []);

  const handleMouseEnter = (e) => {
    e.currentTarget.style.boxShadow =
      "4px 4px 8px rgba(229, 89, 15, 0.5), -4px 4px 8px rgba(229, 89, 15, 0.5), 4px -4px 8px rgba(229, 89, 15, 0.5), -4px -4px 8px rgba(229, 89, 15, 0.5)";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.boxShadow = "none";
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country.apiReference);
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency({ symbol: currency.symbol });
  };

  const handleSearch = async (searchTerm) => {
    console.log("Searching for:", searchTerm);
    setLoading(true);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/keywords/keyword-Everywhere-Volume`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            keywords: [searchTerm],
            country: selectedCountry,
            currency: selectedCurrency.symbol,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch data");

      console.log("selectedCurrency:", selectedCurrency);
      console.log("selectedCountry:", selectedCountry);

      const result = await response.json();
      console.log("Search result:", result);
      setKeywordData(result);
    } catch (error) {
      console.error("Error fetching keyword data:", error);
      setKeywordData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Add Helmet to set meta tags */}
      <Helmet>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
      </Helmet>

      <div
        className="flex justify-center w-full min-h-screen px-2 sm:py-1 sm:px-1 bg-gradient-to-b from-gray-50 to-white cpc-container"
        style={{ fontFamily: "wantedsans" }}
      >
        <div className="w-full max-w-6xl rounded-xl mx-auto p-3 sm:p-6 md:p-8 bg-white shadow-lg border border-gray-100 cpc-main-container">
          {/* Header */}
          {/* <div className="w-full py-3 sm:py-6 md:py-8 cpc-header">
            <div className="space-y-2 sm:space-y-3 md:space-y-4 text-center">
              <div className="relative inline-block mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#E5590F]/20 to-[#12153D]/20 rounded-lg blur-md"></div>
                <h1 className="relative text-2xl sm:text-3xl md:text-5xl font-bold text-center text-[#12153D] mb-2 sm:mb-4 animate-slideDown transition-all duration-300 cpc-title">
                  Cost <span className="text-[#E5590F] hover:text-[#ff6a1e] transition-colors duration-300">Per Click</span>{" "}
                  Calculator
                </h1>
              </div>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8 animate-slideUp transition-all duration-300 cpc-description">
                Find out how much advertisers pay per click for a keyword,
                helping you spot keywords with strong earning potential.{" "}
              </p>
            </div>
          </div> */}
          <div className="w-full py-4 sm:py-6 md:py-8 bg-gradient-to-r from-[#E5590F]/10 to-[#12153D]/10 rounded-lg">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 md:space-y-8 text-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#12153D] transition-all duration-300">
                  Cost{" "}
                  <span className="text-[#E5590F] hover:text-[#ff6a1e] transition-colors duration-300">
                    Per Click{" "}
                  </span>
                  Calculator
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed animate-slide-up">
                  Find out how much advertisers pay per click for a keyword,
                  helping you spot keywords with strong earning potential.{" "}
                </p>
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div className="w-full mx-auto rounded-lg flex flex-col items-center cpc-content-wrapper">
            <div className="w-full max-w-3xl mx-auto cpc-search-container">
              <div className="transition-all duration-300 p-4 sm:p-6 rounded-xl transform hover:scale-[1.01] cpc-search-box">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#E5590F]/10 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#E5590F]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#12153D]">
                    Search for CPC Data
                  </h3>
                </div>
                <SearchInput
                  onSearch={handleSearch}
                  onCountryChange={handleCountryChange}
                  onCurrencyChange={handleCurrencyChange}
                />
              </div>
            </div>

            {/* Results */}
            <div className="w-full max-w-3xl mt-6 sm:mt-8 md:mt-10 cpc-results-container">
              {loadingState ? (
                <div className="flex flex-col justify-center items-center h-48 sm:h-64 md:h-80 w-fit mx-auto p-4 transition-all duration-300 adc-loading-container">
                  <Loader />
                  <p className="mt-4 sm:mt-5 md:mt-6 text-sm sm:text-base text-gray-600 animate-pulse cpc-loading-text">
                    Calculating CPC...
                  </p>
                </div>
              ) : (
                keywordData && (
                  <>
                    <style>
                      {`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;700&display=swap');`}
                    </style>

                    <div className="mb-4 sm:mb-6 lg:mb-8 bg-gradient-to-r from-[#12153D] to-[#1c2260] p-6 rounded-xl border-l-4 border-[#E5590F] shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] cpc-results-header animate-fadeIn">
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E5590F] to-[#ff6a1e] flex items-center justify-center mr-4 shadow-md transform hover:rotate-12 transition-all duration-300 mb-3 sm:mb-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-[#E5590F]/10 to-transparent rounded-lg blur-sm opacity-70"></div>
                          <div className="relative">
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white cpc-results-title animate-slideDown">
                              Results for:{" "}
                              <span className="text-[#E5590F] hover:text-[#ff6a1e] transition-colors duration-300">
                                {keywordData?.data?.[0]?.keyword || "Keyword"}
                              </span>
                            </h2>
                            <p className="text-sm sm:text-base text-gray-300 mt-2 sm:mt-3 cpc-results-subtitle animate-slideUp">
                              CPC and keyword value insights
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 cpc-results-grid">
                      {/* CPC Value Card */}
                      <div className="flex flex-col space-y-5 sm:space-y-6 cpc-left-column">
                        <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:shadow-xl border border-gray-200 transform hover:scale-[1.01] cpc-value-card animate-fadeIn">
                          <div className="flex items-center mb-4 lg:mb-6">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#12153D] to-[#1c2260] flex items-center justify-center mr-3 shadow-md transform hover:rotate-6 transition-all duration-300">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </div>
                            <div className="relative">
                              <div className="absolute -inset-1 bg-gradient-to-r from-[#12153D]/10 to-transparent rounded-lg blur-sm opacity-70"></div>
                              <h3 className="relative text-lg sm:text-xl lg:text-2xl font-semibold text-[#12153D] cpc-value-title animate-slideDown">
                                Cost Per Click
                              </h3>
                            </div>
                          </div>
                          <div className="flex flex-col items-center justify-center space-y-5 rounded-lg w-full h-auto min-h-[150px] p-4 bg-gradient-to-b from-white to-gray-50 border border-gray-100 shadow-inner cpc-value-content">
                            <div className="relative group">
                              <div className="absolute -inset-4 bg-gradient-to-r from-[#E5590F]/5 via-[#E5590F]/10 to-[#E5590F]/5 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              <div className="text-5xl flex text-[#12153d] font-bold font-sans space-x-1 items-center group-hover:scale-105 transition-transform duration-300 cpc-value-number relative">
                                <span className="p-2 animate-fadeIn transition-all duration-500">
                                  {keywordData?.data?.[0]?.cpc?.currency}
                                </span>
                                <span className="p-2 animate-fadeIn transition-all duration-500 delay-100">
                                  {keywordData?.data?.[0]?.cpc?.value}
                                </span>
                              </div>
                              <div className="absolute -bottom-3 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#E5590F] to-transparent opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                            </div>
                          </div>
                        </div>

                        <div className="w-full bg-gradient-to-br from-[#12153d] to-[#1c2260] rounded-xl shadow-lg p-6 sm:p-10 text-white text-center lg:text-left cpc-info-card transition-transform duration-300 transform hover:scale-105 hover:shadow-xl">
                          <h3 className="text-xl font-bold mb-3 cpc-info-title">
                            CPC for SEO
                          </h3>
                          <p className="text-sm sm:text-base cpc-info-text leading-relaxed">
                            CPC for SEO depends entirely on your industry and
                            desired ROI. A good CPC allows you to achieve your
                            marketing goals while maintaining a positive ROI.
                          </p>
                        </div>

                        <div className=" w-full sm:w-[336px] lg:h-[180px] lg:[280px] sm:h-[280px] mt-4 rounded-md flex justify-center items-center cpc-ad-container">
                          <h4 className="text-2xl font-bold">AD</h4>
                        </div>
                      </div>

                      {/* Info and Ads */}
                      <div className="w-full lg:w-fit flex flex-col items-center lg:items-start space-y-4 sm:space-y-6 cpc-right-column animate-fadeIn">
                        <div className="w-full max-w-full sm:max-w-[335px] shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden cpc-what-card transform hover:scale-[1.02] group bg-white">
                          <div className="relative h-full w-full bg-gradient-to-br from-[#12153D] to-[#1c2260] rounded-2xl text-white text-left transition-all duration-300 p-4 sm:p-6 md:p-6 flex flex-col justify-center">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-[#E5590F]/20 to-transparent rounded-full blur-lg opacity-30 group-hover:opacity-70 transition-all duration-300 transform -translate-x-4 translate-y-0"></div>
                            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-[#12153D]/40 to-transparent rounded-full blur-lg opacity-30 group-hover:opacity-60 transition-all duration-300"></div>

                            {/* Card header */}
                            <div className="flex items-center mb-3 relative z-10">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E5590F] to-[#ff6a1e] flex items-center justify-center mr-3 shadow-md transform group-hover:rotate-6 transition-all duration-300">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </div>
                              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold relative z-10 animate-slideDown group-hover:text-[#E5590F] transition-colors duration-300">
                                What is it?
                                <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-[#E5590F] rounded-full transform origin-left scale-0 group-hover:scale-100 transition-transform duration-300 delay-100"></div>
                              </h1>
                            </div>

                            {/* Card content */}
                            <div className="pl-11 relative z-10">
                              <p className="text-xs sm:text-sm text-gray-200 cpc-what-text animate-slideUp">
                                <span className="text-[#E5590F] font-medium inline-block hover:text-[#ff6a1e] transition-colors duration-300 transform hover:scale-105">
                                  CPC
                                </span>{" "}
                                is the highest amount that you're willing to pay
                                for a click on your ad. Your max. CPC is the
                                most you'll be charged for a click, but you'll
                                often be charged less—sometimes much less.
                              </p>
                            </div>

                            {/* Card footer */}
                            <div className="mt-4 pl-11 relative z-10 opacity-0 group-hover:opacity-100 transition-all duration-500">
                              <a
                                href="#"
                                className="text-xs text-[#E5590F] hover:text-[#ff6a1e] transition-colors duration-300 flex items-center"
                              >
                                Learn more
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 ml-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </a>
                            </div>

                            {/* Bottom border */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E5590F] to-transparent opacity-0 group-hover:opacity-30 transition-all duration-300"></div>
                          </div>
                        </div>

                        <div className=" w-[300px] sm:w-[300px] h-[250px] sm:h-[250px] mt-4  ">
                          <h1 className="text-md lg:text-2xl font-bold ">AD</h1>
                        </div>
                      </div>
                    </div>

                    <div
                      id="cpc-ad-3"
                      className="bg-gradient-to-r from-[#12153d] to-[#1c2260] text-white mt-6 sm:mt-8 lg:mt-10 p-4 lg:p-6 rounded-xl text-center w-full max-w-[728px] mx-auto flex items-center justify-center shadow-md aspect-[8/1] hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]"
                    >
                      ads
                    </div>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CPCPage;
