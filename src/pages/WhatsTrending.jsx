import React, { useState, useEffect } from "react"; // Added useEffect
import { Helmet } from "react-helmet"; // Import Helmet
import BannerAds from "../Components/ui/Ads/BannerAds.jsx";
import SearchInput from "../Components/ui/KeywordInput/SearchInput.jsx";
import useKeywordData from "../hooks/useKeywordData.js";
import Loader from "../Components/Loading/Loader.jsx";
import Bargraph from "../Components/ui/Graphs/Bargraph.jsx";

const WhatsTrending = () => {
  const [keywordData, setKeywordData] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [loadingState, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const { data: data3, loading } = useKeywordData();
  const [metaTags, setMetaTags] = useState({ title: "", description: "" }); // State for meta tags

  // Fetch meta tags for the Keyword Trends page
  useEffect(() => {
    const fetchMetaTags = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/meta/keyword-trends`
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
          title: "Keyword Trends - Keyword Raja",
          description:
            "Stay ahead with keyword trends analysis from Keyword Raja’s SEO toolkit.",
        });
      }
    };
    fetchMetaTags();
  }, []);

  const handleSearch = async (searchTerm) => {
    console.log("Searching for:", searchTerm);
    setLoading(true);

    const requestBody = {
      keywords: [searchTerm],
      country: selectedCountry,
    };

    console.log("selectedCountry Bdy:", selectedCountry);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/keywords/keyword-Everywhere-Volume`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      if (result.data && result.data.length > 0) {
        const keywordInfo = result.data[0];

        const formattedData = {
          keyword: keywordInfo.keyword,
          competition: keywordInfo.competition,
          cpc: keywordInfo.cpc.value,
          currency: keywordInfo.cpc.currency,
          volume: keywordInfo.vol,
          trend: keywordInfo.trend,
          credits: result.credits,
        };

        console.log("Formatted Data:", formattedData);
        setKeywordData(formattedData);
        setGraphData(formatTrendData(keywordInfo.trend));
      } else {
        console.warn("No keyword data found.");
        setKeywordData(null);
      }
    } catch (error) {
      console.error("Error fetching keyword data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTrendData = (trendData) => {
    return trendData.map((item, index) => ({
      name: `Months ${index + 1}`,
      value: item.value || item,
    }));
  };

  const handleTimeRangeChange = (timeRange) => {
    if (keywordData && keywordData.trend) {
      const trendData = keywordData.trend.slice(-timeRange);
      setGraphData(formatTrendData(trendData));
    }
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.boxShadow =
      "4px 4px 8px rgba(229, 89, 15, 0.5), -4px 4px 8px rgba(229, 89, 15, 0.5), 4px -4px 8px rgba(229, 89, 15, 0.5), -4px -4px 8px rgba(229, 89, 15, 0.5)";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.boxShadow = "none";
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country.apiReference);
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
          {/* Header */}
          <div className="w-full py-3 sm:py-6">
            <div className="animate-fadeIn">
              <h1 className="text-xl sm:text-3xl md:text-5xl font-bold text-center text-[#12153D] mb-2 sm:mb-4 animate-slideDown">
                Keyword <span className="text-[#E5590F]">Trends</span>
              </h1>
              <p className="text-xs sm:text-base md:text-lg text-gray-600 text-center max-w-2xl mx-auto mb-4 sm:mb-8 animate-slideUp">
                Track keyword trends over time to see what’s rising or fading in
                popularity and plan your content accordingly.{" "}
              </p>
            </div>
          </div>
          {/* Search Input */}
          <div className="w-full max-w-3xl mx-auto">
            <div className="transition-all duration-300 p-3 sm:p-6 rounded-xl bg-white   border border-gray-100">
              <SearchInput
                onSearch={handleSearch}
                onCountryChange={handleCountryChange}
              />
            </div>
          </div>
          {/* Results */}
          <div className="w-full mt-6 sm:mt-10">
            {loadingState ? (
              <div className="flex flex-col justify-center items-center h-48 sm:h-80 w-full">
                <Loader />
                <p className="mt-3 sm:mt-4 text-xs sm:text-base text-gray-600">
                  Fetching keyword trends...
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
                      Keyword trend analysis and volume insights
                    </p>
                  </div>
                  <div className="flex flex-col lg:flex-row w-full gap-4 sm:gap-8">
                    {/* Trend Graph and Controls */}
                    <div className="flex flex-col space-y-4 sm:space-y-6 lg:w-3/5">
                      <div className="w-full bg-white rounded-xl shadow-md p-3 sm:p-6 transition-all duration-300 hover:shadow-lg border border-gray-200">
                        <h3 className="text-base sm:text-lg font-semibold text-[#12153D] mb-3 sm:mb-4">
                          What's Trending
                        </h3>
                        <div className="flex flex-col items-center space-y-4">
                          <Bargraph data={graphData} />
                          <div className="flex items-center justify-center mt-2">
                            <div className="w-4 h-4 bg-[#12153D] mr-2 flex items-center justify-center">
                              <div className="w-2 h-2 bg-[#12153d] rounded-full"></div>
                            </div>
                            <span className="text-[#12153D] font-medium">
                              Monthly Trend
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-[#12153d] rounded-xl shadow-md p-4 sm:p-8 text-white text-center lg:text-left">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center items-center">
                          <button
                            onClick={() => handleTimeRangeChange(8)}
                            className="p-2 font-bold text-md bg-white text-[#12153D] rounded-full px-6 hover:bg-[#E5590F] hover:text-white transition"
                          >
                            Last 8 Months
                          </button>
                          <button
                            onClick={() => handleTimeRangeChange(10)}
                            className="p-2 font-bold text-md bg-white text-[#12153D] rounded-full px-6 hover:bg-[#E5590F] hover:text-white transition"
                          >
                            Last 10 Months
                          </button>
                          <button
                            onClick={() => handleTimeRangeChange(12)}
                            className="p-2 font-bold text-md bg-white text-[#12153D] rounded-full px-6 hover:bg-[#E5590F] hover:text-white transition"
                          >
                            Last 12 Months
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Info and Ads */}
                    <div className="w-full lg:w-2/5 flex flex-col items-center lg:items-start space-y-4 sm:space-y-6">
                      <div className="w-full max-w-full sm:max-w-[335px] shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
                        <div className="h-full w-full bg-[#12153D] rounded-2xl text-white text-left transition-all duration-300 p-4 sm:p-8 flex flex-col justify-center">
                          <h1 className="text-xl sm:text-3xl font-semibold mb-2 sm:mb-4">
                            What is it?
                          </h1>
                          <p className="text-xs sm:text-base text-justify">
                            <span className="text-[#E5590F] font-medium">
                              What’s Trending
                            </span>{" "}
                            shows you popularity of specific keywords over time.
                            These trends show you what topics are gaining
                            interest and which are fading.
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
                      <a href="" className="text-[#E5590F]">
                        SEO difficulty
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
    </>
  );
};

export default WhatsTrending;
