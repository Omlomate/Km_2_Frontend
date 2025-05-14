import React, { useEffect, useState } from "react";

const SpamRiskCircle = ({ percentage, description }) => {
  // Extract only the first digit if percentage is a string or number
  const firstDigit = percentage ? String(percentage).charAt(0) : '0';
  
  // Convert to number for calculations (between 0-9)
  const displayPercentage = parseInt(firstDigit, 10);
  
  // Scale the single digit to a percentage for the circle (0-9 to 0-100%)
  const scaledPercentage = displayPercentage * 10; // 0-90%
  
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);
  
  // Use the brand color #E5590F instead of dynamic colors
  const brandColor = "#E5590F";
  
  // Get risk text based on percentage
  const getRiskText = () => {
    if (displayPercentage <= 3) return "Low";
    if (displayPercentage <= 6) return "Medium";
    return "High";
  };
  
  const riskText = getRiskText();
  
  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (scaledPercentage / 100) * circumference);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [scaledPercentage, circumference]);

  return (
    <div className="w-full max-w-xs mx-auto transition-all duration-300 hover:scale-105">
      <div className="relative flex items-center justify-center">
        <svg
          className="transform -rotate-90 drop-shadow-md"
          width="200"
          height="200"
          viewBox="0 0 120 120"
        >
          {/* Background gradient */}
          <defs>
            <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFC5A6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFC5A6" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={brandColor} />
              <stop offset="100%" stopColor={`${brandColor}99`} />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Background circle */}
          <circle
            strokeWidth="12"
            stroke="url(#circleGradient)"
            fill="transparent"
            r="50"
            cx="60"
            cy="60"
            className="opacity-70"
          />
          
          {/* Progress circle with animation */}
          <circle
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            stroke="url(#progressGradient)"
            fill="transparent"
            r="50"
            cx="60"
            cy="60"
            strokeLinecap="round"
            filter="url(#glow)"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-bold transition-all duration-300" style={{ color: brandColor }}>
            {firstDigit}
          </span>
          <p className="text-sm font-medium mt-1 mb-1" style={{ color: "#12153D" }}>{riskText} Risk</p>
          <p className="text-xs font-medium text-gray-600 px-2">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default SpamRiskCircle;
