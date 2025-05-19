import React, { useState, useEffect } from "react"; // Added useEffect
import { Helmet } from "react-helmet"; // Import Helmet
import BannerAds from "../Components/ui/Ads/BannerAds.jsx";
import SearchInput from "../Components/ui/KeywordInput/SearchInput.jsx";
import KeywordContainer from "../Components/ui/LongTailKeyword/KeywordContainer.jsx";
import Loader from "../Components/Loading/Loader.jsx";
// Import the mediaQueries.css file
import "../pages/style/mediaQueries.css";
// Import the video player script utility
import {
  loadVideoPlayerScript,
  cleanupVideoPlayerScripts,
} from "../utils/adsScript.js";

const LongTailKeywordPage = () => {
  const [keywordData, setKeywordData] = useState(null);
  const [hover, setHover] = useState(false);
  const [searchEngine, setSearchEngine] = useState("google");
  const [loading, setLoading] = useState(false);
  const [metaTags, setMetaTags] = useState({ title: "", description: "" }); // State for meta tags
  const [error, setError] = useState(null); // Add error state like in relatedKeyword.jsx
  const [country, setCountry] = useState("us"); // Add country state like in relatedKeyword.jsx

  // Fetch meta tags for the Long-Tail Keywords page
  useEffect(() => {
    const fetchMetaTags = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/meta/long-tail-keywords`
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
          title: "Long-Tail Keywords - Keyword Raja",
          description:
            "Explore long-tail keywords for targeted traffic with Keyword Raja's SEO solutions.",
        });
      }
    };

    // Add admin toggle settings fetch like in relatedKeyword.jsx
    const fetchAdminToggleSettings = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin-toggle-control`
        );
        if (!response.ok)
          throw new Error(
            `Failed to fetch admin toggle settings: ${response.statusText}`
          );
        const data = await response.json();
        localStorage.setItem("adminToggleSettings", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching admin toggle settings:", error.message);
      }
    };

    fetchMetaTags();
    fetchAdminToggleSettings();
  }, []);

  // Load video player script when keywordData changes
  useEffect(() => {
    if (keywordData) {
      setTimeout(() => loadVideoPlayerScript("p2P21nhppseX", true), 100);
    }

    return () => {
      cleanupVideoPlayerScripts();
    };
  }, [keywordData]);

  const handleMouseEnter = (e) => {
    e.currentTarget.style.boxShadow =
      "4px 4px 8px rgba(229, 89, 15, 0.5), -4px 4px 8px rgba(229, 89, 15, 0.5), 4px -4px 8px rgba(229, 89, 15, 0.5), -4px -4px 8px rgba(229, 89, 15, 0.5)";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.boxShadow = "none";
  };

  const handleSearch = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === "") {
      setError("Please enter a keyword to search");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/scraper/scrape?query=${encodeURIComponent(
          searchTerm
        )}&engine=${searchEngine}&country=${country}`
      );

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.keywords) {
        // Filter keywords to show only those with 3 or more words
        const filteredKeywords = data.keywords.filter(
          (keyword) => keyword.trim().split(/\s+/).length > 3
        );

        if (filteredKeywords.length > 0) {
          setKeywordData({
            keyword: searchTerm,
            relatedKeywords: filteredKeywords,
          });
        } else {
          setError("No long-tail keywords found. Try a different search term.");
        }
      } else {
        setError("No keywords found. Try a different search term.");
      }
    } catch (error) {
      console.error("Error fetching keyword data:", error);
      setError("Failed to fetch keywords. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
      </Helmet>

      <div className="flex justify-center w-full min-h-screen px-2 bg-gradient-to-b from-gray-50 to-white">
        <div
          className="w-full max-w-6xl rounded-xl mx-auto p-3 sm:p-6 md:p-8 bg-white shadow-sm border border-gray-100"
          style={{ fontFamily: "wantedsans" }}
        >
          {/* Header Section */}
          {/* <div className="w-full py-4 sm:py-6 md:py-8 bg-gradient-to-r from-[#E5590F]/10 to-[#12153D]/10 rounded-lg">
            <div className="container mx-auto px-2 sm:px-4">
              <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-4 md:space-y-6 text-center">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-[#12153D] transition-all duration-300">
                  Long-Tail{" "}
                  <span className="text-[#E5590F] hover:text-[#ff6a1e] transition-colors duration-300">
                    Keywords
                  </span>{" "}
                  Finder
                </h1>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed animate-slide-up px-2">
                  Discover easy-to-rank long-tail keywords with lower
                  competition and better chances to bring targeted traffic to
                  your site.
                </p>
              </div>
            </div>
          </div> */}
           <div className="w-full py-6 md:py-8 border-b border-gray-200">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center justify-center text-center">
               <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-[#12153D] transition-all duration-300">
                  Long-Tail{" "}
                  <span className="text-[#E5590F] hover:text-[#ff6a1e] transition-colors duration-300">
                    Keywords
                  </span>{" "}
                  Finder
                </h1>

                <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed animate-slide-up lg:py-2">
                   Discover easy-to-rank long-tail keywords with lower
                  competition and better chances to bring targeted traffic to
                  your site.
                </p>
              </div>
            </div>
          </div>
          

          {/* Search Section */}
          <div className="w-full mx-auto rounded-lg flex flex-col items-center">
            <div className="w-full max-w-3xl mx-auto">
              <div className="transition-all duration-300 p-1 sm:p-1 md:py-6 rounded-xl">
                {/* <div className="flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#E5590F]/10 flex items-center justify-center mr-2 sm:mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5 text-[#E5590F]"
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
                     <i className="fa-solid fa-key text-[#E5590F]"></i>
                  </div>
                  <h3 className="text-sm sm:text-md font-semibold text-[#12153D]">
                    Search for Long-Tail Keywords
                  </h3>
                </div> */}
                <SearchInput 
                onSearch={handleSearch} 
                 placeholder="Search Long-Tail keywords..."
                 icon={<i className="fa-solid fa-key text-[#E5590F]"></i>}
                
                />
              </div>

              {error && (
                <div className="mt-3 sm:mt-4 p-2 sm:p-3 md:p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs sm:text-sm md:text-base animate-fadeIn transition-all duration-300">
                  <p className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-2 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1"
                      ></path>
                    </svg>
                    {error}
                  </p>
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="w-full mt-4 sm:mt-6 md:mt-8 lg:mt-10">
              {loading ? (
                <div className="flex flex-col justify-center items-center h-48 sm:h-64 md:h-80 w-fit mx-auto p-4 transition-all duration-300 adc-loading-container">
                  <Loader />
                  <p className="mt-3 sm:mt-4 md:mt-5 lg:mt-6 text-xs sm:text-sm md:text-base text-gray-600 animate-pulse">
                    Searching for long-tail keywords...
                  </p>
                </div>
              ) : (
                <div className="w-full max-w-3xl mx-auto">
                  {keywordData && (
                    <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10 animate-fadeIn transition-all duration-500">
                      {/* Results Header */}
                      <div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8 bg-gradient-to-r from-[#12153D] to-[#1c2260] p-3 sm:p-4 md:p-6 rounded-xl border-l-4 border-[#E5590F] shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]">
                        <div className="flex items-center">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#E5590F] flex items-center justify-center mr-3 sm:mr-4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 sm:h-5 sm:w-5 text-white"
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
                          <div>
                            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">
                              Results for:{" "}
                              <span className="text-[#E5590F]">
                                {keywordData.keyword}
                              </span>
                            </h2>
                            <p className="text-xs sm:text-sm md:text-base text-gray-300 mt-1 sm:mt-2 md:mt-3">
                              Found {keywordData.relatedKeywords.length}{" "}
                              long-tail keywords
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Content Grid */}
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                        {/* Left Column */}
                        <div className="flex flex-col space-y-4 sm:space-y-5 md:space-y-6">
                          <div className="w-full bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 transition-all duration-300 hover:shadow-xl border border-gray-200 transform hover:scale-[1.01]">
                            <div className="flex items-center mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-[#12153D] flex items-center justify-center mr-2 sm:mr-3">
                                {/* <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                                  />
                                </svg> */}
                                <i className="fa-solid fa-up-right-from-square text-white"></i>
                              </div>
                              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-[#12153D]">
                                Long-Tail Keywords
                              </h3>
                            </div>
                            <KeywordContainer
                              maxHeight="calc(50vh + 150px)"
                              Width={100}
                              className="min-h-[250px] sm:min-h-[300px] md:min-h-[350px] lg:min-h-[450px] w-full mx-auto bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300"
                              keywordData={keywordData}
                            />
                          </div>
                        </div>

                        {/* Right Column */}
                        <div>
                          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
                            {/* <div
                              onClick={() => setHover(!hover)}
                              onMouseEnter={handleMouseEnter}
                              onMouseLeave={handleMouseLeave}
                              className="cursor-pointer w-full aspect-[4/3] shadow-md hover:shadow-xl transition-all duration-500 rounded-2xl overflow-hidden transform hover:scale-[1.02] group relative"
                            >
                              <div
                                className={`absolute inset-0 bg-gradient-to-br from-[#12153D]/80 to-[#12153D] z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                                  hover ? "opacity-100" : ""
                                }`}
                              ></div>
                              <div className="h-full w-full flex items-center justify-center bg-[#12153d] rounded-2xl p-3 sm:p-4 transition-all duration-300 relative">
                                <div
                                  className={`absolute inset-0 flex flex-col justify-center p-3 sm:p-4 md:p-6 lg:p-8 text-white text-left z-20 transition-all duration-500 ${
                                    hover
                                      ? "opacity-100 transform translate-y-0"
                                      : "opacity-0 transform translate-y-4"
                                  }`}
                                >
                                  <h1
                                    className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4 transition-all duration-500"
                                    style={{
                                      fontFamily: "Space Grotesk, sans-serif",
                                    }}
                                  >
                                    What is it?
                                  </h1>
                                  <p className="text-xs sm:text-sm md:text-base text-gray-200 transition-all duration-500">
                                    <span className="text-orange-500 font-medium inline-block hover:text-orange-400 transition-colors duration-300">
                                      Long-Tail Keywords
                                    </span>{" "}
                                    are specific, longer search phrases that users type when they're closer to making a purchase or when they're looking for precise information.
                                  </p>
                                </div>
                              </div>
                            </div> */}
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
                                     Long-Tail Keywords
                                    </span>{" "}
                                    are specific, longer search phrases that users type when they're closer to making a purchase or when they're looking for precise information.
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
                          </div>

                          {/* Ad Containers */}
                          <div className="w-full sm:w-[300px] h-[150px] sm:h-[250px] mt-3 sm:mt-4 flex items-center justify-center text-center">
                            <div className="text-gray-700">ad 300X250 </div>
                          </div>
                          <div className="w-full sm:w-[300px] h-[150px] sm:h-[250px] mt-3 sm:mt-4 flex items-center justify-center text-center">
                            <div
                              id="p2P21nhppseX"
                              className="text-gray-700"
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Ad Banner */}
                      <div
                      id="ltk-ad-3"
                      className="  mt-6 sm:mt-8 lg:mt-10 p-4 lg:p-6 rounded-xl text-center w-full max-w-[728px] mx-auto flex items-center justify-center   aspect-[8/1]  ltk-ad-container"
                    >
                      ads
                    </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LongTailKeywordPage;
