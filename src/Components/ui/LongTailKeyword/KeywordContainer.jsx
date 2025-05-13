import React, { useState } from "react";
import PropTypes from "prop-types";

const KeywordContainer = ({ keywordData, className, maxHeight, title }) => {
  const [selectedEngine, setSelectedEngine] = useState("Google");

  const handleEngineChange = (event) => {
    setSelectedEngine(event.target.value);
  };

  // Handle case where keywordData is undefined or missing properties
  const keyword = keywordData?.keyword || "";
  const relatedKeywords = keywordData?.relatedKeywords || [];
  const resultCount = relatedKeywords.length || 0;

  return (
    <div className={`w-full mx-auto ${className || ""}`}>
      <div className="w-full max-w-full sm:max-w-[95%] md:max-w-full lg:max-w-full mx-auto md:mx-0">
        <div
          className="w-full h-full min-h-[15rem] sm:min-h-[18rem] md:min-h-[20rem] lg:h-auto border border-gray-500 p-2 sm:p-3 md:p-4 lg:p-5 rounded-lg"
          id="longTail"
        >
          <div className="p-2 sm:p-3 md:p-4 shadow-lg rounded-lg">
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold">
              {title || `${resultCount} Result for ${keyword}`}
            </h1>
          </div>
          <ol
            className="p-2 sm:p-3 md:p-4 overflow-y-auto"
            style={{
              maxHeight: maxHeight || "250px",
              height: "calc(100% - 60px)",
            }}
          >
            {relatedKeywords.length > 0 ? (
              relatedKeywords.map((item, index) => (
                <li
                  key={index}
                  className="p-1 sm:p-1.5 md:p-2 text-xs sm:text-sm md:text-base lg:text-base"
                >
                  {item}
                </li>
              ))
            ) : (
              <li className="p-2 text-sm text-gray-500">No keywords found</li>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
};

// Add prop validation
KeywordContainer.propTypes = {
  keywordData: PropTypes.shape({
    keyword: PropTypes.string,
    relatedKeywords: PropTypes.arrayOf(PropTypes.string),
  }),
  className: PropTypes.string,
  maxHeight: PropTypes.string,
  title: PropTypes.string,
};

// Default props
KeywordContainer.defaultProps = {
  keywordData: { keyword: "", relatedKeywords: [] },
  className: "",
  maxHeight: null,
  title: null,
};

export default KeywordContainer;
