import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import BannerAds from "../Components/ui/Ads/BannerAds.jsx";
import SearchInput from "../Components/ui/KeywordInput/SearchInput.jsx";
import KeywordContainer from "../Components/ui/LongTailKeyword/KeywordContainer.jsx";
import SVG1 from "../assets/releatedKI.svg";
import Loader from "../Components/Loading/Loader.jsx";
// import "../../public/style/style.css";
import "../pages/style/mediaQueries.css";

export const KeywordResearch = () => {
  const [keywordData, setKeywordData] = useState(null);
  const [hover, setHover] = useState(false);
  const [searchEngine, setSearchEngine] = useState("google");
  const [country, setCountry] = useState("us");
  const [searchLoading, setSearchLoading] = useState(false);
  const [metaTags, setMetaTags] = useState({ title: "", description: "" });
  const [error, setError] = useState(null);

  // Fetch meta tags and admin toggle control settings
  useEffect(() => {
    const fetchMetaTags = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/meta/related-keywords`
        );
        const data = await response.json();
        setMetaTags({
          title: data.title,
          description: data.description,
        });
      } catch (error) {
        console.error("Error fetching meta tags:", error);
        setMetaTags({
          title: "Related Keywords - Keyword Raja",
          description:
            "Find related keywords to enhance your SEO strategy with Keyword Raja's powerful tools.",
        });
      }
    };

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
    setSearchLoading(true);

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

      if (data && data.keywords && data.keywords.length > 0) {
        setKeywordData({ keyword: searchTerm, relatedKeywords: data.keywords });
      } else {
        setError("No keywords found. Try a different search term.");
      }
    } catch (error) {
      console.error("Error fetching keyword data:", error);
      setError("Failed to fetch keywords. Please try again later.");
    } finally {
      setSearchLoading(false);
    }
  };

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

  return (
    <>
      <Helmet>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
      </Helmet>

      <div className="flex justify-center w-full bg-gray-50 min-h-screen py-4 px-2 sm:py-6 sm:px-4 md:py-8 md:px-6">
        <div
          className="w-full max-w-4xl bg-gray-50 rounded-xl mx-auto p-3 sm:p-6 md:p-8 shadow-sm"
          style={{ fontFamily: "wantedsans" }}
        >
          <div className="w-full py-3 sm:py-6 md:py-8">
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-center text-[#12153D] mb-2 sm:mb-4 animate-slideDown transition-all duration-300">
                Related Keywords{" "}
                <span className="text-[#E5590F] hover:text-[#ff6a1e] transition-colors duration-300">
                  Finder
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8 animate-slideUp transition-all duration-300">
                Find keyword ideas closely connected to your topic to help
                expand your content and reach more relevant search traffic.
              </p>
            </div>
          </div>

          <div className="w-full mx-auto rounded-lg flex flex-col items-center">
            <div className="w-full max-w-3xl mx-auto">
              <div className="transition-all duration-300 p-4 sm:p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md">
                <SearchInput onSearch={handleSearch} />
              </div>

              {error && (
                <div className="mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm sm:text-base animate-fadeIn transition-all duration-300">
                  <p className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1- Dot-1"
                      ></path>
                    </svg>
                    {error}
                  </p>
                </div>
              )}
            </div>

            <div className="w-full mt-6 sm:mt-8 md:mt-10">
              {searchLoading ? (
                <div className="flex flex-col justify-center items-center h-48 sm:h-64 md:h-80 w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition-all duration-300">
                  <Loader />
                  <p className="mt-4 sm:mt-5 md:mt-6 text-sm sm:text-base text-gray-600 animate-pulse">
                    Searching for related keywords...
                  </p>
                </div>
              ) : (
                <div className="w-full max-w-6xl mx-auto">
                  {keywordData && (
                    <div className="space-y-6 sm:space-y-8 md:space-y-10 animate-fadeIn transition-all duration-500">
                      <div className="mb-4 sm:mb-6 lg:mb-8 px-4 sm:px-5 lg:px-6 bg-[#E5590f]/5 p-4 sm:p-5 lg:p-6 rounded-xl border-l-4 border-[#E5590F] shadow-sm hover:shadow-md transition-all duration-300">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#12153D]">
                          Results for: {" "}
                          <span className="text-[#E5590F]">
                            {keywordData.keyword}
                          </span>
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mt-2 sm:mt-3">
                          Found {keywordData.relatedKeywords.length} related
                          keywords
                        </p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
                        <div className="flex flex-col space-y-5 sm:space-y-6">
                          <div className="w-full bg-white rounded-xl shadow-md p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:shadow-lg border border-gray-200">
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#12153D] mb-4 lg:mb-6">
                              Related Keywords
                            </h3>
                            <KeywordContainer
                              maxHeight="560px"
                              Width={100}
                              className="min-h-[300px] sm:min-h-[350px] lg:min-h-[450px] w-full mx-auto bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300"
                              keywordData={keywordData}
                            />
                          </div>
                        </div>
                        <div>
                          {" "}
                          <div className="flex flex-col gap-5 sm:gap-6">
                            <div
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
                              <div className="h-full w-full flex items-center justify-center bg-[#12153d] rounded-2xl p-4 transition-all duration-300 relative">
                                <img
                                  src={SVG1}
                                  alt="Related Keywords Illustration"
                                  className={`h-full w-full object-contain transition-all duration-500 ${
                                    hover
                                      ? "scale-90 opacity-30"
                                      : "hover:scale-105"
                                  }`}
                                />

                                <div
                                  className={`absolute inset-0 flex flex-col justify-center p-4 sm:p-6 lg:p-8 text-white text-left z-20 transition-all duration-500 ${
                                    hover
                                      ? "opacity-100 transform translate-y-0"
                                      : "opacity-0 transform translate-y-4"
                                  }`}
                                >
                                  <h1
                                    className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 lg:mb-4 transition-all duration-500"
                                    style={{
                                      fontFamily: "Space Grotesk, sans-serif",
                                    }}
                                  >
                                    What is it?
                                  </h1>
                                  <p className="text-sm sm:text-base text-gray-200 transition-all duration-500">
                                    <span className="text-orange-500 font-medium inline-block hover:text-orange-400 transition-colors duration-300">
                                      Related Words
                                    </span>{" "}
                                    are identifying search terms that people use
                                    in search engines. The goal is to use this
                                    information to improve your marketing.
                                  </p>
                                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                                    <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs rounded-full hover:bg-orange-400 transition-colors duration-300 cursor-pointer">
                                      Learn more
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                           
                            className="w-[300px] h-[250px] mt-4 flex items-center justify-center text-center"
                          >
                            <div className="text-gray-700">ad 300X250 </div>
                          </div>
                          <div
                           
                            className="w-[300px] h-[250px] mt-4 flex items-center justify-center text-center"
                          >
                            <div  id="p2P21nhppseX" className="text-gray-700"></div>
                          </div>
                        </div>
                      </div>

                      <div
                        id="rk-ad-3"
                        className="bg-gradient-to-r from-[#12153d] to-[#1c2260] text-white mt-6 sm:mt-8 lg:mt-10 p-4 lg:p-6 rounded-xl text-center w-full max-w-[728px] mx-auto flex items-center justify-center shadow-md aspect-[8/1] hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]"
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

export default KeywordResearch;
