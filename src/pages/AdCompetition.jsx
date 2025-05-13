import React, { useState, useEffect } from "react"; // Added useEffect
import { Helmet } from "react-helmet"; // Import Helmet
import useKeywordData from "../hooks/useKeywordData.js";
import BannerAds from "../Components/ui/Ads/BannerAds.jsx";
import SearchInput from "../Components/ui/KeywordInput/SearchInput.jsx";
import IndicatorScale from "../Components/ui/Graphs/IndicatorScale.jsx";
import GoogleIcon from "../assets/googleIcon.svg";
import Loader from "../Components/Loading/Loader.jsx";
import CountrySelect from "../Components/ui/KeywordInput/CountrySelect.jsx";
// Import the mediaQueries.css file
import "../pages/style/mediaQueries.css";

export const AdCompetition = () => {
  const [keywordData, setKeywordData] = useState(null);
  const { data: data3, loading } = useKeywordData();
  const [hover, setHover] = useState(false);
  const [loadingState, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [metaTags, setMetaTags] = useState({ title: "", description: "" }); // State for meta tags

  // Fetch meta tags for the Ad Competition page
  useEffect(() => {
    const fetchMetaTags = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/meta/ad-competition`
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
          title: "Ad Competition - Keyword Raja",
          description:
            "Assess ad competition levels with Keyword Raja to refine your advertising strategy.",
        });
      }
    };
    fetchMetaTags();
  }, []);
  // Load video player script
  useEffect(() => {
    const loadVideoPlayer = () => {
      const existingScripts = document.querySelectorAll(
        'script[src*="kolorowey.com"], script[data-playerPro]'
      );
      existingScripts.forEach((script) => script.remove());

      const videoScript = document.createElement("script");
      videoScript.src = "https://stream.kolorowey.com/player/video.js";
      videoScript.async = true;

      videoScript.onload = () => {
        const playerScript = document.createElement("script");
        playerScript.innerHTML = `
        (function(){
          (playerPro = window.playerPro || []).push({
            id: "p2P21nhppseX"
          });
        })();
      `;
        document.body.appendChild(playerScript);
      };

      document.body.appendChild(videoScript);
    };

    if (keywordData) {
      setTimeout(loadVideoPlayer, 100);
    }

    return () => {
      const scripts = document.querySelectorAll(
        'script[src*="kolorowey.com"], script[data-playerPro]'
      );
      scripts.forEach((script) => script.remove());
    };
  }, [keywordData]);

  const handleCountryChange = (country) => {
    setSelectedCountry(country.apiReference);
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
            currency: selectedCurrency,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch data");

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
        className="flex justify-center w-full min-h-screen px-2 sm:py-1 sm:px-1 bg-gradient-to-b from-gray-50 to-white adc-container"
        style={{ fontFamily: "wantedsans" }}
      >
        <div className="w-full max-w-6xl rounded-xl mx-auto p-3 sm:p-6 md:p-8 bg-white shadow-lg border border-gray-100 adc-main-container">
          {/* Header */}
          {/* <div className="w-full py-3 sm:py-6 md:py-8 adc-header">
            <div className="space-y-2 sm:space-y-3 md:space-y-4 text-center">
              <div className="relative inline-block mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#E5590F]/20 to-[#12153D]/20 rounded-lg blur-md"></div>
                <h1 className="relative text-2xl sm:text-3xl md:text-5xl font-bold text-center text-[#12153D] mb-2 sm:mb-4 animate-slideDown transition-all duration-300 adc-title">
                  Ad <span className="text-[#E5590F] hover:text-[#ff6a1e] transition-colors duration-300">Competition</span> Checker
                </h1>
              </div>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8 animate-slideUp transition-all duration-300 adc-description">
                Check how many advertisers are bidding on a keyword to
                understand its commercial value and competition level.{" "}
              </p>
            </div>
          </div> */}
          <div className="w-full py-4 sm:py-6 md:py-8 bg-gradient-to-r from-[#E5590F]/10 to-[#12153D]/10 rounded-lg">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 md:space-y-8 text-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#12153D] transition-all duration-300">
                  AD
                  <span className="text-[#E5590F] hover:text-[#ff6a1e] transition-colors duration-300">
                    Competition
                  </span>
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed animate-slide-up">
                  Check how many advertisers are bidding on a keyword to
                  understand its commercial value and competition level.{" "}
                </p>
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div className="w-full mx-auto rounded-lg flex flex-col items-center adc-content-wrapper">
            <div className="w-full max-w-3xl mx-auto adc-search-container">
              <div className="transition-all duration-300 p-4 sm:p-6 rounded-xl bg-white border border-gray-200 shadow-md hover:shadow-xl transform hover:scale-[1.01] adc-search-box">
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
                    Search for Ad Competition
                  </h3>
                </div>
                <SearchInput
                  onSearch={handleSearch}
                  onCountryChange={handleCountryChange}
                />
              </div>
            </div>

            {/* Results */}
            <div className="w-full max-w-3xl mt-6 sm:mt-8 md:mt-10 adc-results-container">
              {loadingState ? (
                <div className="flex flex-col justify-center items-center h-48 sm:h-64 md:h-80 w-full bg-white rounded-xl shadow-md border border-gray-200 p-4 transition-all duration-300 adc-loading-container">
                  <Loader />
                  <p className="mt-4 sm:mt-5 md:mt-6 text-sm sm:text-base text-gray-600 animate-pulse adc-loading-text">
                    Checking ad competition...
                  </p>
                </div>
              ) : (
                keywordData && (
                  <>
                    <style>
                      {`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;700&display=swap');`}
                    </style>

                    <div className="mb-4 sm:mb-6 lg:mb-8 bg-gradient-to-r from-[#12153D] to-[#1c2260] p-6 rounded-xl border-l-4 border-[#E5590F] shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] adc-results-header animate-fadeIn">
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
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white adc-results-title animate-slideDown">
                              Results for:{" "}
                              <span className="text-[#E5590F] hover:text-[#ff6a1e] transition-colors duration-300">
                                {keywordData?.data?.[0]?.keyword || "Keyword"}
                              </span>
                            </h2>
                            <p className="text-sm sm:text-base text-gray-300 mt-2 sm:mt-3 adc-results-subtitle animate-slideUp">
                              Ad competition score and insights
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 adc-results-grid">
                      {/* Competition Value Card */}
                      <div className="flex flex-col space-y-5 sm:space-y-6 lg:w-fit adc-left-column">
                        <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:shadow-xl border border-gray-200 transform hover:scale-[1.01] adc-value-card animate-fadeIn">
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
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                              </svg>
                            </div>
                            <div className="relative">
                              <div className="absolute -inset-1 bg-gradient-to-r from-[#12153D]/10 to-transparent rounded-lg blur-sm opacity-70"></div>
                              <h3 className="relative text-lg sm:text-xl lg:text-2xl font-semibold text-[#12153D] adc-value-title animate-slideDown">
                                Ad Competition
                              </h3>
                            </div>
                          </div>
                          <div className="flex flex-col items-center justify-center space-y-5 rounded-lg w-full h-auto min-h-[150px] p-4 bg-gradient-to-b from-white to-gray-50 border border-gray-100 shadow-inner adc-value-content">
                            <div className="relative group">
                              <div className="absolute -inset-4 bg-gradient-to-r from-[#E5590F]/5 via-[#E5590F]/10 to-[#E5590F]/5 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              <div className="text-5xl flex text-[#12153d] font-bold font-sans space-x-1 items-center group-hover:scale-105 transition-transform duration-300 adc-value-number relative">
                                <span className="p-2 animate-fadeIn transition-all duration-500">
                                  {keywordData?.data?.[0]?.competition}
                                </span>
                              </div>
                              <div className="absolute -bottom-3 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#E5590F] to-transparent opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                            </div>
                          </div>
                        </div>

                        <div className="w-full bg-gradient-to-br from-[#12153d] to-[#1c2260] rounded-xl shadow-lg p-4 sm:p-6 md:p-8 text-white text-center lg:text-left adc-scale-card transform hover:scale-[1.01] transition-all duration-300 hover:shadow-xl border border-[#12153d]/80 animate-fadeIn group">
                          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E5590F] to-[#ff6a1e] flex items-center justify-center shadow-md transform group-hover:rotate-6 transition-all duration-300 flex-shrink-0">
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
                                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                                />
                              </svg>
                            </div>

                            <div className="relative">
                              <div className="absolute -inset-1 bg-gradient-to-r from-[#E5590F]/10 to-transparent rounded-lg blur-sm opacity-0 group-hover:opacity-70 transition-all duration-300"></div>
                              <h3 className="relative text-lg sm:text-xl font-semibold mb-2 adc-scale-title group-hover:text-[#E5590F] transition-colors duration-300 animate-slideDown">
                                Competition Scale
                              </h3>
                              <p className="adc-scale-text text-sm sm:text-base text-gray-200 animate-slideUp max-w-md">
                                Measured on a scale of 0 to 1, with higher
                                numbers indicating more competition in the
                                advertising space.
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-center lg:justify-start mt-6 adc-scale-container relative overflow-hidden rounded-lg p-4 bg-[#ffffff0f] backdrop-blur-sm border border-white/10 group-hover:border-[#E5590F]/20 transition-all duration-300">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#E5590F]/5 via-transparent to-[#E5590F]/5 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
                            <div className="relative z-10 w-full">
                              <IndicatorScale
                                value={keywordData?.data?.[0]?.competition}
                              />
                              <div className="flex justify-between mt-2 text-xs text-gray-300">
                                <span className="transition-all duration-300 group-hover:text-white">
                                  Low
                                </span>
                                <span className="transition-all duration-300 group-hover:text-white">
                                  Medium
                                </span>
                                <span className="transition-all duration-300 group-hover:text-white">
                                  High
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 text-xs text-gray-300 italic text-center lg:text-left animate-fadeIn transition-all duration-500 delay-300">
                            <span className="inline-block border-b border-[#E5590F]/30 pb-1 group-hover:border-[#E5590F] transition-all duration-300">
                              Higher competition may indicate higher commercial
                              value
                            </span>
                          </div>
                        </div>

                        <div
                          id="adc-ad-1"
                          className="bg-gradient-to-br from-gray-200 to-gray-300 w-full sm:w-[336px] h-[180px] sm:h-[280px] mt-4 rounded-md flex justify-center items-center adc-ad-container shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] overflow-hidden relative group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-[#12153D]/5 to-[#E5590F]/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                          <div className="absolute -inset-1 bg-gradient-to-r from-[#E5590F]/10 to-[#12153D]/10 rounded-lg blur-md opacity-0 group-hover:opacity-70 transition-all duration-700"></div>
                          <h4 className="text-2xl font-bold relative z-10 text-gray-700 group-hover:text-gray-800 transition-all duration-300 transform group-hover:scale-110 animate-pulse">
                            AD
                          </h4>
                        </div>
                      </div>

                      {/* Info and Ads */}
                      <div className="w-full lg:w-fit flex flex-col items-center lg:items-start space-y-4 sm:space-y-6 adc-right-column animate-fadeIn">
                        <div className="w-full max-w-full sm:max-w-[335px] shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden adc-what-card transform hover:scale-[1.02] group">
                          <div className="relative h-full w-full bg-gradient-to-br from-[#12153D] to-[#1c2260] rounded-2xl text-white text-left transition-all duration-500 p-4 sm:p-6 md:p-8 flex flex-col justify-center">
                            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-[#E5590F]/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-8 -translate-y-8 group-hover:translate-x-0 group-hover:translate-y-0"></div>

                            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2 sm:mb-3 adc-what-title relative z-10 animate-slideDown">
                              What is it?
                              <div className="absolute -bottom-1 left-0 w-12 h-1 bg-[#E5590F] rounded-full transform origin-left scale-0 group-hover:scale-100 transition-transform duration-300 delay-100"></div>
                            </h1>

                            <p className="text-xs sm:text-sm md:text-base text-gray-200 adc-what-text relative z-10 animate-slideUp">
                              <span className="text-[#E5590F] font-medium inline-block hover:text-[#ff6a1e] transition-colors duration-300 transform hover:scale-105">
                                Ad Competition
                              </span>{" "}
                              is a measure of how much competition there is for
                              a product, keyword, or market. It can help
                              businesses understand how to position themselves
                              in a competitive market.
                            </p>

                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E5590F] to-transparent opacity-0 group-hover:opacity-30 transition-all duration-500 delay-200"></div>
                          </div>
                        </div>

                        <div
                          id="adc-ad-2"
                          className="bg-gradient-to-br from-gray-200 to-gray-300 w-full sm:w-[300px] h-[180px] sm:h-[250px] mt-4 rounded-md flex justify-center items-center adc-ad-small shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] overflow-hidden relative group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-[#12153D]/5 to-[#E5590F]/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                          <div className="absolute -inset-1 bg-gradient-to-r from-[#E5590F]/10 to-[#12153D]/10 rounded-lg blur-md opacity-0 group-hover:opacity-70 transition-all duration-700"></div>
                          <h1 className="text-md lg:text-2xl font-bold relative z-10 text-gray-700 group-hover:text-gray-800 transition-all duration-300 transform group-hover:scale-110 animate-pulse">
                            AD
                          </h1>
                        </div>

                        <div className="w-full sm:w-[300px] relative bg-gray-100 rounded-xl overflow-hidden border border-gray-200 adc-video-container shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]">
                          <div
                            className="relative w-full"
                            style={{ paddingBottom: "56.25%" }}
                          >
                            <div
                              id="p2P21nhppseX"
                              className="absolute inset-0 w-full h-full"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      id="adc-ad-3"
                      className="bg-gradient-to-r from-[#12153d] to-[#1c2260] text-white mt-6 sm:mt-10 p-3 sm:p-4 md:p-6 rounded-xl text-center w-full max-w-full mx-auto md:w-[728px] md:h-[90px] h-[60px] sm:h-[70px] flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] adc-footer"
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

export default AdCompetition;
