import React, { useState, useEffect } from "react"; // Added useEffect
import { Helmet } from "react-helmet"; // Import Helmet
import BannerAds from "../Components/ui/Ads/BannerAds.jsx";
import SearchInput from "../Components/ui/KeywordInput/SearchInput.jsx";
import KeywordContainer from "../Components/ui/LongTailKeyword/KeywordContainer.jsx";
import Loader from "../Components/Loading/Loader.jsx";
// Import the mediaQueries.css file
import "../../public/style/mediaQueries.css";
// Import the video player script utility
import { loadVideoPlayerScript, cleanupVideoPlayerScripts } from "../utils/adsScript.js";

const LongTailKeywordPage = () => {
  const [keywordData, setKeywordData] = useState(null);
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

      <div className="flex justify-center w-full bg-gray-50 min-h-screen py-4 px-2 sm:py-6 sm:px-4 md:py-8 md:px-6">
        <div
          className="w-full max-w-4xl bg-gray-50 rounded-xl mx-auto p-3 sm:p-6 md:p-8 shadow-sm"
          style={{ fontFamily: "wantedsans" }}
        >
          <div className="w-full py-3 sm:py-6 md:py-8">
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-center text-[#12153D] mb-2 sm:mb-4 animate-slideDown transition-all duration-300">
                Long-Tail{" "}
                <span className="text-[#E5590F] hover:text-[#ff6a1e] transition-colors duration-300">
                  Keywords
                </span>{" "}
                Finder
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8 animate-slideUp transition-all duration-300">
                Discover easy-to-rank long-tail keywords with lower competition
                and better chances to bring targeted traffic to your site.
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
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1"
                      ></path>
                    </svg>
                    {error}
                  </p>
                </div>
              )}
            </div>

            <div className="w-full mt-6 sm:mt-10">
              {loading ? (
                <div className="flex flex-col justify-center items-center h-48 sm:h-80 w-full bg-white rounded-xl shadow-sm p-6 animate-pulse">
                  <Loader />
                  <p className="mt-3 sm:mt-4 text-xs sm:text-base text-gray-600 animate-pulse">
                    Searching for long-tail keywords...
                  </p>
                </div>
              ) : (
                keywordData && (
                  <>
                    <div className="mb-4 sm:mb-8 px-2 sm:px-4 bg-white p-3 sm:p-4 rounded-xl border-l-4 border-[#E5590F] shadow-sm transition-all duration-300 hover:shadow-md">
                      <h2 className="text-lg sm:text-2xl font-bold text-[#12153D]">
                        Results for:{" "}
                        <span className="text-[#E5590F]">
                          {keywordData.keyword}
                        </span>
                      </h2>
                      <p className="text-xs sm:text-base text-gray-600 mt-1">
                        Found {keywordData.relatedKeywords.length} long-tail
                        keywords
                      </p>
                    </div>

                    <div className="flex flex-col lg:flex-row w-full gap-4 sm:gap-8">
                      <div className="flex flex-col space-y-4 sm:space-y-6 lg:w-3/5">
                        <div className="w-full bg-white rounded-xl shadow-md p-3 sm:p-6 transition-all duration-300 hover:shadow-lg border border-gray-200">
                          <h3 className="text-base sm:text-lg font-semibold text-[#12153D] mb-3 sm:mb-4">
                            Long-Tail Keywords
                          </h3>
                          <KeywordContainer
                            maxHeight="560px"
                            Width={100}
                            className="min-h-[300px] sm:min-h-[350px] lg:min-h-[450px] w-full mx-auto bg-white rounded-lg shadow-sm border border-gray-100 transition-all duration-300"
                            keywordData={keywordData}
                          />
                        </div>
                      </div>

                      <div className="w-full lg:w-2/5 flex flex-col items-center lg:items-start space-y-4 sm:space-y-6">
                        <div className="w-full max-w-full sm:max-w-[335px] shadow-lg hover:shadow-xl transition-all duration-500 rounded-2xl overflow-hidden group">
                          <div className="relative h-full w-full bg-gradient-to-br from-[#12153D] to-[#1a1f4d] rounded-2xl text-white text-left transition-all duration-500 p-4 sm:p-8 flex flex-col justify-center overflow-hidden">
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E5590F]/10 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#E5590F]/5 rounded-full -ml-12 -mb-12 transition-transform duration-700 group-hover:scale-150"></div>
                            
                            <h1 className="text-xl sm:text-3xl font-semibold mb-2 sm:mb-4 transition-all duration-500 group-hover:translate-y-[-8px] relative z-10">
                              What is it?
                            </h1>
                            <p className="text-xs sm:text-base text-justify transition-all duration-500 group-hover:translate-y-[-5px] relative z-10">
                              <span className="text-orange-400 font-medium group-hover:text-orange-300 transition-colors duration-300 border-b border-orange-400/30 pb-0.5">
                                Long-Tail Keywords
                              </span>{" "}
                              are specific, longer search phrases that users
                              type when they're closer to making a purchase or
                              when they're looking for precise information.
                            </p>
                            
                            {/* Learn more button that appears on hover */}
                            <div className="mt-4 overflow-hidden h-0 group-hover:h-8 transition-all duration-500 delay-100 opacity-0 group-hover:opacity-100 relative z-10">
                              <button className="px-4 py-1.5 bg-[#E5590F] text-white rounded-full text-xs sm:text-sm font-medium hover:bg-[#ff6a1e] transition-colors duration-300 flex items-center">
                                Learn more
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className=" w-full sm:w-[336px] h-[200px] sm:h-[280px] flex justify-center items-center relative">
                          <div className="bg-white w-[90%] sm:max-w-[300px] h-[180px] sm:h-[250px] rounded-xl shadow-sm flex justify-center items-center border border-gray-200">
                            <h1 className="text-sm sm:text-lg lg:text-2xl font-bold text-gray-400">
                              AD
                            </h1>
                          </div>
                        </div>
                        <div  className="w-[300px] h-[250px] mt-4 flex items-center justify-center text-center">
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

export default LongTailKeywordPage;
