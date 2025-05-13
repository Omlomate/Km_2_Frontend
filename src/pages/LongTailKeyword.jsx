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

      <div className="flex justify-center w-full min-h-screen px-2 sm:py-1 sm:px-1 bg-gradient-to-b from-gray-50 to-white">
        <div
          className="w-full max-w-4xl rounded-xl mx-auto p-3 sm:p-6 md:p-8 bg-white shadow-lg border border-gray-100"
          style={{ fontFamily: "wantedsans" }}
        >
          {/* <div className="w-full py-3 sm:py-6 md:py-8">
            <div className="space-y-2 sm:space-y-3 md:space-y-4 text-center">
              <div className="relative inline-block mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#E5590F]/20 to-[#12153D]/20 rounded-lg blur-md"></div>
                <h1 className="relative text-2xl sm:text-3xl md:text-5xl font-bold text-center text-[#12153D] mb-2 sm:mb-4 animate-slideDown transition-all duration-300">
                  Long-Tail{" "}
                  <span className="text-[#E5590F] hover:text-[#ff6a1e] transition-colors duration-300">
                    Keywords
                  </span>{" "}
                  Finder
                </h1>
              </div>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8 animate-slideUp transition-all duration-300">
                Discover easy-to-rank long-tail keywords with lower competition
                and better chances to bring targeted traffic to your site.
              </p>
            </div>
          </div> */}
          <div className="w-full py-4 sm:py-6 md:py-8 bg-gradient-to-r from-[#E5590F]/10 to-[#12153D]/10 rounded-lg">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 md:space-y-8 text-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#12153D] transition-all duration-300">
                Long-Tail{" "}
                  <span className="text-[#E5590F] hover:text-[#ff6a1e] transition-colors duration-300">
                  Keywords
                  </span>
                  Finder
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed animate-slide-up">
                Discover easy-to-rank long-tail keywords with lower competition
                and better chances to bring targeted traffic to your site.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full mx-auto rounded-lg flex flex-col items-center">
            <div className="w-full max-w-3xl mx-auto">
              <div className="transition-all duration-300 p-4 sm:p-6 rounded-xl bg-white border border-gray-200 shadow-md hover:shadow-xl transform hover:scale-[1.01]">
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
                    Search for Long-Tail Keywords
                  </h3>
                </div>
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
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1"
                      ></path>
                    </svg>
                    {error}
                  </p>
                </div>
              )}
            </div>

            <div className="w-full mt-6 sm:mt-8 md:mt-10">
              {loading ? (
                <div className="flex flex-col justify-center items-center h-48 sm:h-64 md:h-80 w-full bg-white rounded-xl shadow-md border border-gray-200 p-4 transition-all duration-300">
                  <Loader />
                  <p className="mt-4 sm:mt-5 md:mt-6 text-sm sm:text-base text-gray-600 animate-pulse">
                    Searching for long-tail keywords...
                  </p>
                </div>
              ) : (
                <div className="w-full max-w-6xl mx-auto">
                  {keywordData && (
                    <div className="space-y-6 sm:space-y-8 md:space-y-10 animate-fadeIn transition-all duration-500">
                      <div className="mb-4 sm:mb-6 lg:mb-8 bg-gradient-to-r from-[#12153D] to-[#1c2260] p-6 rounded-xl border-l-4 border-[#E5590F] shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]">
                        <div className="flex items-center">
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
                          <div>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                              Results for:{" "}
                              <span className="text-[#E5590F]">
                                {keywordData.keyword}
                              </span>
                            </h2>
                            <p className="text-sm sm:text-base text-gray-300 mt-2 sm:mt-3">
                              Found {keywordData.relatedKeywords.length}{" "}
                              long-tail keywords
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
                        <div className="flex flex-col space-y-5 sm:space-y-6">
                          <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:shadow-xl border border-gray-200 transform hover:scale-[1.01]">
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
                                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                                  />
                                </svg>
                              </div>
                              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#12153D]">
                                Long-Tail Keywords
                              </h3>
                            </div>
                            <KeywordContainer
                              maxHeight="560px"
                              Width={100}
                              className="min-h-[300px] sm:min-h-[350px] lg:min-h-[450px] w-full mx-auto bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300"
                              keywordData={keywordData}
                            />
                          </div>
                        </div>
                        <div>
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
                                <div className="absolute inset-0 flex flex-col justify-center p-4 sm:p-6 lg:p-8 text-white text-left z-20">
                                  <h1
                                    className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 lg:mb-4"
                                    style={{
                                      fontFamily: "Space Grotesk, sans-serif",
                                    }}
                                  >
                                    What is it?
                                  </h1>
                                  <p className="text-sm sm:text-base text-gray-200">
                                    <span className="text-orange-500 font-medium inline-block hover:text-orange-400 transition-colors duration-300">
                                      Long-Tail Keywords
                                    </span>{" "}
                                    are specific, longer search phrases that
                                    users type when they're closer to making a
                                    purchase or when they're looking for precise
                                    information.
                                  </p>
                                  <div className="mt-4">
                                    <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs rounded-full hover:bg-orange-400 transition-colors duration-300 cursor-pointer">
                                      Learn more
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="w-[300px] h-[250px] mt-4 flex items-center justify-center text-center ">
                            <div className="text-gray-700">ad 300X250 </div>
                          </div>
                          <div className="w-[300px] h-[250px] mt-4 flex items-center justify-center text-center ">
                            <div
                              id="p2P21nhppseX"
                              className="text-gray-700"
                            ></div>
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

export default LongTailKeywordPage;
