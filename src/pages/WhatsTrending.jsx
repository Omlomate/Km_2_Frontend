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
        const response = await fetch("https://www.keywordraja.com/api/meta/keyword-trends");
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
          description: "Stay ahead with keyword trends analysis from Keyword Raja’s SEO toolkit.",
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
        "https://www.keywordraja.com/api/keywords/keyword-Everywhere-Volume",
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

      <div className="w-full bg-white p-5 rounded-lg" style={{ fontFamily: "wantedsans" }}>
        <div className="w-full lg:min-w-[40rem]">
          <BannerAds />
        </div>
        <div className="w-full max-w-[895px] mx-auto mt-2 rounded-lg">
          <div className="w-full lg:min-w-[40rem]">
            <SearchInput onSearch={handleSearch} onCountryChange={handleCountryChange} />
          </div>
          <div>
            {loadingState ? (
              <div className="flex justify-center">
                <Loader />
              </div>
            ) : (
              keywordData && (
                <>
                  <style>
                    {`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;700&display=swap');`}
                  </style>
                  <div className="flex flex-col lg:flex-row w-full mt-4">
                    <div className="w-full lg:w-1/2 border-1 border-gray-500 rounded-lg">
                      <div className="flex flex-col justify-center items-center mt-6">
                        <h1
                          className="text-2xl font-bold text-[#12153D] flex flex-col justify-center items-center"
                          style={{ fontFamily: "Space Grotesk, sans-serif" }}
                        >
                          What's Trending
                        </h1>
                        <Bargraph data={graphData} />
                        <div className="flex items-center justify-center mt-2">
                          <div className="w-4 h-4 bg-[#12153D] mr-2 flex items-center justify-center">
                            <div className="w-2 h-2 bg-[#12153d] rounded-full"></div>
                          </div>
                          <h1 className="text-[#12153D] font-medium">Monthly Trend</h1>
                        </div>
                      </div>
                      <div
                        className="bg-[#12153d] rounded-lg p-8 flex flex-col justify-center items-center space-y-2 mt-13.5"
                        style={{ transition: "box-shadow 0.3s ease-in-out" }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        <button
                          onClick={() => handleTimeRangeChange(8)}
                          className="p-2 font-bold text-md bg-white rounded-full pr-15 pl-15 hover:bg-[#E5590F] hover:text-white"
                        >
                          Last 8 Months
                        </button>
                        <button
                          onClick={() => handleTimeRangeChange(10)}
                          className="p-2 font-bold text-md bg-white rounded-full pr-15 pl-15 hover:bg-[#E5590F] hover:text-white"
                        >
                          Last 10 Months
                        </button>
                        <button
                          onClick={() => handleTimeRangeChange(12)}
                          className="p-2 font-bold text-md bg-white rounded-full pr-15 pl-15 hover:bg-[#E5590F] hover:text-white"
                        >
                          Last 12 Months
                        </button>
                      </div>
                    </div>
                    <div className="pl-4 pr-4 mt-4 lg:mt-0">
                      <div
                        className="p-8 bg-[#12153D] rounded-lg text-white h-[330px] w-full lg:w-[300px] text-center lg:text-left"
                        style={{ transition: "box-shadow 0.3s ease-in-out" }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        <h1
                          className="text-md lg:text-3xl font-bold mb-2"
                          style={{ fontFamily: "Space Grotesk, sans-serif" }}
                        >
                          What is it?
                        </h1>
                        <p className="text-justify text-semibold">
                          <span className="text-[#E5590F]">What’s Trending</span> shows you
                          popularity of specific keywords over time. These trends show you
                          what topics are gaining interest and which are fading.
                        </p>
                      </div>
                      <div className="bg-gray-300 h-[250px] w-full lg:w-[300px] mt-4 rounded-md flex justify-center items-center">
                        <h1 className="text-md lg:text-2xl font-bold">AD</h1>
                      </div>
                      <div className="mt-4"></div>
                    </div>
                    <div className="bg-gray-300 h-[600px] w-full lg:w-[120px] mt-4 lg:mt-0 rounded-md flex justify-center items-center">
                      <h1 className="text-md lg:text-2xl font-bold">AD</h1>
                    </div>
                  </div>
                  <div className="bg-[#12153d] text-white mt-4 p-4 rounded-md text-center lg:text-left">
                    <p className="text-md lg:text-lg">
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