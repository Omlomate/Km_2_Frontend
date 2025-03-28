import React, { useState } from "react";
import SignupPage from "../Login&Registation/signupForm.jsx";
import axios from "axios";
import Loader from "../Loading/Loader.jsx"; // Import the Loader component

const KeywordData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [keywordData, setKeywordData] = useState(null);
  const [isSignupVisible, setSignupVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true); // Set loading to true when search starts
    // setKeywordData(null); // Clear previous results while loading

    try {
      // First API call: Scraping keyword data
      const scrapeResponse = await axios.get(
        `https://www.keywordraja.com/api/scraper/scrape`,
        {
          params: {
            query: searchTerm,
            location_code: "in",
            language_code: "en",
            engine: "google",
          },
        }
      );

      // Second API call: Fetching volume and difficulty
      const volumeDifficultyResponse = await axios.post(
        `https://www.keywordraja.com/api/gemini/get-keyword-volume-difficulty`,
        { keyword: searchTerm } // Send `keyword` in the body as per backend's requirement
      );

      setKeywordData({
        relatedKeywords: scrapeResponse.data.keywords,
        relatedKeywordsCount: scrapeResponse.data.keywords.length,
        volume: volumeDifficultyResponse.data.analysisResult.keywordVolume, // Ensure correct field names here
        difficulty:
          volumeDifficultyResponse.data.analysisResult.keywordDifficulty, // Ensure correct field names
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setKeywordData(null);
    } finally {
      setIsLoading(false); // Set loading to false when search completes
    }
  };

  const handleGmailClick = () => {
    setSignupVisible(true);
  };

  const handleSignupClick = () => {
    setSignupVisible(true);
  };

  const handleCloseSignup = () => {
    setSignupVisible(false);
  };

  // Removed chart options and data

  return (
    <>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;700&display=swap');
      </style>
      <div className="w-full bg-white grid grid-cols-1 pr-4 pl-4 rounded-lg animate-fade-in">
        {isSignupVisible ? (
          <div>
            <div className="order-2 md:order-3 w-full grid justify-center item-center ">
              <SignupPage onClose={handleCloseSignup} />
              {/* <button onClick={handleCloseSignup} className="absolute top-2 right-2 text-gray-500">
              &times;
            </button> */}
            </div>
          </div>
        ) : (
          <>
            <div
              className="grid bg-[url('/src/assets/bgimage.png')] bg-cover bg-center p-3 rounded-lg text-white mx-auto w-full sm:w-[895px] h-[220px] sm:h-[320px] max-w-full"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              <div className="p-2 sm:p-4 lg:p-10 flex justify-center items-center">
                <div className="text-center">
                  <h1 className="text-2xl sm:text-xl md:text-4xl lg:text-6xl mb-3 sm:mb-4 font-semibold">
                    Why do you need SEO?
                  </h1>
                  <ul className="list-disc inline-block text-left mt-2 sm:mt-2">
                    <li className="text-sm sm:text-sm md:text-base">
                      Guaranteed consistent growth
                    </li>
                    <li className="text-sm sm:text-sm md:text-base">
                      Leads for ideas and content
                    </li>
                    <li className="text-sm sm:text-sm md:text-base">
                      Insights on marketing trends
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="w-full max-w-full mt-4 mx-auto shadow-sm p-1 rounded-lg flex items-center border-1 border-gray-500"
            style={{fontFamily:"wantedsans"}}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Keyword"
                className="w-full p-2 border-none outline-none bg-transparent"
              />
              <i
                className="fa-solid fa-magnifying-glass cursor-pointer text-2xl p-1 text-gray-500 transition-colors duration-300 hover:text-[#E5590F]"
                onClick={handleSearch}
              ></i>
            </div>
            
            {/* Show loader when loading */}
            {isLoading && (
              <div className="flex justify-center items-center mt-8 w-full">
                <div className="flex justify-center">
                  <Loader />
                </div>
              </div>
            )}
            
            {/* Only show results when not loading and data exists */}
            {!isLoading && (
              <div className="w-full max-w-[65rem] mx-auto p-1 mt-2 rounded-lg flex flex-col sm:flex-row items-start">
                {keywordData && (
                  <div className="flex flex-col sm:flex-row w-full h-full gap-3 sm:gap-0">
                    <div className="w-full sm:w-1/2 h-full border-1 border-gray-500 p-3 sm:p-4 rounded-lg mb-3 sm:mb-0">
                      <div className="p-2 sm:p-4 shadow-lg rounded-lg">
                        <h1 className="text-base sm:text-lg text-bold break-words">
                          <span className="text-[#E5590F] font-bold">{keywordData.relatedKeywordsCount}</span>
                          {" "}results for{" "}
                          <span className="font-bold text-[#12153d] break-all">{searchTerm}</span>
                        </h1>
                      </div>
                      <ol className="p-2 sm:p-4 max-h-[200px] sm:max-h-122 overflow-y-auto">
                        {keywordData.relatedKeywords.map((item, index) => (
                          <li
                            key={index}
                            className="text-xs sm:text-sm md:text-base mb-1 sm:mb-2 break-words"
                          >
                            {item}
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div className="w-full sm:w-1/2 sm:pl-3">
                      <div className="flex min-h-[6rem] sm:min-h-[9rem] border-1 border-gray-500 rounded-lg justify-between items-center bg-gray-300 p-3 sm:p-4">
                        <h1 className="text-center text-xs sm:text-sm md:text-base">
                          ADS
                        </h1>
                      </div>
                      <div className="mt-3 sm:mt-4" style={{fontFamily:"wantedsans"}}>
                        <div className="h-20 sm:h-25 bg-[#12153d] text-white text-center pt-3 sm:pt-5 rounded-t-lg">
                          <h1 className="text-base sm:text-lg font-bold">Keyword volume</h1>
                          <p className="text-base text-[#E5590F] sm:text-2xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                            {keywordData.volume >= 1000 
                              ? `${Math.round(keywordData.volume / 1000)}k` 
                              : keywordData.volume}
                          </p>
                        </div>
                        <div className="w-full relative h-20 sm:h-25 border-t-none">
                          <div className="absolute rounded-b-lg h-full inset-0 flex items-center justify-center border-1 border-gray-500 text-white text-lg transition-opacity duration-300 ease-in-out z-10 opacity-100 hover:opacity-0">
                            <div className="">
                              <p className="text-black text-lg sm:text-2xl p-4 font">
                                what does it mean?
                              </p>
                            </div>
                          </div>
                          <div className="absolute rounded-b-lg inset-0 flex items-center justify-center bg-[#12153d] text-white text-lg transition-opacity duration-500 ease-in-out z-20 opacity-0 hover:opacity-100">
                            <div className="flex flex-col items-center p-4">
                              <h1 className="text-sm sm:text-lg text-bold">
                                Keyword volume is the estimated{" "}
                                <span className="text-orange-500">
                                  No of times
                                </span>{" "}
                                a specific{" "}
                                <span className="text-orange-500">
                                  keyword is searched
                                </span>{" "}
                                in a given time period
                              </h1>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-4" style={{fontFamily:"wantedsans"}}>
                        <div className="h-25 bg-[#12153d] text-white text-center pt-5 rounded-t-lg">
                          <h1 className="text-lg sm:text-xl font-bold">
                            Keyword Difficulty
                          </h1>
                          <p className="text-lg text-[#E5590F] sm:text-2xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                           {keywordData.difficulty} %
                          </p>
                        </div>
                        <div className="w-full relative h-25 border-t-none">
                          <div className="absolute rounded-b-lg h-full inset-0 flex items-center justify-center border-1 border-gray-500 text-white text-lg transition-opacity duration-300 ease-in-out z-10 opacity-100 hover:opacity-0">
                            <div className="">
                              <p className="text-black text-lg sm:text-2xl p-4 font">
                                what does it mean?
                              </p>
                            </div>
                          </div>
                          <div className="absolute rounded-b-lg inset-0 flex items-center justify-center bg-[#12153d] text-white text-lg transition-opacity duration-500 ease-in-out z-20 opacity-0 hover:opacity-100">
                            <div className="flex flex-col items-center p-4">
                              <h1 className="text-sm sm:text-lg text-bold">
                                Keyword Difficulty indicates how{" "}
                                <span className="text-orange-500">
                                  challenging
                                </span>{" "}
                                it would be to{" "}
                                <span className="text-orange-500">
                                  rank organically
                                </span>{" "}
                                for this keyword
                              </h1>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div
              className="w-full relative h-24 sm:h-30 mt-4 hidden sm:block"
              id="hover"
            >
              <div className="absolute rounded-lg h-full inset-0 flex items-center justify-center border-1 border-gray-500 text-white text-lg transition-opacity duration-300 ease-in-out z-10 opacity-100 hover:opacity-0 p-3 sm:p-4 md:p-10" style={{fontFamily:"wantedsans"}}>
                <div className="items-center">
                  <p className="text-black text-xs sm:text-md md:text-lg p-1 sm:p-2 lg:text-xl text-center">
                    Want to grow your business, your social media with the right
                    advertising and marketing and much more with Keyword Raja?
                  </p>
                </div>
              </div>
              <div className="absolute rounded-lg inset-0 flex items-center justify-center bg-orange-500 text-white text-lg transition-opacity duration-500 ease-in-out z-20 opacity-0 hover:opacity-100 p-2 sm:p-3 md:p-10" style={{fontFamily:"wantedsans"}}>
                <div className="flex flex-col items-center">
                  <h1 className="text-sm sm:text-md md:text-lg text-bold lg:text-2xl text-center">
                    Make your account for free
                  </h1>
                  <button
                    className="bg-white mt-1 sm:mt-2 text-gray-600 p-1 sm:p-2 w-[6rem] sm:w-[8rem] md:w-[12rem] rounded-xl text-center cursor-pointer text-sm sm:text-base"
                    onClick={handleSignupClick}
                  >
                    click here
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default KeywordData;
