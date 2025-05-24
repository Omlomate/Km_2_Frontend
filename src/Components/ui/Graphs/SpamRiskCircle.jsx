import React, { useEffect, useState } from "react";

// Spam score data with categories and descriptions based on the image
const SPAM_SCORE_DATA = {
  1: { category: "Natural & Trusted", description: "This keyword is completely natural and widely used in genuine content. It has no signs of manipulation or overuse, making it perfectly safe for SEO." },
  2: { category: "Highly Organic", description: "This keyword is used in a natural way with minimal SEO optimization. There are no spam signals detected, and it is safe to include in your content." },
 3: { category: "Mostly Safe", description: "The keyword is slightly optimized but still considered safe. There’s no significant risk of spam, and it should perform well in search rankings." },
  4: { category: "Moderately Optimized", description: "This keyword is being optimized, but still within reasonable limits. It’s fine for SEO, but excessive use could slightly impact readability." },
  5: { category: "Mildly Overused", description: "The keyword appears somewhat frequently in content, which may raise minor red flags for search engines. Ensure it is used in a balanced way." },
  6: { category: "Aggressively Optimized", description: "The keyword is being repeated more than necessary, making the content look heavily SEO-driven. Consider reducing its usage for better rankings." },
  7: { category: "Borderline Spammy", description: "The keyword is used excessively and may be perceived as keyword stuffing. Search engines could start reducing rankings if overused." },
  8: { category: "Spam-Prone", description: "This keyword is over-optimized and frequently flagged in low-quality content. Its misuse could lead to lower rankings or content devaluation." },
  9: { category: "Heavily Manipulated", description: "The keyword shows clear signs of spam tactics. Search engines may already be suppressing results for pages that use it excessively." },
  10: { category: "Toxic & Blacklisted", description: "This keyword is heavily spammed across the web and is often associated with black-hat SEO tactics. Using it could result in penalties or deindexing." }
};

const SpamRiskCircle = ({ percentage, onDataChange }) => {
  const firstDigit = percentage ? String(percentage).charAt(0) : '0';
  const displayPercentage = parseInt(firstDigit, 10);
  const scaledPercentage = displayPercentage * 10;
  
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  // Get colors based on score level
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
  
  // Updated to return category and description
  const getRiskText = () => {
    return SPAM_SCORE_DATA[displayPercentage] || { category: "Unknown", description: "No description available for this score." };
  };
  
  const { category, description } = getRiskText();
  
  // Notify parent about the category and description
  useEffect(() => {
    if (onDataChange) {
      onDataChange({ category, description });
    }
  }, [category, description, onDataChange]);

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
          <p className="text-sm font-medium mt-1 mb-1" style={{ color: colors.main }}>{category}</p>
          {/* <p className="text-xs font-medium text-gray-600 px-2">{description}</p> */}
        </div>
      </div>
    </div>
  );
};

export default SpamRiskCircle;