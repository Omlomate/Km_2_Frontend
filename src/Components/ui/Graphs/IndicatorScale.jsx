import React from "react";

const IndicatorScale = ({ value = 0 }) => {
  const clampedValue = Math.min(Math.max(0, value), 1);
  const percentage = clampedValue * 100;

  return (
    <div className="w-full mt-4 max-w-md mx-auto p-4">
      <div className="relative flex items-center">
        {/* Base dotted line */}
        <div className="w-full h-[2px] border-t-2 border-dashed border-orange-500/50" />

        {/* Solid progress line */}
        <div
          className="absolute left-0 h-[2px] bg-orange-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
        
        {/* Indicator marker */}
        <div 
          className="absolute transform -translate-x-1/2 transition-all duration-300"
          style={{ left: `${percentage}%` }}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 34" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M22.5 11.9459C22.5 15.2119 20.8275 19.117 18.6041 22.8045C16.4114 26.441 13.8217 29.6432 12.2656 31.4504C12.1823 31.5472 12.0865 31.581 12 31.581C11.9135 31.581 11.8177 31.5472 11.7344 31.4504C10.1783 29.6432 7.58855 26.441 5.39592 22.8045C3.17246 19.117 1.5 15.2119 1.5 11.9459C1.5 7.53935 2.75029 5.04432 4.47601 3.60364C6.25563 2.11797 8.83618 1.5 12 1.5C15.1638 1.5 17.7444 2.11797 19.524 3.60364C21.2497 5.04432 22.5 7.53935 22.5 11.9459Z" 
              fill="#12153D" 
              stroke="#E5590F" 
              strokeWidth="3"
            />
          </svg>
        </div>

        {/* Start point */}
        <div className="absolute left-0 -translate-x-1/2 flex items-center">
          <span className="mr-2 text-2xl font-bold text-white">
            0
          </span>
          <div className="w-4 h-4 bg-orange-500 rounded-full" />
        </div>

        {/* End point */}
        <div className="absolute right-0 translate-x-1/2 flex items-center">
          <div className="w-4 h-4 bg-orange-500 rounded-full" />
          <span className="ml-2 text-2xl font-bold text-white">
            1
          </span>
        </div>
      </div>
    </div>
  );
};

export default IndicatorScale;
