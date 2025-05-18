import React, { useState, useEffect } from "react"; // Added useEffect
import { Helmet } from "react-helmet"; // Import Helmet
import BannerAds from "../Components/ui/Ads/BannerAds";
import SearchInput from "../Components/ui/KeywordInput/SearchInput";
import useKeywordData from "../hooks/useKeywordData";
import Difficultycircle from "../Components/ui/Graphs/Difficultycircle";
import Loader from "../Components/Loading/Loader";
// Import the mediaQueries.css file
import "../pages/style/mediaQueries.css";

const KeywordDifficulty = () => {
  const [keywordData, setKeywordData] = useState(null);

  const { data: data3, loading } = useKeywordData();
  const [loadingState, setLoading] = useState(false);
  const [metaTags, setMetaTags] = useState({ title: "", description: "" }); // State for meta tags

  // Fetch meta tags for the Keyword Difficulty page
  useEffect(() => {
    const fetchMetaTags = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/meta/keyword-difficulty`
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
          title: "Keyword Difficulty - Keyword Raja",
          description:
            "Check keyword difficulty with Keyword Raja to target winnable SEO opportunities.",
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
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/gemini/get-keyword-difficulty`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ keyword: searchTerm }),
        }
      );

      const apiResult = await response.json();
      console.log("API Response:", apiResult);

      if (response.ok) {
        setKeywordData(apiResult.analysisResult);
      } else {
        console.error("Error fetching keyword difficulty:", apiResult);
      }
    } catch (error) {
      console.error("API request failed:", error);
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

      <div className="flex justify-center w-full min-h-screen px-2 sm:py-1 sm:px-1 bg-gradient-to-b from-gray-50 to-white kd-container">
        <div
          className="w-full max-w-4xl rounded-xl mx-auto p-3 sm:p-6 md:p-8 bg-white shadow-sm border border-gray-100 kd-main-container"
          style={{ fontFamily: "wantedsans" }}
        >
          {/* <div className="w-full py-3 sm:py-6 md:py-8">
            <div className="space-y-2 sm:space-y-3 md:space-y-4 text-center">
              <div className="relative inline-block mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#E5590F]/20 to-[#12153D]/20 rounded-lg blur-md"></div>
                <h1 className="relative text-2xl sm:text-3xl md:text-5xl font-bold text-center text-[#12153D] mb-2 sm:mb-4 animate-slideDown kd-title">
                  Keyword{" "}
                  <span className="text-[#E5590F] hover:text-[#ff6a1e] transition-colors duration-300">
                    Difficulty
                  </span>{" "}
                  Checker
                </h1>
              </div>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8 animate-slideUp kd-description">
                See how hard it is to rank for a keyword so you can focus on
                easier wins with less competition and more ranking chances.
              </p>
            </div>
          </div> */}
          <div className="w-full py-6 md:py-8 border-b border-gray-200">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center justify-center text-center">
                 <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#12153D] transition-all duration-300">
                  Keyword{" "}
                  <span className="text-[#E5590F] hover:text-[#ff6a1e] transition-colors duration-300">
                    Difficulty
                  </span>{" "}
                  Checker
                </h1>

                <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed animate-slide-up lg:py-2">
                  See how hard it is to rank for a keyword so you can focus on
                  easier wins with less competition and more ranking chances.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full mx-auto rounded-lg flex flex-col items-center">
            <div className="w-full max-w-3xl mx-auto  ">
              <div className="transition-all duration-300 p-1 sm:p-3 md:p-6 rounded-xl  kd-search-box">
                <div className="flex items-center  ">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#E5590F]/10 flex items-center justify-center mr-2 sm:mr-3">
                    {/* <svg
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
                    </svg> */}
                       <i className="fa-solid fa-chart-bar text-[#E5590F]"></i>
                  </div>
                  <h3 className="text-sm font-semibold text-[#12153D]">
                    Check Keyword Difficulty
                  </h3>
                </div>
                <SearchInput
                 placeholder="Search keywords Difficulty..."
                onSearch={handleSearch} />
              </div>
            </div>

            <div className="w-full mt-6 sm:mt-8 md:mt-10">
              {loadingState ? (
                <div className="flex flex-col justify-center items-center h-48 sm:h-64 md:h-80 w-fit mx-auto p-4 transition-all duration-300 adc-loading-container">
                  <Loader />
                  <p className="mt-4 sm:mt-5 md:mt-6 text-sm sm:text-base text-gray-600 animate-pulse">
                    Checking keyword difficulty...
                  </p>
                </div>
              ) : keywordData ? (
                <div className="w-full max-w-3xl mx-auto">
                  <div className="space-y-6 sm:space-y-8 md:space-y-10 animate-fadeIn transition-all duration-500">
                    <style>
                      {`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;700&display=swap');`}
                    </style>
                    <div
                      className="mb-4 sm:mb-6 lg:mb-8 bg-gradient-to-br from-[#12153D]/90 to-[#1c2260] p-6 rounded-2xl border-l-4 border-[#E5590F] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-sm relative overflow-hidden group"
                      role="banner"
                    >
                      {/* Decorative elements */}
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#E5590F]/10 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#E5590F]/5 rounded-full blur-lg opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>

                      <div className="flex items-center gap-4 relative z-10">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#E5590F] to-[#ff7a3d] flex items-center justify-center mr-4 shadow-md animate-pulse-slow">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 sm:h-6 sm:w-6 text-white"
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
                        <div className="">
                          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200 tracking-tight kd-results-title drop-shadow-sm">
                            Results for:{" "}
                              <span className="text-[#E5590F]">
                              {keywordData?.keyword || "Keyword"}
                              {/* <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E5590F] group-hover:w-full transition-all duration-500"></span> */}
                            </span>
                          </h2>
                          <p className="text-sm sm:text-base text-gray-200 mt-2 sm:mt-3 kd-results-subtitle font-medium tracking-wide max-w-xl">
                            Keyword difficulty analysis and competition insights
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 kd-results-grid">
                      <div className="flex flex-col space-y-5 sm:space-y-6 kd-left-column">
                        <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:shadow-xl border border-gray-200 transform hover:scale-[1.01] kd-difficulty-card">
                          <div className="flex items-center mb-4 lg:mb-6">
                            <div className="w-8 h-8 rounded-full bg-[#12153D] flex items-center justify-center mr-3">
                              {/* <svg
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
                                  d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                                />
                              </svg> */}
                              <i className="fa-solid fa-chart-bar text-white"></i>
                            </div>
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#12153D] kd-difficulty-title">
                              Keyword Difficulty
                            </h3>
                          </div>
                          <div className="flex flex-col items-center space-y-4 kd-difficulty-content">
                            <p className="text-3xl sm:text-5xl font-bold text-orange-500 kd-difficulty-number">
                              {/* {keywordData.keyword_difficulty}% */}
                            </p>
                            <Difficultycircle  
                              percentage={keywordData.keyword_difficulty}
                            />
                          </div>
                        </div>
                        <div
                          className="w-full bg-gradient-to-br from-[#12153D] to-[#1c2260] rounded-xl shadow-lg p-4 sm:p-8 text-white text-center lg:text-left border-l-4 border-[#E5590F] transition-all duration-300 hover:shadow-xl transform hover:scale-[1.01] kd-description-card"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow =
                              "4px 4px 8px rgba(229, 89, 15, 0.5), -4px 4px 8px rgba(229, 89, 15, 0.5), 4px -4px 8px rgba(229, 89, 15, 0.5), -4px -4px 8px rgba(229, 89, 15, 0.5)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <div className="flex items-center mb-3 sm:mb-4">
                            <div className="w-8 h-8 rounded-full bg-[#E5590F] flex items-center justify-center mr-3 shadow-md">
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
                            <h1 className="text-lg sm:text-xl font-semibold kd-description-title">
                              Difficulty Description
                            </h1>
                          </div>
                          <div className="pl-11">
                            <p className="text-sm sm:text-base leading-relaxed text-white font-medium tracking-wide animate-fadeIn kd-description-content">
                              {keywordData.difficulty_description}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-5 sm:gap-6 kd-right-column">
                        <div  >
                          {/* <div className="absolute inset-0 bg-gradient-to-br from-[#12153D]/80 to-[#12153D] z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="h-full w-full flex items-center justify-center bg-[#12153D] rounded-2xl p-4 transition-all duration-300 relative">
                            <div className="h-full w-full flex flex-col justify-center p-4 sm:p-6 lg:p-8 text-white text-left relative z-10">
                              <div className="absolute top-0 right-0 w-24 h-24 bg-[#E5590F]/10 rounded-full -mr-12 -mt-12 z-0"></div>
                              <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#E5590F]/10 rounded-full -ml-8 -mb-8 z-0"></div>

                              <div className="flex items-center mb-4 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-[#E5590F] flex items-center justify-center mr-3 shadow-md">
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
                                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                </div>
                                <h1
                                  className="text-xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 kd-what-title"
                                  style={{
                                    fontFamily: "Space Grotesk, sans-serif",
                                  }}
                                >
                                  What is it?
                                </h1>
                              </div>

                              <div className="pl-13 border-l-2 border-[#E5590F]/30 ml-5 relative z-10">
                                <p className="text-sm sm:text-base text-white leading-relaxed tracking-wide kd-what-content">
                                  <span className="text-[#E5590F] font-semibold text-base sm:text-lg inline-block mb-1 hover:text-orange-400 transition-colors duration-300">
                                    Keyword Difficulty
                                  </span>{" "}
                                  estimates how difficult it is to rank for a
                                  keyword. The higher the keyword difficulty,
                                  the larger the competition.
                                </p>
                              </div>

                              <div className="mt-4 sm:mt-6 flex justify-end relative z-10">
                                <span className="text-xs text-gray-400 italic animate-pulse">
                                  Click to learn more
                                </span>
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
                                  <p className="text-sm sm:text-base text-white leading-relaxed tracking-wide kd-what-content">
                                  <span className="text-[#E5590F] font-semibold text-base sm:text-lg inline-block mb-1 hover:text-orange-400 transition-colors duration-300">
                                    Keyword Difficulty
                                  </span>{" "}
                                  estimates how difficult it is to rank for a
                                  keyword. The higher the keyword difficulty,
                                  the larger the competition.
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
                        <div
                          id="kd-ad-1"
                          className="w-full sm:w-[300px] h-[180px] sm:h-[250px] mt-4 flex items-center justify-center text-center kd-ad-small"
                        >
                          <div className="text-gray-700">AD</div>
                        </div>
                        <div className="w-full sm:w-[300px] relative bg-gray-100 rounded-xl overflow-hidden border border-gray-200 mt-4 kd-video-container">
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
                      id="kd-ad-3"
                      className="  mt-6 sm:mt-8 lg:mt-10 p-4 lg:p-6 rounded-xl text-center w-full max-w-[728px] mx-auto flex items-center justify-center shadow-md aspect-[8/1]   kd-ad-container"
                    >
                      ads
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 mt-4">
                  {/* No data available. Try searching for a keyword. */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default KeywordDifficulty;
