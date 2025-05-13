import React from "react";
import { ArrowRight } from "lucide-react";

const DifficultyCircle = ({ 
  percentage = 65, 
  description = "Intermediate", 
  color = "#E5590F",
  backgroundColor = "#FFC5A6" 
}) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  
  // Determine text color based on difficulty level
  const getTextColor = () => {
    if (percentage < 33) return "text-green-600";
    if (percentage < 66) return "text-amber-600";
    return "text-red-600";
  };
  
  // Get difficulty label
  const getDifficultyLabel = () => {
    if (percentage < 33) return "Easy";
    if (percentage < 66) return "Medium";
    return "Hard";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center mb-2">
        <svg
          className="transform -rotate-90"
          width="180"
          height="180"
          viewBox="0 0 120 120"
        >
          {/* Background circle */}
          <circle
            strokeWidth="12"
            stroke={backgroundColor}
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
          
          {/* Foreground circle that shows percentage */}
          <circle
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke={color}
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
        </svg>
        
        {/* Centered content */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-bold">{percentage}%</span>
          <span className={`text-sm font-medium ${getTextColor()}`}>{getDifficultyLabel()}</span>
        </div>
      </div>
      
      {/* Description below the circle */}
      <div className="flex items-center gap-2 mt-2">
        <p className="text-lg font-semibold text-gray-800">{getDifficultyLabel()}</p>
        <ArrowRight size={18} className="text-gray-500" />
      </div>
    </div>
  );
};

export default DifficultyCircle;