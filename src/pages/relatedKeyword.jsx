import React, { useState } from "react";
import BannerAds from "../Components/ui/Ads/BannerAds.jsx";
import SearchInput from "../Components/ui/KeywordInput/SearchInput.jsx";
import KeywordContainer from "../Components/ui/LongTailKeyword/KeywordContainer.jsx";
import SVG1 from "../assets/releatedKI.svg";
import Loader from "../Components/Loading/Loader.jsx";

export const KeywordResearch = () => {
  const [keywordData, setKeywordData] = useState(null);
  const [hover, setHover] = useState(false);
  const [searchEngine, setSearchEngine] = useState("google"); // Default to Bing
  const [searchLoading, setSearchLoading] = useState(false); // Loader state

  const handleMouseEnter = (e) => {
    e.currentTarget.style.boxShadow = "4px 4px 8px rgba(229, 89, 15, 0.5), -4px 4px 8px rgba(229, 89, 15, 0.5), 4px -4px 8px rgba(229, 89, 15, 0.5), -4px -4px 8px rgba(229, 89, 15, 0.5)";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.boxShadow = "none";
  };

  const handleSearch = async (searchTerm) => {
    console.log("Searching for:", searchTerm, "Engine:", searchEngine);
    setSearchLoading(true); // Start loading

    try {
      const response = await fetch(
        `https://keyword-research3.onrender.com/api/scraper/scrape?query=${searchTerm}&engine=${searchEngine}`
      );
      const data = await response.json();

      if (data && data.keywords) {
        setKeywordData({ keyword: searchTerm, relatedKeywords: data.keywords });
      }
    } catch (error) {
      console.error("Error fetching keyword data:", error);
    } finally {
      setSearchLoading(false); // Stop loading
    }
  };

  return (
    <div className=" flex justify-center items-center">
      <div
        className="w-full max-w-[95%] sm:max-w-[895px] bg-white   pr-4 pl-4  rounded-lg mx-auto  "
        style={{ fontFamily: "wantedsans" }}
      >
        <div className="w-full flex justify-center">
          <BannerAds />
        </div>
        <div className="w-full mx-auto mt-4 rounded-lg flex flex-col items-center">
          <div className="w-full max-w-[895px]">
            <SearchInput onSearch={handleSearch} />
          </div>
          <div className="w-full">
            {searchLoading ? (
              <div className="flex justify-center mt-4">
                <Loader />
              </div>
            ) : (
              keywordData && (
                <>
                  <div className="flex flex-col lg:flex-row w-full mt-4 gap-4 lg:space-x-1.5 justify-center">
                    <div className="w-full lg:w-1/2">
                      <KeywordContainer keywordData={keywordData} />
                    </div>
                    <div className="mt-4 lg:mt-0   flex flex-col items-center lg:items-start">
                      <div
                        onClick={() => setHover(!hover)}
                        onMouseEnter={() => window.innerWidth > 768 && setHover(true)}
                        onMouseLeave={() => window.innerWidth > 768 && setHover(false)}
                        className="cursor-pointer w-full sm:w-[300px] h-[330px]"
                      >
                        {hover ? (
                          <div className="h-full w-full bg-[#12153D] rounded-2xl text-white text-left transition-all duration-300 p-8 flex flex-col justify-center">
                            <h1
                              className="text-3xl font-semibold mb-4"
                              style={{ fontFamily: "Space Grotesk, sans-serif" }}
                            >
                              What is it?
                            </h1>
                            <p className="text-base text-justify">
                              <span className="text-orange-500">Related Words</span>{" "}
                              are identifying search terms that people use in
                              search engines. The goal is to use this information
                              to improve your marketing.
                            </p>
                          </div>
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <img 
                              src={SVG1} 
                              alt="" 
                              className="h-full w-full object-contain bg-[#12153d] rounded-2xl transition-all duration-300 p-4" 
                            />
                          </div>
                        )}
                      </div>
                      <div className="bg-gray-300 h-[200px] lg:h-[250px] w-full sm:w-[300px] mt-4 rounded-md flex justify-center items-center">
                        <h1 className="text-lg lg:text-2xl font-bold">AD</h1>
                      </div>
                    </div>
                    <div className="bg-gray-300 h-[200px] lg:h-[600px] w-full sm:w-[120px] mt-4 lg:mt-0   rounded-md flex justify-center items-center">
                      <h1 className="text-lg lg:text-2xl font-bold">AD</h1>
                    </div>
                  </div>
                  <div className="hidden sm:block bg-[#12153d] text-white mt-4 p-3 sm:p-4 rounded-md text-center lg:text-left max-w-[895px] mx-auto">
                    <p className="text-sm lg:text-lg">
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
    </div>
  );
};

export default KeywordResearch;
