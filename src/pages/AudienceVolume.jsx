import React, { useState, useEffect } from "react"; // Added useEffect
import { Helmet } from "react-helmet"; // Import Helmet
import useKeywordData from "../hooks/useKeywordData.js";
import BannerAds from "../Components/ui/Ads/BannerAds.jsx";
import SearchInput from "../Components/ui/KeywordInput/SearchInput.jsx";
import AV from "../assets/AV.svg";
import GoogleIcon from "../assets/googleIcon.svg";
import Loader from "../Components/Loading/Loader.jsx";
import CountrySelect from "../Components/ui/KeywordInput/CountrySelect.jsx";
// Import the mediaQueries.css file
import "../pages/style/mediaQueries.css";

export const AudienceVolume = () => {
  const [keywordData, setKeywordData] = useState(null);
  const { data: data3, loading } = useKeywordData();
  const [hover, setHover] = useState(false);
  const [loadingState, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    name: "",
    flag: "",
    map: "",
    apiReference: "",
  });
  const [displayedCountry, setDisplayedCountry] = useState({
    name: "",
    flag: "",
    map: "",
    apiReference: "",
  });
  const [selectedServer, setSelectedServer] = useState({
    name: "Google",
    icon: GoogleIcon,
  });
  const [displayedServer, setDisplayedServer] = useState({
    name: "Google",
    icon: GoogleIcon,
  });
  const [metaTags, setMetaTags] = useState({ title: "", description: "" }); // State for meta tags

  // Fetch meta tags for the Search Volume page
  useEffect(() => {
    const fetchMetaTags = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/meta/search-volume`
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
          title: "Search Volume - Keyword Raja",
          description:
            "Analyze search volume trends with Keyword Raja to optimize your keyword strategy.",
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

  const handleSearch = async (searchTerm) => {
    console.log("Searching for:", searchTerm);
    setLoading(true);

    try {
      if (!selectedCountry.apiReference) {
        alert("Please select a country before searching");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/keywords/keyword-Everywhere-Volume`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            keywords: [searchTerm],
            country: selectedCountry.apiReference,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch data");

      console.log("selectedCountry:", selectedCountry);

      const result = await response.json();
      console.log("Search result:", result);
      setKeywordData(result);

      setDisplayedCountry(selectedCountry);
      setDisplayedServer(selectedServer);
    } catch (error) {
      console.error("Error fetching keyword data:", error);
      setKeywordData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (country) => {
    console.log("Country changed to:", country);
    setSelectedCountry(country);
  };

  const handleServerChange = (server) => {
    setSelectedServer(server);
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
  };

  return (
    <>
      {/* Add Helmet to set meta tags */}
      <Helmet>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
      </Helmet>

      <div className="flex justify-center w-full min-h-screen px-2 sm:py-1 sm:px-1 bg-gradient-to-b from-gray-50 to-white av-container">
        <div
          className="w-full max-w-4xl rounded-xl mx-auto p-3 sm:p-6 md:p-8 bg-white shadow-lg border border-gray-100 av-main-container"
          style={{ fontFamily: "wantedsans" }}
        >
          {/* <div className="w-full py-3 sm:py-6 md:py-8">
            <div className="space-y-2 sm:space-y-3 md:space-y-4 text-center">
              <div className="relative inline-block mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#E5590F]/20 to-[#12153D]/20 rounded-lg blur-md"></div>
                <h1 className="relative text-2xl sm:text-3xl md:text-5xl font-bold text-center text-[#12153D] mb-2 sm:mb-4 animate-slideDown transition-all duration-300 av-title">
                  Search <span className="text-[#E5590F] hover:text-[#ff6a1e] transition-colors duration-300">Volume</span> Analyzer
                </h1>
              </div>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8 animate-slideUp transition-all duration-300 av-description">
                Check how many people search for a keyword each month to know if
                it's worth targeting in your content or SEO strategy.
              </p>
            </div>
          </div> */}
          <div className="w-full py-4 sm:py-6 md:py-8 bg-gradient-to-r from-[#E5590F]/10 to-[#12153D]/10 rounded-lg">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 md:space-y-8 text-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#12153D] transition-all duration-300">
                  Search
                  <span className="text-[#E5590F] hover:text-[#ff6a1e] transition-colors duration-300">
                    Analyzer
                  </span>
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed animate-slide-up">
                  Check how many people search for a keyword each month to know
                  if it's worth targeting in your content or SEO strategy.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full mx-auto rounded-lg flex flex-col items-center av-content-wrapper">
            <div className="w-full max-w-3xl mx-auto av-search-container">
              <div className="transition-all duration-300 p-4 sm:p-6 rounded-xl bg-white border border-gray-200 shadow-md hover:shadow-xl transform hover:scale-[1.01] av-search-box">
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
                    Search for Volume Data
                  </h3>
                </div>
                <SearchInput
                  onSearch={handleSearch}
                  onCountryChange={handleCountryChange}
                  onServerChange={handleServerChange}
                  className="w-full"
                />
              </div>
            </div>

            <div className="w-full mt-6 sm:mt-8 md:mt-10 av-results-container flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
              {loadingState ? (
                <div className="flex flex-col justify-center items-center h-48 sm:h-64 md:h-80 w-full bg-white rounded-xl shadow-md border border-gray-200 p-4 transition-all duration-300 av-loading-container">
                  <Loader />
                  <p className="mt-4 sm:mt-5 md:mt-6 text-sm sm:text-base text-gray-600 animate-pulse av-loading-text">
                    Analyzing search volume data...
                  </p>
                </div>
              ) : (
                keywordData && (
                  <>
                    <style>
                      {`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;700&display=swap');`}
                    </style>

                    <div className="mb-4 sm:mb-6 lg:mb-8 bg-gradient-to-r from-[#12153D]/80 to-[#1c2260]/80 p-6 rounded-2xl border-l-4 border-[#E5590F] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-sm">
                      <div className="flex flex-wrap items-center">
                        <div className="w-10 h-10 rounded-full bg-[#E5590F] flex items-center justify-center mr-4">
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
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white av-results-title">
                            Results for:{" "}
                            <span className="text-[#E5590F]">
                              {keywordData?.data[0]?.keyword || "Keyword"}
                            </span>
                          </h2>
                          <p className="text-sm sm:text-base text-gray-300 mt-2 sm:mt-3 av-results-subtitle">
                            Search volume analysis for{" "}
                            {displayedCountry.name || "selected region"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 av-results-grid">
                      <div className="flex flex-col space-y-5 sm:space-y-6 av-left-column">
                        <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:shadow-xl border border-gray-200 transform hover:scale-[1.01] av-volume-card">
                          <div className="flex items-center mb-4 lg:mb-6">
                            <div className="w-8 h-8 rounded-full bg-[#12153D] flex items-center justify-center mr-3">
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
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                              </svg>
                            </div>
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#12153D] av-volume-title">
                              Audience Volume
                            </h3>
                          </div>

                          <div className="flex flex-col items-center justify-center space-y-5 rounded-lg w-full h-auto min-h-[250px] p-4 bg-gradient-to-b from-white to-gray-50 av-volume-content">
                            <div className="relative group">
                              <p className="text-3xl sm:text-6xl text-[#12153D] font-bold group-hover:scale-105 transition-transform duration-300 av-volume-number">
                                {formatNumber(keywordData?.data[0]?.vol)}
                              </p>
                              <div className="absolute -bottom-3 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#E5590F] to-transparent opacity-20"></div>
                            </div>

                            <div className="text-sm text-gray-500 bg-gray-50 px-4 py-1 rounded-full border border-gray-100">
                              {keywordData?.data[0]?.vol
                                ? `Monthly Search Volume: ${formatNumber(
                                    keywordData?.data[0]?.vol
                                  )}`
                                : "Search Volume: Unknown"}
                            </div>

                            <div className="flex items-center justify-center mt-6 p-3 bg-gray-50 rounded-lg shadow-sm w-full max-w-md">
                              <div className="flex w-full justify-around items-center">
                                {displayedCountry.flag && (
                                  <div className="flex flex-col items-center transform hover:scale-105 transition-transform duration-300 px-4">
                                    <div className="relative">
                                      <img
                                        className="w-12 h-8 sm:w-16 sm:h-12 cursor-pointer shadow-sm rounded border border-gray-200"
                                        src={displayedCountry.flag}
                                        alt={`${displayedCountry.name} Flag`}
                                      />
                                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                    </div>
                                    <span className="text-xs sm:text-sm mt-2 font-medium">
                                      {displayedCountry.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      Region
                                    </span>
                                  </div>
                                )}

                                <div className="h-12 w-px bg-gray-200 mx-2"></div>

                                <div className="flex flex-col items-center transform hover:scale-105 transition-transform duration-300 px-4">
                                  <div className="relative">
                                    <img
                                      className="w-12 h-8 sm:w-16 sm:h-12 shadow-sm rounded p-1 bg-white border border-gray-200"
                                      src={displayedServer.icon}
                                      alt={`${displayedServer.name} Icon`}
                                    />
                                  </div>
                                  <span className="text-xs sm:text-sm mt-2 font-medium">
                                    {displayedServer.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Data Source
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="text-xs text-gray-400 mt-2 flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Data updated: {new Date().toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        {displayedCountry.map && (
                          <div className="w-full bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-200 group">
                            <div className="bg-gradient-to-r from-[#12153D] to-[#1a2057] p-3 sm:p-4 flex items-center justify-between">
                              <h3 className="text-white text-base sm:text-lg font-semibold flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 mr-2 text-[#E5590F]"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                                  />
                                </svg>
                                {displayedCountry.name} Map
                              </h3>
                              <span className="text-xs text-gray-300 bg-[#E5590F] bg-opacity-20 px-2 py-1 rounded-full">
                                Geographic Data
                              </span>
                            </div>
                            <div className="p-4 flex justify-center items-center bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E5590F] via-transparent to-[#E5590F] opacity-30"></div>
                              <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-[#12153D] opacity-5 rounded-full transform group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-700"></div>

                              <div className="relative z-10 w-full flex justify-center">
                                <img
                                  className="object-contain w-full max-h-[220px] transition-all duration-500 ease-in-out transform group-hover:scale-105 shadow-lg rounded-lg"
                                  src={displayedCountry.map}
                                  alt={`${displayedCountry.name} Map`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#12153D] to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                              </div>
                            </div>
                            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
                              <span>Region: {displayedCountry.name}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col space-y-5 sm:space-y-6">
                        <div className="w-full max-w-full sm:max-w-[335px] shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
                          <div
                            className="h-full w-full bg-gradient-to-br from-[#12153D] to-[#1a2057] rounded-2xl text-white text-left transition-all duration-300 p-5 sm:p-8 flex flex-col justify-center relative overflow-hidden"
                            onMouseEnter={() => setHover(true)}
                            onMouseLeave={() => setHover(false)}
                          >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E5590F] opacity-10 rounded-full transform -translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#E5590F] opacity-10 rounded-full transform translate-x-5 translate-y-5 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700"></div>

                            <h1 className="text-xl sm:text-3xl font-semibold mb-3 sm:mb-4 flex items-center relative z-10 group-hover:transform group-hover:translate-y-[-2px] transition-transform duration-300">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 mr-2 text-[#E5590F]"
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
                              What is it?
                              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#E5590F] to-transparent"></span>
                            </h1>
                            <p className="text-xs sm:text-base text-gray-200 relative z-10 leading-relaxed">
                              <span className="text-[#E5590F] font-medium text-base sm:text-lg inline-block mb-1">
                                Audience Volume
                              </span>{" "}
                              represents the number of monthly searches for your
                              keyword in the selected region. Higher volumes
                              indicate greater search interest, helping you
                              identify popular keywords for your SEO and content
                              strategy.
                            </p>
                            <div className="mt-4 pt-2 border-t border-gray-700 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"></div>
                          </div>
                        </div>

                        <div
                          id="sv-ad-1"
                          className="bg-gray-100 w-[90%] sm:max-w-[300px] h-[180px] sm:h-[250px] rounded-xl shadow-sm flex justify-center items-center border border-gray-200"
                        >
                          <h1 className="text-sm sm:text-lg lg:text-2xl font-bold text-gray-400">
                            AD
                          </h1>
                        </div>
                        <div className="w-full sm:w-[300px] relative bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
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
                      id="sv-ad-3"
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

export default AudienceVolume;
