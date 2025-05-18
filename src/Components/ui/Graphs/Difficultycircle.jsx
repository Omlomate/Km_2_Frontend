import React from "react";

const DifficultyCircle = ({
  percentage = 65,
  description = "Intermediate",
  // color = "#E5590F",
  // backgroundColor = "#FFC5A6"
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
  const getColor = (percentage) => {
    if (percentage < 33) {
      return {
        main: "#22C55E", // green-500
        background: "#BBF7D0" // green-200
      };
    } else if (percentage < 66) {
      return {
        main: "#e5e600", // yellow-500
        background: "#ffffb3" // yellow-200
      };
    } else {
      return {
        main: "#EF4444", // red-500
        background: "#FECACA" // red-200
      };
    }
  };

  const color = getColor(percentage); // Pass the actual percentage prop instead of hardcoded 50

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
            stroke={color.background}
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
            stroke={color.main}
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
        </svg>

        {/* Centered content */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-bold">{percentage}%</span>
        </div>
      </div>

      {/* Description below the circle */}
      <div className="flex items-center gap-2 mt-2">
        <span className={`text-lg font-bold ${getTextColor()}`}>
          {getDifficultyLabel()}
        </span>
      </div>
    </div>
  );
};

export default DifficultyCircle;
