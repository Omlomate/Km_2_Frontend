import React, { useEffect, useState } from "react";

const SpamRiskCircle = ({ percentage, description }) => {
  const firstDigit = percentage ? String(percentage).charAt(0) : '0';
  const displayPercentage = parseInt(firstDigit, 10);
  const scaledPercentage = displayPercentage * 10;
  
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  // Get colors based on risk level
  const getColors = () => {
    if (displayPercentage <= 3) {
      return {
        main: "#22C55E",     // green-500
        background: "#BBF7D0" // green-200
      };
    } else if (displayPercentage <= 6) {
      return {
        main: "#F59E0B",     // amber-500
        background: "#FDE68A" // amber-200
      };
    } else {
      return {
        main: "#EF4444",     // red-500
        background: "#FECACA" // red-200
      };
    }
  };

  const colors = getColors();
  
  const getRiskText = () => {
    if (displayPercentage <= 3) return "Low";
    if (displayPercentage <= 6) return "Medium";
    return "High";
  };
  
  const riskText = getRiskText();
  
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
          <defs>
            <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.background} stopOpacity="0.6" />
              <stop offset="100%" stopColor={colors.background} stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.main} />
              <stop offset="100%" stopColor={`${colors.main}99`} />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          <circle
            strokeWidth="12"
            stroke="url(#circleGradient)"
            fill="transparent"
            r="50"
            cx="60"
            cy="60"
            className="opacity-70"
          />
          
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
        
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-bold transition-all duration-300" style={{ color: colors.main }}>
            {firstDigit}
          </span>
          <p className="text-sm font-medium mt-1 mb-1" style={{ color: colors.main }}>{riskText} Risk</p>
          <p className="text-xs font-medium text-gray-600 px-2">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default SpamRiskCircle;
