import React, { useState } from "react";

const KeywordContainer = ({ keywordData }) => {
  const [selectedEngine, setSelectedEngine] = useState("Google");

  const handleEngineChange = (event) => {
    setSelectedEngine(event.target.value);
  };

  return (
    <>
      <div className="w-full mx-auto">
        <div className="w-full max-w-full sm:max-w-[95%] md:max-w-[26rem] mx-auto md:mx-0">
          <div
            className="w-full h-full min-h-[15rem] sm:h-[20rem] lg:h-auto border border-gray-500 p-2 sm:p-3 md:p-4 rounded-lg"
            id="longTail"
          >
            <div className="p-2 sm:p-4 shadow-lg rounded-lg">
              <h1 className="text-sm sm:text-base md:text-lg font-bold">
                {keywordData.relatedKeywords?.length || 0} Result for{" "}
                {keywordData.keyword}
              </h1>
            </div>
            <ol className="p-2 sm:p-4 max-h-[300px] sm:max-h-[400px] md:max-h-[604px] overflow-y-auto">
              {keywordData.relatedKeywords?.map((item, index) => (
                <li key={index} className="p-1 sm:p-1.5 text-xs sm:text-sm md:text-base">
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default KeywordContainer;
