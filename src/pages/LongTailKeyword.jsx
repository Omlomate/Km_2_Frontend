import React, { useState, useEffect } from "react"; // Added useEffect
import { Helmet } from "react-helmet"; // Import Helmet
import BannerAds from "../Components/ui/Ads/BannerAds.jsx";
import SearchInput from "../Components/ui/KeywordInput/SearchInput.jsx";
import KeywordContainer from "../Components/ui/LongTailKeyword/KeywordContainer.jsx";
import Loader from "../Components/Loading/Loader.jsx";

const LongTailKeywordPage = () => {
  const [keywordData, setKeywordData] = useState(null);
  const [searchEngine, setSearchEngine] = useState("google");
  const [loading, setLoading] = useState(false);
  const [metaTags, setMetaTags] = useState({ title: "", description: "" }); // State for meta tags

  // Fetch meta tags for the Long-Tail Keywords page
  useEffect(() => {
    const fetchMetaTags = async () => {
      try {
        const response = await fetch("https://www.keywordraja.com/api/meta/long-tail-keywords");
        const data = await response.json();
        setMetaTags({
          title: data.title,
          description: data.description,
        });
      } catch (error) {
        console.error("Error fetching meta tags:", error);
        // Fallback meta tags in case of error
        setMetaTags({
          title: "Long-Tail Keywords - Keyword Raja",
          description: "Explore long-tail keywords for targeted traffic with Keyword Raja’s SEO solutions.",
        });
      }
    };
    fetchMetaTags();
  }, []);

  const handleSearch = async (searchTerm) => {
    console.log("Searching for:", searchTerm, "Engine:", searchEngine);
    setLoading(true);

    try {
      const response = await fetch(
        `https://www.keywordraja.com/api/scraper/scrape?query=${searchTerm}&engine=${searchEngine}`
      );
      const data = await response.json();

      if (data && data.keywords) {
        // Filter keywords to show only those with 3 or more words
        const filteredKeywords = data.keywords.filter(
          (keyword) => keyword.trim().split(/\s+/).length > 3
        );

        setKeywordData({
          keyword: searchTerm,
          relatedKeywords: filteredKeywords,
        });
      }
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

      <div className="flex justify-center w-full bg-gray-50 min-h-screen py-4 px-2 sm:py-6 sm:px-4">
        <div
          className="w-full max-w-6xl bg-gray-50 rounded-xl mx-auto p-3 sm:p-8"
          style={{ fontFamily: "wantedsans" }}
        >
          <div className="w-full py-3 sm:py-6">
            <div className="animate-fadeIn">
              <h1 className="text-xl sm:text-3xl md:text-5xl font-bold text-center text-[#12153D] mb-2 sm:mb-4 animate-slideDown">
                Long-Tail <span className="text-[#E5590F]">Keywords</span> Finder
              </h1>
              <p className="text-xs sm:text-base md:text-lg text-gray-600 text-center max-w-2xl mx-auto mb-4 sm:mb-8 animate-slideUp">
              Discover easy-to-rank long-tail keywords with lower competition and better 
              chances to bring targeted traffic to your site.
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
              {loading ? (
                <div className="flex flex-col justify-center items-center h-48 sm:h-80 w-full">
                  <Loader />
                  <p className="mt-3 sm:mt-4 text-xs sm:text-base text-gray-600">
                    Searching for long-tail keywords...
                  </p>
                </div>
              ) : (
                keywordData && (
                  <>
                    <div className="mb-4 sm:mb-8 px-2 sm:px-4 bg-gray-50 p-3 sm:p-4 rounded-xl border-l-4 border-[#E5590F]">
                      <h2 className="text-lg sm:text-2xl font-bold text-[#12153D]">
                        Results for:{" "}
                        <span className="text-[#E5590F]">
                          {keywordData.keyword}
                        </span>
                      </h2>
                      <p className="text-xs sm:text-base text-gray-600 mt-1">
                        Found {keywordData.relatedKeywords.length} long-tail keywords
                      </p>
                    </div>

                    <div className="flex flex-col lg:flex-row w-full gap-4 sm:gap-8">
                      <div className="flex flex-col space-y-4 sm:space-y-6 lg:w-3/5">
                        <div className="w-full bg-white rounded-xl shadow-md p-3 sm:p-6 transition-all duration-300 hover:shadow-lg border border-gray-200">
                          <h3 className="text-base sm:text-lg font-semibold text-[#12153D] mb-3 sm:mb-4">Long-Tail Keywords</h3>
                          <KeywordContainer className="min-h-[250px] sm:min-h-[350px]" keywordData={keywordData} />
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
                                Long-Tail Keywords
                              </span>{" "}
                              are specific, longer search phrases that users type when they're closer to making a purchase or when they're looking for precise information.
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
                        <div className="w-full sm:w-[300px] h-[180px] sm:h-[250px] bg-gray-100 rounded-xl shadow-sm flex justify-center items-center border border-gray-200">
                          <h1 className="text-sm sm:text-lg font-bold text-gray-400">
                            VIDEO AD
                          </h1>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#12153d] text-white mt-6 p-4 rounded-md text-center lg:text-left">
                      <p className="text-xs sm:text-base">
                        To find more information and get more insights, check out{" "}
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

export default LongTailKeywordPage;