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
        const response = await fetch("https://www.keywordraja.com/api/meta/search-volume");
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
          description: "Analyze search volume trends with Keyword Raja to optimize your keyword strategy.",
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

      <div className="w-full bg-white  pr-4 pl-4  rounded-lg" style={{ fontFamily: "wantedsans" }}>
        <div className="w-full lg:min-w-[40rem]">
          <BannerAds />
        </div>
        <div className="w-full max-w-[895px] mx-auto mt-2 rounded-lg">
          <div className="flex items-center lg:min-w-[40rem]">
            <SearchInput
              onSearch={handleSearch}
              onCountryChange={handleCountryChange}
              onServerChange={handleServerChange}
            />
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
                    <div className="w-full lg:w-1/2 pr-4">
                      <div
                        className="flex flex-col items-center justify-center space-y-5 rounded-lg border-1 border-gray-500 w-[435px] h-[328px]"
                        style={{ transition: "box-shadow 0.3s ease-in-out" }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        <h1 className="text-2xl text-[#12153d] font-bold">Audience Volume</h1>
                        <div className="flex flex-col items-center justify-center mt-2 mb-4">
                          <p className="text-5xl text-[#12153d] font-bold font-sans">
                            {formatNumber(keywordData?.data[0]?.vol)}
                          </p>
                          <div className="flex items-center justify-center mt-4">
                            {displayedCountry.flag && (
                              <div className="flex flex-col items-center mr-4">
                                <img
                                  className="w-12 h-8 cursor-pointer"
                                  src={displayedCountry.flag}
                                  alt={`${displayedCountry.name} Flag`}
                                />
                                <span className="text-xs mt-1">{displayedCountry.name}</span>
                              </div>
                            )}
                            <div className="flex flex-col items-center">
                              <img
                                className="w-12 h-8"
                                src={displayedServer.icon}
                                alt={`${displayedServer.name} Icon`}
                              />
                              <span className="text-xs mt-1">{displayedServer.name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {displayedCountry.map && (
                        <div
                          className="bg-[#12153d] w-[430px] h-[245px] mt-4 p-4 rounded-lg flex flex-col items-center justify-center group overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(229,89,15,0.3)]"
                          style={{ transition: "box-shadow 0.3s ease-in-out" }}
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                        >
                          <h3 className="text-white mb-2">{displayedCountry.name} Map</h3>
                          <img
                            className="object-contain w-full h-full max-h-[200px] transition-all duration-500 ease-in-out transform group-hover:scale-110 group-hover:brightness-110 hover:rotate-1"
                            src={displayedCountry.map}
                            alt={`${displayedCountry.name} Map`}
                          />
                        </div>
                      )}
                    </div>
                    <div className="mt-0 pr-2">
                      <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                        {hover ? (
                          <div className="h-[330px] w-full sm:w-[300px] p-8 bg-[#12153D] rounded-2xl text-white text-center lg:text-left">
                            <h1
                              className="text-md lg:text-3xl font-semibold mb-4"
                              style={{ fontFamily: "Space Grotesk, sans-serif" }}
                            >
                              What is it?
                            </h1>
                            <p className="text-justify">
                              <span className="text-orange-500">Related Words</span> are
                              identifying search terms that people use in search engines.
                              The goal is to use this information to improve your marketing.
                            </p>
                          </div>
                        ) : (
                          <img src={AV} alt="" className="w-full sm:w-auto" />
                        )}
                      </div>
                      <div className="bg-gray-300 h-[250px] w-full sm:w-[300px] mt-4 rounded-md flex justify-center items-center">
                        <h1 className="text-md lg:text-2xl font-bold">AD</h1>
                      </div>
                      <div className="mt-4"></div>
                    </div>
                    <div className="bg-gray-300 h-[600px] w-full sm:w-[120px] ml-0 sm:ml-4 rounded-md flex justify-center items-center">
                      <h1 className="text-md lg:text-2xl font-bold">AD</h1>
                    </div>
                  </div>
                  <div className="bg-[#12153d] text-white mt-4 p-4 rounded-md text-center lg:text-left">
                    <p className="text-md lg:text-lg">
                      To find more information and get more insights check out{" "}
                      <a href="#" className="text-[#E5590F]">
                        content ideas
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

export default AudienceVolume;