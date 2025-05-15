import React, { useState, useEffect } from "react"; // Added useEffect
import { Helmet } from "react-helmet"; // Import Helmet
import BannerAds from "../Components/ui/Ads/BannerAds";
import SearchInput from "../Components/ui/KeywordInput/SearchInput";
import useKeywordData from "../hooks/useKeywordData";
import SpamRiskCircle from "../Components/ui/Graphs/SpamRiskCircle";
import Loader from "../Components/Loading/Loader";

const SpamScore = () => {
  const [keywordData, setKeywordData] = useState(null);
  const [loadingState, setLoading] = useState(false);
  const { data: data3, loading } = useKeywordData();
  const [metaTags, setMetaTags] = useState({ title: "", description: "" }); // State for meta tags

  // Fetch meta tags for the Keyword Spam Score page
  useEffect(() => {
    const fetchMetaTags = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/meta/keyword-spam-score`
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
          title: "Keyword Spam Score - Keyword Raja",
          description:
            "Evaluate keyword spam scores with Keyword Raja for cleaner, effective SEO.",
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
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/gemini/get-keyword-spam-score`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ keyword: trimmedSearchTerm }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Extract first digit from spam_score
      const spamScore = data.analysisResult?.spam_score?.match(/\d/); // Extracts the first number
      const extractedSpamScore = spamScore ? parseInt(spamScore[0]) : 0;

      // Updating keywordData with extracted spam score
      setKeywordData({
        ...data.analysisResult,
        spamRiskScore: extractedSpamScore, // Overriding spam_score with first digit
      });
    } catch (error) {
      console.error("Error fetching keyword data:", error);
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
          <div className="w-full py-4 sm:py-6 md:py-8 bg-gradient-to-r from-[#E5590F]/10 to-[#12153D]/10 rounded-lg">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 md:space-y-8 text-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#12153D] transition-all duration-300">
                  Keyword{" "}
                  <span className="text-[#E5590F] hover:text-[#ff6a1e] transition-colors duration-300">
                    Spam Score
                  </span>{" "}
                  Checker
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed animate-slide-up">
                  Avoid risky keywords by checking their spam score and stay
                  safe from Google penalties or low-quality traffic issues.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full mx-auto rounded-lg flex flex-col items-center">
            <div className="w-full max-w-3xl mx-auto">
              <div className="transition-all duration-300 p-4 sm:p-6">
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
                    Check Spam Score
                  </h3>
                </div>
                <SearchInput onSearch={handleSearch} />
              </div>
            </div>

            <div className="w-full mt-6 sm:mt-8 md:mt-10">
              {loadingState ? (
                <div className="flex flex-col justify-center items-center h-48 sm:h-64 md:h-80 w-fit mx-auto p-4 transition-all duration-300 adc-loading-container">
                  <Loader />
                  <p className="mt-4 sm:mt-5 md:mt-6 text-sm sm:text-base text-gray-600 animate-pulse">
                    Checking spam score...
                  </p>
                </div>
              ) : (
                keywordData && (
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
                              {keywordData.keyword || "Keyword"}
                            </span>
                          </h2>
                          <p className="text-sm sm:text-base text-gray-300 mt-2 sm:mt-3">
                            Spam score analysis and risk insights
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
                              Spam Score
                            </h3>
                          </div>
                          <div className="flex flex-col items-center space-y-4">
                            <p className="text-3xl sm:text-5xl font-bold text-orange-500">
                              {keywordData.spamRiskScore}
                            </p>
                            <SpamRiskCircle
                              percentage={keywordData.spamRiskScore}
                              description="Spam Risk Level"
                            />
                          </div>
                        </div>
                        <div className="w-full bg-gradient-to-br from-[#12153D] to-[#1c2260] rounded-xl shadow-lg p-4 sm:p-8 text-white text-center lg:text-left border-l-4 border-[#E5590F] transition-all duration-300 hover:shadow-xl transform hover:scale-[1.01]"
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                        >
                          <div className="flex items-center mb-3 sm:mb-4">
                            <div className="w-8 h-8 rounded-full bg-[#E5590F] flex items-center justify-center mr-3">
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
                            <h1 className="text-lg sm:text-xl font-semibold">
                              Spam Risk Description
                            </h1>
                          </div>
                          <div className="pl-11">
                            <p className="text-sm sm:text-base leading-relaxed text-white font-medium tracking-wide animate-fadeIn">
                              {keywordData.spam_description}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex flex-col gap-5 sm:gap-6">
                          <div
                            onClick={() => setHover(!hover)}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            className="cursor-pointer w-full aspect-[4/3] shadow-lg hover:shadow-xl transition-all duration-500 rounded-2xl overflow-hidden transform hover:scale-[1.02] group relative bg-gradient-to-br from-[#12153D] to-[#1c2260] border-l-4 border-[#E5590F]"
                          >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#E5590F]/10 rounded-full -mr-12 -mt-12 z-0"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#E5590F]/10 rounded-full -ml-8 -mb-8 z-0"></div>
                            <div className="h-full w-full p-4 transition-all duration-300 relative z-10">
                              <div className="h-full w-full flex flex-col justify-center p-4 sm:p-6 lg:p-8 text-white text-left">
                                <div className="flex items-center mb-4">
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
                                  <h1 className="text-xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                                    What is it?
                                  </h1>
                                </div>
                                <div className="pl-13 border-l-2 border-[#E5590F]/30 ml-5">
                                  <p className="text-sm sm:text-base text-gray-200 leading-relaxed tracking-wide">
                                    <span className="text-[#E5590F] font-semibold text-base sm:text-lg inline-block mb-1">
                                      Spam score
                                    </span>{" "}
                                    is used to measure a website's likelihood of
                                    getting cancelled by search engines for being
                                    spam.
                                  </p>
                                </div>
                                <div className="mt-4 sm:mt-6 flex justify-end">
                                  <span className="text-xs text-gray-400 italic">Click to learn more</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          id="rk-ad-1"
                          className=" w-full lg:w-[300px] sm:max-w-[300px] h-[250px] sm:h-[250px] rounded-xl  flex justify-center items-center mt-4"
                        >
                          AD
                        </div>
                        <div className="w-full sm:w-[300px] relative  rounded-xl overflow-hidden  mt-4">
                          <div
                            className="relative w-full"
                            style={{ paddingBottom: "55%" }}
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
                      className="bg-gradient-to-r from-[#12153d] to-[#1c2260] text-white mt-6 sm:mt-8 lg:mt-10 p-4 lg:p-6 rounded-xl text-center w-full max-w-[728px] mx-auto flex items-center justify-center shadow-md aspect-[8/1] hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] kd-ad-container"
                    >
                      ads
                    </div>
                  </div>
                )
              )}
              {/* )} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpamScore;
