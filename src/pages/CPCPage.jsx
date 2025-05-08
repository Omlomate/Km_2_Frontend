import React, { useState, useEffect } from "react"; // Added useEffect
import { Helmet } from "react-helmet"; // Import Helmet
import BannerAds from "../Components/ui/Ads/BannerAds.jsx";
import SearchInput from "../Components/ui/KeywordInput/SearchInput.jsx";
import Loader from "../Components/Loading/Loader.jsx";
import CountrySelect from "../Components/ui/KeywordInput/CountrySelect.jsx";
import SelectCurrency from "../Components/ui/KeywordInput/SelectCurrency.jsx";

export const CPCPage = () => {
  const [keywordData, setKeywordData] = useState(null);
  const [loadingState, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState({ symbol: "$" });
  const [metaTags, setMetaTags] = useState({ title: "", description: "" }); // State for meta tags

  // Fetch meta tags for the CPC page
  useEffect(() => {
    const fetchMetaTags = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/meta/cpc`
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
          title: "CPC - Keyword Raja",
          description:
            "Calculate Cost Per Click (CPC) with Keyword Raja to optimize your ad spend.",
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

  const handleCountryChange = (country) => {
    setSelectedCountry(country.apiReference);
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency({ symbol: currency.symbol });
  };

  const handleSearch = async (searchTerm) => {
    console.log("Searching for:", searchTerm);
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/keywords/keyword-Everywhere-Volume`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            keywords: [searchTerm],
            country: selectedCountry,
            currency: selectedCurrency.symbol,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch data");

      console.log("selectedCurrency:", selectedCurrency);
      console.log("selectedCountry:", selectedCountry);

      const result = await response.json();
      console.log("Search result:", result);
      setKeywordData(result);
    } catch (error) {
      console.error("Error fetching keyword data:", error);
      setKeywordData(null);
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
          {/* Header */}
          <div className="w-full py-3 sm:py-6">
            <div className=" ">
              <h1 className="text-xl sm:text-3xl md:text-5xl font-bold text-center text-[#12153D] mb-2 sm:mb-4 animate-slideDown">
                Cost <span className="text-[#E5590F]">Per Click</span>{" "}
                Calculator
              </h1>
              <p className="text-xs sm:text-base md:text-lg text-gray-600 text-center max-w-2xl mx-auto mb-4 sm:mb-8 animate-slideUp">
                Find out how much advertisers pay per click for a keyword,
                helping you spot keywords with strong earning potential.{" "}
              </p>
            </div>
          </div>
          {/* Search Input */}
          <div className="w-full max-w-3xl mx-auto">
            <div className="transition-all duration-300 p-3 sm:p-6 rounded-xl bg-white   border border-gray-100">
              <SearchInput
                onSearch={handleSearch}
                onCountryChange={handleCountryChange}
                onCurrencyChange={handleCurrencyChange}
              />
            </div>
          </div>
          {/* Results */}
          <div className="w-full mt-6 sm:mt-10">
            {loadingState ? (
              <div className="flex flex-col justify-center items-center h-48 sm:h-80 w-full">
                <Loader />
                <p className="mt-3 sm:mt-4 text-xs sm:text-base text-gray-600">
                  Calculating CPC...
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
                        {keywordData?.data?.[0]?.keyword || "Keyword"}
                      </span>
                    </h2>
                    <p className="text-xs sm:text-base text-gray-600 mt-1">
                      CPC and keyword value insights
                    </p>
                  </div>
                  <div className="flex flex-col lg:flex-row w-full gap-4 sm:gap-8">
                    {/* CPC Value Card */}
                    <div className="flex flex-col space-y-4 sm:space-y-6 lg:w-3/5">
                      <div className="w-full bg-white rounded-xl shadow-md p-3 sm:p-6 transition-all duration-300 hover:shadow-lg border border-gray-200 flex flex-col items-center">
                        <h3 className="text-base sm:text-lg font-semibold text-[#12153D] mb-3 sm:mb-4">
                          Cost Per Click
                        </h3>
                        <div className="text-5xl flex text-[#12153d] font-bold font-sans space-x-1 items-center">
                          <span className="p-2">
                            {keywordData?.data?.[0]?.cpc?.currency}
                          </span>
                          <span className="p-2">
                            {keywordData?.data?.[0]?.cpc?.value}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-[#12153d] rounded-xl shadow-md p-4 sm:p-8 text-white text-center lg:text-left">
                        <h3 className="text-lg font-semibold mb-2">
                          CPC for SEO
                        </h3>
                        <p>
                          CPC for SEO depends entirely on your industry and
                          desired ROI. A good CPC allows you to achieve your
                          marketing goals while maintaining a positive ROI.
                        </p>
                      </div>
                      <div className="bg-gray-300 w-full sm:w-[336px] h-[180px] sm:h-[280px] mt-4 rounded-md flex justify-center items-center">
                        <h4 className="text-2xl font-bold">AD</h4>
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
                              CPC
                            </span>{" "}
                            is the highest amount that you're willing to pay for
                            a click on your ad. Your max. CPC is the most you'll
                            be charged for a click, but you'll often be charged
                            less—sometimes much less.
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
                      <a href="#" className="text-[#E5590F]">
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

export default CPCPage;
