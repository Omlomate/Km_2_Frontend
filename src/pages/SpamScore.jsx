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
      {/* Add Helmet to set meta tags */}
      <Helmet>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
      </Helmet>

      <div
        className="flex justify-center w-full bg-gray-50 min-h-screen py-4 px-2 sm:py-6 sm:px-4"
        style={{ fontFamily: "wantedsans" }}
      >
        <div className="w-full max-w-6xl bg-gray-50 rounded-xl mx-auto p-3 sm:p-8">
          <div className="w-full py-3 sm:py-6">
            <div className="animate-fadeIn">
              <h1 className="text-xl sm:text-3xl md:text-5xl font-bold text-center text-[#12153D] mb-2 sm:mb-4 animate-slideDown">
                Keyword <span className="text-[#E5590F]">Spam Score</span>{" "}
                Checker
              </h1>
              <p className="text-xs sm:text-base md:text-lg text-gray-600 text-center max-w-2xl mx-auto mb-4 sm:mb-8 animate-slideUp">
                Avoid risky keywords by checking their spam score and stay safe
                from Google penalties or low-quality traffic issues.{" "}
              </p>
            </div>
          </div>
          <div className="w-full mx-auto rounded-lg flex flex-col items-center">
            <div className="w-full max-w-3xl mx-auto">
              <div className="transition-all duration-300 p-3 sm:p-6 rounded-xl bg-gray-50   border border-gray-100">
                <SearchInput onSearch={handleSearch} />
              </div>
            </div>
            <div className="w-full mt-6 sm:mt-10">
              {loadingState ? (
                <div className="flex flex-col justify-center items-center h-48 sm:h-80 w-full">
                  <Loader />
                  <p className="mt-3 sm:mt-4 text-xs sm:text-base text-gray-600">
                    Checking spam score...
                  </p>
                </div>
              ) : (
                keywordData && (
                  <>
                    <style>
                      {`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;700&display=swap');`}
                    </style>
                    <div className="mb-4 sm:mb-8 px-2 sm:px-4 bg-gray-50 p-3 sm:p-4 rounded-xl border-l-4 border-[#E5590F]">
                      <h2 className="text-lg sm:text-2xl font-bold text-[#12153D]">
                        Results for:{" "}
                        <span className="text-[#E5590F]">
                          {keywordData.keyword || "Keyword"}
                        </span>
                      </h2>
                      <p className="text-xs sm:text-base text-gray-600 mt-1">
                        Spam score analysis and risk insights
                      </p>
                    </div>
                    <div className="flex flex-col lg:flex-row w-full gap-4 sm:gap-8">
                      <div className="flex flex-col space-y-4 sm:space-y-6 lg:w-3/5">
                        <div className="w-full bg-white rounded-xl shadow-md p-3 sm:p-6 transition-all duration-300 hover:shadow-lg border border-gray-200">
                          <h3 className="text-base sm:text-lg font-semibold text-[#12153D] mb-3 sm:mb-4">
                            Spam Score
                          </h3>
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
                        <div className="w-full bg-[#12153D] rounded-xl shadow-md p-4 sm:p-8 text-white text-center lg:text-left">
                          <h1 className="text-lg sm:text-xl font-semibold mb-2">
                            Spam Risk Description
                          </h1>
                          <p className="text-xs sm:text-base">
                            {keywordData.spam_description}
                          </p>
                        </div>
                      </div>
                      <div className="w-full lg:w-2/5 flex flex-col items-center lg:items-start space-y-4 sm:space-y-6">
                        <div className="w-full max-w-full sm:max-w-[335px] shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
                          <div className="h-full w-full bg-[#12153D] rounded-2xl text-white text-left transition-all duration-300 p-4 sm:p-8 flex flex-col justify-center">
                            <h1 className="text-xl sm:text-3xl font-semibold mb-2 sm:mb-4">
                              What is it?
                            </h1>
                            <p className="text-xs sm:text-base text-justify">
                              <span className="text-orange-500 font-medium">
                                Spam score
                              </span>{" "}
                              is used to measure a website's likelihood of
                              getting cancelled by search engines for being
                              spam.
                            </p>
                          </div>
                        </div>
                        <div className="bg-gray-300 w-full sm:w-[300px] h-[180px] sm:h-[250px] mt-4 rounded-md flex justify-center items-center">
                          <h1 className="text-md lg:text-2xl font-bold">AD</h1>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#12153d] text-white mt-6 p-4 rounded-md text-center lg:text-left">
                      <p className="text-xs sm:text-base">
                        To find more information and get more insights check out{" "}
                        <a href="#" className="text-orange-500">
                          audience volume
                        </a>{" "}
                        to understand your local and global audience.
                      </p>
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

export default SpamScore;
