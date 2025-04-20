import React, { useState, useEffect } from "react"; // Added useEffect
import { Helmet } from "react-helmet"; // Import Helmet
import useKeywordData from "../hooks/useKeywordData.js";
import BannerAds from "../Components/ui/Ads/BannerAds.jsx";
import SearchInput from "../Components/ui/KeywordInput/SearchInput.jsx";
import AV from "../assets/AV.svg";
import GoogleIcon from "../assets/googleIcon.svg";
import Loader from "../Components/Loading/Loader.jsx";
import CountrySelect from "../Components/ui/KeywordInput/CountrySelect.jsx";

export const AudienceVolume = () => {
  const [keywordData, setKeywordData] = useState(null);
  const { data: data3, loading } = useKeywordData();
  const [hover, setHover] = useState(false);
  const [loadingState, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    name: "",
    flag: "",
    map: "",
    apiReference: "",
  });
  const [displayedCountry, setDisplayedCountry] = useState({
    name: "",
    flag: "",
    map: "",
    apiReference: "",
  });
  const [selectedServer, setSelectedServer] = useState({
    name: "Google",
    icon: GoogleIcon,
  });
  const [displayedServer, setDisplayedServer] = useState({
    name: "Google",
    icon: GoogleIcon,
  });
  const [metaTags, setMetaTags] = useState({ title: "", description: "" }); // State for meta tags

  // Fetch meta tags for the Search Volume page
  useEffect(() => {
    const fetchMetaTags = async () => {
      try {
        const response = await fetch(
          "https://www.keywordraja.com/api/meta/search-volume"
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
          title: "Search Volume - Keyword Raja",
          description:
            "Analyze search volume trends with Keyword Raja to optimize your keyword strategy.",
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
    setLoading(true);

    try {
      if (!selectedCountry.apiReference) {
        alert("Please select a country before searching");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "https://www.keywordraja.com/api/keywords/keyword-Everywhere-Volume",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            keywords: [searchTerm],
            country: selectedCountry.apiReference,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch data");

      console.log("selectedCountry:", selectedCountry);

      const result = await response.json();
      console.log("Search result:", result);
      setKeywordData(result);

      setDisplayedCountry(selectedCountry);
      setDisplayedServer(selectedServer);
    } catch (error) {
      console.error("Error fetching keyword data:", error);
      setKeywordData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (country) => {
    console.log("Country changed to:", country);
    setSelectedCountry(country);
  };

  const handleServerChange = (server) => {
    setSelectedServer(server);
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
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
                Search <span className="text-[#E5590F]">Volume</span> Analyzer
              </h1>
              <p className="text-xs sm:text-base md:text-lg text-gray-600 text-center max-w-2xl mx-auto mb-4 sm:mb-8 animate-slideUp">
                Discover how many people are searching for your keywords across different regions.
                Understanding search volume helps you prioritize keywords with the highest potential traffic.
              </p>
            </div>
          </div>

          <div className="w-full mx-auto rounded-lg flex flex-col items-center">
            <div className="w-full max-w-3xl mx-auto">
              <div className="transition-all duration-300 p-3 sm:p-6 rounded-xl bg-gray-50 shadow-sm border border-gray-100">
                <SearchInput
                  onSearch={handleSearch}
                  onCountryChange={handleCountryChange}
                  onServerChange={handleServerChange}
                  className="w-full"
                />
              </div>
            </div>

            <div className="w-full mt-6 sm:mt-10">
              {loadingState ? (
                <div className="flex flex-col justify-center items-center h-48 sm:h-80 w-full">
                  <Loader />
                  <p className="mt-3 sm:mt-4 text-xs sm:text-base text-gray-600">
                    Analyzing search volume data...
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
                          {keywordData?.data[0]?.keyword || "Keyword"}
                        </span>
                      </h2>
                      <p className="text-xs sm:text-base text-gray-600 mt-1">
                        Search volume analysis for {displayedCountry.name || "selected region"}
                      </p>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row w-full gap-4 sm:gap-8">
                      <div className="flex flex-col space-y-4 sm:space-y-6 lg:w-3/5">
                        <div className="w-full bg-white rounded-xl shadow-md p-3 sm:p-6 transition-all duration-300 hover:shadow-lg border border-gray-200">
                          <h3 className="text-base sm:text-lg font-semibold text-[#12153D] mb-3 sm:mb-4">Audience Volume</h3>
                          
                          <div className="flex flex-col items-center justify-center space-y-5 rounded-lg w-full h-auto min-h-[250px] p-4">
                            <p className="text-3xl sm:text-6xl text-[#12153D] font-bold">
                              {formatNumber(keywordData?.data[0]?.vol)}
                            </p>
                            <div className="flex items-center justify-center mt-4">
                              {displayedCountry.flag && (
                                <div className="flex flex-col items-center mr-6">
                                  <img
                                    className="w-10 h-7 sm:w-14 sm:h-10 cursor-pointer shadow-sm rounded"
                                    src={displayedCountry.flag}
                                    alt={`${displayedCountry.name} Flag`}
                                  />
                                  <span className="text-xs sm:text-sm mt-2 font-medium">
                                    {displayedCountry.name}
                                  </span>
                                </div>
                              )}
                              <div className="flex flex-col items-center">
                                <img
                                  className="w-10 h-7 sm:w-14 sm:h-10 shadow-sm rounded p-1 bg-white"
                                  src={displayedServer.icon}
                                  alt={`${displayedServer.name} Icon`}
                                />
                                <span className="text-xs sm:text-sm mt-2 font-medium">
                                  {displayedServer.name}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {displayedCountry.map && (
                          <div className="w-full bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200">
                            <div className="bg-[#12153D] p-3 sm:p-4">
                              <h3 className="text-white text-base sm:text-lg font-semibold">
                                {displayedCountry.name} Map
                              </h3>
                            </div>
                            <div className="p-4 flex justify-center items-center bg-gray-50">
                              <img
                                className="object-contain w-full max-h-[200px] transition-all duration-500 ease-in-out transform hover:scale-105"
                                src={displayedCountry.map}
                                alt={`${displayedCountry.name} Map`}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="w-full lg:w-2/5 flex flex-col items-center lg:items-start space-y-4 sm:space-y-6">
                        <div className="w-full max-w-full sm:max-w-[335px] shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
                          <div 
                            className="h-full w-full bg-[#12153D] rounded-2xl text-white text-left transition-all duration-300 p-4 sm:p-8 flex flex-col justify-center"
                            onMouseEnter={() => setHover(true)}
                            onMouseLeave={() => setHover(false)}
                          >
                            <h1 className="text-xl sm:text-3xl font-semibold mb-2 sm:mb-4">
                              What is it?
                            </h1>
                            <p className="text-xs sm:text-base text-justify">
                              <span className="text-orange-500 font-medium">
                                Audience Volume
                              </span>{" "}
                              represents the number of monthly searches for your keyword in the selected region. 
                              Higher volumes indicate greater search interest, helping you identify popular 
                              keywords for your SEO and content strategy.
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-[#12153d] w-full sm:w-[336px] h-[200px] sm:h-[280px] flex justify-center items-center rounded-lg shadow-md">
                          <div className="bg-gray-100 w-[90%] sm:max-w-[300px] h-[180px] sm:h-[250px] rounded-xl shadow-sm flex justify-center items-center border border-gray-200">
                            <h1 className="text-sm sm:text-lg lg:text-2xl font-bold text-gray-400">
                              AD
                            </h1>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#12153d] text-white mt-6 p-4 rounded-md text-center lg:text-left">
                      {/* <p className="text-md lg:text-lg">
                        To find more information and get more insights check out{" "}
                        <a href="#" className="text-[#E5590F]">
                          content ideas
                        </a>{" "}
                        to understand your local and global audience.
                      </p> */}
                      <p className="text-xs sm:text-base">
                        Ads
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

export default AudienceVolume;
