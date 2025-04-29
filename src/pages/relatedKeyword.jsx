import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import BannerAds from "../Components/ui/Ads/BannerAds.jsx";
import SearchInput from "../Components/ui/KeywordInput/SearchInput.jsx";
import KeywordContainer from "../Components/ui/LongTailKeyword/KeywordContainer.jsx";
import SVG1 from "../assets/releatedKI.svg";
import Loader from "../Components/Loading/Loader.jsx";

export const KeywordResearch = () => {
  const [keywordData, setKeywordData] = useState(null);
  const [hover, setHover] = useState(false);
  const [searchEngine, setSearchEngine] = useState("google");
  const [country, setCountry] = useState("us");
  const [searchLoading, setSearchLoading] = useState(false);
  const [metaTags, setMetaTags] = useState({ title: "", description: "" });
  const [error, setError] = useState(null);

  // Fetch meta tags for the Related Keywords page
  useEffect(() => {
    const fetchMetaTags = async () => {
      try {
        const response = await fetch(
          "https://www.keywordraja.com/api/meta/related-keywords"
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
    fetchMetaTags();
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
        `https://www.keywordraja.com/api/scraper/scrape?query=${encodeURIComponent(
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
    // Function to load the video player
    const loadVideoPlayer = () => {
      // Remove any existing scripts first to avoid conflicts
      const existingScripts = document.querySelectorAll('script[src*="kolorowey.com"], script[data-playerPro]');
      existingScripts.forEach(script => script.remove());
      
      // Add the main video script
      const videoScript = document.createElement('script');
      videoScript.src = 'https://stream.kolorowey.com/player/video.js';
      videoScript.async = true;
      
      // When the first script loads, add the player initialization script
      videoScript.onload = () => {
        // Initialize the player
        const playerScript = document.createElement('script');
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
    
    // Load the video player when component mounts or after search results
    if (keywordData) {
      // Small timeout to ensure DOM is ready
      setTimeout(loadVideoPlayer, 100);
    }
    
    // Cleanup function
    return () => {
      const scripts = document.querySelectorAll('script[src*="kolorowey.com"], script[data-playerPro]');
      scripts.forEach(script => script.remove());
    };
  }, [keywordData]);

  return (
    <>
      <Helmet>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
      </Helmet>

      <div className="flex justify-center w-full bg-gray-50 min-h-screen py-4 px-2 sm:py-6 sm:px-4">
        <div
          className="w-full max-w-6xl bg-gray-50  rounded-xl mx-auto p-3 sm:p-8"
          style={{ fontFamily: "wantedsans" }}
        >
          <div className="w-full py-3 sm:py-6">
            <div className="animate-fadeIn">
              <h1 className="text-xl sm:text-3xl md:text-5xl font-bold text-center text-[#12153D] mb-2 sm:mb-4 animate-slideDown">
                Related Keywords <span className="text-[#E5590F]">Finder</span>
              </h1>
              <p className="text-xs sm:text-base md:text-lg text-gray-600 text-center max-w-2xl mx-auto mb-4 sm:mb-8 animate-slideUp">
                Find keyword ideas closely connected to your topic to help expand your 
                content and reach more relevant search traffic.
              </p>
            </div>
          </div>

          <div className="w-full mx-auto rounded-lg flex flex-col items-center">
            <div className="w-full max-w-3xl mx-auto">
              <div className="transition-all duration-300 p-3 sm:p-6 rounded-xl bg-gray-50  border border-gray-100">
                <SearchInput onSearch={handleSearch} />
              </div>

              {error && (
                <div className="mt-3 p-2 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs sm:text-base">
                  <p className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </p>
                </div>
              )}
            </div>

            <div className="w-full mt-6 sm:mt-10">
              {searchLoading ? (
                <div className="flex flex-col justify-center items-center h-48 sm:h-80 w-full">
                  <Loader />
                  <p className="mt-3 sm:mt-4 text-xs sm:text-base text-gray-600">
                    Searching for related keywords...
                  </p>
                </div>
              ) : (
                <div className="w-full">
                  {keywordData && (
                    <>
                      <div className="mb-4 sm:mb-8 px-2 sm:px-4 bg-gray-50 p-3 sm:p-4 rounded-xl border-l-4 border-[#E5590F]">
                        <h2 className="text-lg sm:text-2xl font-bold text-[#12153D]">
                          Results for:{" "}
                          <span className="text-[#E5590F]">
                            {keywordData.keyword}
                          </span>
                        </h2>
                        <p className="text-xs sm:text-base text-gray-600 mt-1">
                          Found {keywordData.relatedKeywords.length} related
                          keywords
                        </p>
                      </div>

                      <div className="flex flex-col lg:flex-row w-full gap-4 sm:gap-8">
                        <div className="flex flex-col space-y-4 sm:space-y-6 lg:w-3/5">
                          <div className="w-full bg-white rounded-xl shadow-md p-3 sm:p-6 transition-all duration-300 hover:shadow-lg border border-gray-200">
                            <h3 className="text-base sm:text-lg font-semibold text-[#12153D] mb-3 sm:mb-4">Related Keywords</h3>
                            <KeywordContainer className="min-h-[250px] sm:min-h-[350px]" keywordData={keywordData} />
                          </div>
                        </div>

                        <div className="w-full lg:w-2/5 flex flex-col items-center lg:items-start space-y-4 sm:space-y-6">
                          <div
                            onClick={() => setHover(!hover)}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            className="cursor-pointer w-full max-w-full sm:max-w-[335px] h-[200px] sm:h-[290px] shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden"
                          >
                            {hover ? (
                              <div className="h-full w-full bg-[#12153D] rounded-2xl text-white text-left transition-all duration-300 p-4 sm:p-8 flex flex-col justify-center">
                                <h1
                                  className="text-xl sm:text-3xl font-semibold mb-2 sm:mb-4"
                                  style={{
                                    fontFamily: "Space Grotesk, sans-serif",
                                  }}
                                >
                                  What is it?
                                </h1>
                                <p className="text-xs sm:text-base text-justify">
                                  <span className="text-orange-500 font-medium">
                                    Related Words
                                  </span>{" "}
                                  are identifying search terms that people use
                                  in search engines. The goal is to use this
                                  information to improve your marketing.
                                </p>
                              </div>
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <img
                                  src={SVG1}
                                  alt="Related Keywords Illustration"
                                  className="h-full w-full object-contain bg-[#12153d] rounded-2xl transition-all duration-300 p-4"
                                />
                              </div>
                            )}
                          </div>
                          <div className="bg-[#12153d]/0 w-full sm:w-[336px] h-[200px] sm:h-[280px] flex justify-center items-center rounded-lg ">
                            <div className="bg-gray-100 w-[90%] sm:max-w-[300px] h-[180px] sm:h-[250px] rounded-xl shadow-sm flex justify-center items-center border border-gray-200">
                              <h1 className="text-sm sm:text-lg lg:text-2xl font-bold text-gray-400">
                                AD
                              </h1>
                            </div>
                          </div>
                          <div className="w-full sm:w-[300px] relative bg-gray-100 rounded-xl shadow-sm overflow-hidden border border-gray-200">
                            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                              <div id="p2P21nhppseX" className="absolute inset-0 w-full h-full">
                                {/* Video will fill this container completely */}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Additional ad for mobile only */}
                        <div className="flex lg:hidden bg-gray-100 w-full h-[90px] sm:h-[120px] mt-4 rounded-xl shadow-sm justify-center items-center border border-gray-200">
                          <h1 className="text-sm sm:text-lg font-bold text-[#12153d]">
                            ADVERTISEMENT
                          </h1>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-[#12153d] to-[#1c2260] text-white mt-6 sm:mt-10 p-4 sm:p-6 rounded-xl text-center lg:text-left   mx-auto md:w-[728px] md:w-[90px]shadow-md">
                        {/* <p className="text-xs sm:text-base lg:text-lg flex flex-col sm:flex-row items-center justify-center lg:justify-between">
                          <span>To find more information and get more insights check out </span>
                          <Link
                            to="/long-tail-keywords"
                            className="text-[#E5590F] hover:underline font-medium bg-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg mt-2 sm:mt-0 sm:ml-4 text-sm sm:text-base"
                          >
                            Content Ideas →
                          </Link>
                        </p> */}
                        ads
                      </div>
                    </>
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
