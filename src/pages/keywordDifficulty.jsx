import React, { useState, useEffect } from "react"; // Added useEffect
import { Helmet } from "react-helmet"; // Import Helmet
import BannerAds from "../Components/ui/Ads/BannerAds";
import SearchInput from "../Components/ui/KeywordInput/SearchInput";
import useKeywordData from "../hooks/useKeywordData";
import Difficultycircle from "../Components/ui/Graphs/Difficultycircle";
import Loader from "../Components/Loading/Loader";

const KeywordDifficulty = () => {
  const [keywordData, setKeywordData] = useState(null);
  const { data: data3, loading } = useKeywordData();
  const [loadingState, setLoading] = useState(false);
  const [metaTags, setMetaTags] = useState({ title: "", description: "" }); // State for meta tags

  // Fetch meta tags for the Keyword Difficulty page
  useEffect(() => {
    const fetchMetaTags = async () => {
      try {
        const response = await fetch("https://www.keywordraja.com/api/meta/keyword-difficulty");
        const data = await response.json();
        setMetaTags({
          title: data.title,
          description: data.description,
        });
      } catch (error) {
        console.error("Error fetching meta tags:", error);
        // Fallback meta tags in case of error
        setMetaTags({
          title: "Keyword Difficulty - Keyword Raja",
          description: "Check keyword difficulty with Keyword Raja to target winnable SEO opportunities.",
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
      const response = await fetch(
        "https://www.keywordraja.com/api/gemini/get-keyword-difficulty",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ keyword: searchTerm }),
        }
      );

      const apiResult = await response.json();
      console.log("API Response:", apiResult);

      if (response.ok) {
        setKeywordData(apiResult.analysisResult);
      } else {
        console.error("Error fetching keyword difficulty:", apiResult);
      }
    } catch (error) {
      console.error("API request failed:", error);
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

      <div className="w-full bg-white  pr-4 pl-4  rounded-lg" style={{ fontFamily: "wantedsans" }}>
        <div className="w-full lg:min-w-[40rem]">
          <BannerAds />
        </div>
        <div className="w-full max-w-[895px] mx-auto mt-2 rounded-lg">
          <div className="w-full lg:min-w-[40rem]">
            <SearchInput onSearch={handleSearch} />
          </div>
          <div>
            {loadingState ? (
              <div className="flex justify-center">
                <Loader />
              </div>
            ) : keywordData ? (
              <>
                <style>
                  {`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;700&display=swap');`}
                </style>
                <div className="flex flex-col lg:flex-row w-full mt-4 justify-start">
                  <div className="w-full flex flex-col lg:w-1/2">
                    <div
                      className="p-4 flex flex-col justify-center items-center bg-white rounded-lg border border-gray-500"
                      style={{ transition: "box-shadow 0.3s ease-in-out" }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="space-y-6">
                        <div className="text-center space-y-2">
                          <h2 className="text-2xl font-bold text-orange-500">Competition</h2>
                          <p className="text-2xl font-semibold">
                            {keywordData.keyword_difficulty}%
                          </p>
                        </div>
                        <div>
                          <Difficultycircle percentage={keywordData.keyword_difficulty} />
                        </div>
                      </div>
                    </div>
                    <div
                      className="p-1 flex flex-col justify-center w-[443px] h-[250px] bg-[#12153D] rounded-lg text-white text-center lg:text-left mt-4"
                      style={{ transition: "box-shadow 0.3s ease-in-out" }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <h1 className="text-xl p-8">{keywordData.difficulty_description}</h1>
                    </div>
                  </div>
                  <div className="pr-4 pl-4">
                    <div
                      className="p-8 bg-[#12153D] rounded-lg text-white h-[330px] w-[300px] text-center lg:text-left"
                      style={{ transition: "box-shadow 0.3s ease-in-out" }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <h1
                        className="text-md lg:text-2xl font-bold mb-2"
                        style={{ fontFamily: "Space Grotesk, sans-serif" }}
                      >
                        What is it?
                      </h1>
                      <p className="text-justify">
                        <span className="text-orange-500">Competition</span> estimates how
                        difficult it is to rank for a keyword. The higher the keyword
                        difficulty, the larger the competition.
                      </p>
                    </div>
                    <div className="bg-gray-300 h-[250px] w-[300px] mt-4 rounded-md flex justify-center items-center">
                      <h1 className="text-md lg:text-2xl font-bold">AD</h1>
                    </div>
                  </div>
                  <div className="bg-gray-300 h-[600px] w-[120px] p-14 rounded-md flex justify-center items-center">
                    <h1 className="text-md lg:text-2xl font-bold">AD</h1>
                  </div>
                </div>
                <div className="bg-[#12153d] text-white mt-4 p-8 rounded-md text-center lg:text-left">
                  <p
                    className="text-md lg:text-lg"
                    style={{ wordSpacing: "0.5px", letterSpacing: "1.5px" }}
                  >
                    To find more information and get more insights check out{" "}
                    <a href="#" className="text-orange-500">
                      cancel score
                    </a>{" "}
                    to lower your risk of getting cancelled.
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 mt-4">
                No data available. Try searching for a keyword.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default KeywordDifficulty;