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
            <SearchInput onSearch={handleSearch} />
          </div>
          <div>
            {loading ? (
              <div className="flex justify-center mt-4">
                <Loader />
              </div>
            ) : (
              keywordData && (
                <>
                  <div className="flex flex-col lg:flex-row w-full mt-4">
                    <div className="w-full lg:w-1/2">
                      {keywordData && keywordData.relatedKeywords.length > 0 && (
                        <KeywordContainer keywordData={keywordData} />
                      )}
                    </div>
                    <div className="w-full lg:w-1/2 lg:ml-4 mt-4 lg:mt-0">
                      <div className="p-8 bg-[#12153D] rounded-lg text-white h-75 text-center lg:text-left">
                        <h1 className="text-md lg:text-2xl font-bold mb-2">What is it?</h1>
                        <p className="text-justify">
                          <span className="text-orange-500">Content Ideas</span> are phrases
                          the user searches for when they’re at the end stage of making a
                          purchase.
                        </p>
                      </div>
                      <div className="bg-gray-300 h-71 mt-4 rounded-md flex justify-center items-center">
                        <h1 className="text-md lg:text-2xl font-bold">AD</h1>
                      </div>
                    </div>
                    <div className="bg-gray-300 h-150 p-14 ml-4 rounded-md flex justify-center items-center">
                      <h1 className="text-md lg:text-2xl font-bold">AD</h1>
                    </div>
                  </div>
                  <div className="bg-[#12153d] text-white mt-4 p-4 rounded-md text-center lg:text-left">
                    <p className="text-md lg:text-lg">
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
    </>
  );
};

export default LongTailKeywordPage;