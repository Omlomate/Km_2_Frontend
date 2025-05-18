import React, { useState, useEffect } from "react";

const IndicatorScale = ({ 
  value = 0, 
  min = 0, 
  max = 1, 
  showPercentage = true,
  color = "orange",
  darkMode = true,
  showLabels = true
}) => {
  const [animatedValue, setAnimatedValue] = useState(value);
  
  // Map value to 0-100 range with proper clamping
  const normalizeValue = (val) => {
    const clampedValue = Math.min(Math.max(min, val), max);
    return ((clampedValue - min) / (max - min)) * 100;
  };
  
  const percentage = normalizeValue(animatedValue);
  
  // More accurate positioning - no arbitrary limits
  // This keeps the circle centered exactly where it should be
  const markerPosition = percentage;
  
  // Determine color schemes based on theme
  const colors = {
    orange: {
      primary: darkMode ? "bg-orange-500" : "bg-orange-600",
      secondary: darkMode ? "bg-orange-500/50" : "bg-orange-300",
      text: darkMode ? "text-orange-400" : "text-orange-700",
      border: darkMode ? "border-orange-500" : "border-orange-600",
      fill: darkMode ? "#f97316" : "#ea580c", // orange-500 or orange-600
      stroke: darkMode ? "#fff" : "#f8fafc",  // white or slate-50
    },
    blue: {
      primary: darkMode ? "bg-blue-500" : "bg-blue-600",
      secondary: darkMode ? "bg-blue-500/50" : "bg-blue-300",
      text: darkMode ? "text-blue-400" : "text-blue-700",
      border: darkMode ? "border-blue-500" : "border-blue-600",
      fill: darkMode ? "#3b82f6" : "#2563eb", // blue-500 or blue-600
      stroke: darkMode ? "#fff" : "#f8fafc",  // white or slate-50
    },
    green: {
      primary: darkMode ? "bg-green-500" : "bg-green-600",
      secondary: darkMode ? "bg-green-500/50" : "bg-green-300",
      text: darkMode ? "text-green-400" : "text-green-700",
      border: darkMode ? "border-green-500" : "border-green-600",
      fill: darkMode ? "#22c55e" : "#16a34a", // green-500 or green-600
      stroke: darkMode ? "#fff" : "#f8fafc",  // white or slate-50
    }
  };
  
  const selectedColor = colors[color] || colors.orange;
  const bgColor = darkMode ? "bg-gray-800" : "bg-white";
  const textColor = darkMode ? "text-white" : "text-gray-800";
  
  // Improved animation with better easing
  useEffect(() => {
    if (Math.abs(value - animatedValue) > 0.01) {
      const duration = 300; // ms
      const startTime = Date.now();
      const startValue = animatedValue;
      const endValue = value;
      
      const animateValue = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic function for smoother animation
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        const newValue = startValue + (endValue - startValue) * easedProgress;
        setAnimatedValue(newValue);
        
        if (progress < 1) {
          requestAnimationFrame(animateValue);
        }
      };
      
      requestAnimationFrame(animateValue);
    } else {
      setAnimatedValue(value);
    }
  }, [value]);

  // Calculate accurate positions for tick marks and labels
  const getTickPosition = (tickValue) => {
    return normalizeValue(tickValue);
  };

  return (
    <div className={`w-full max-w-md mx-auto p-3 py-10 rounded-lg ${bgColor} shadow-lg`}>
      {/* Percentage display with actual value instead of percentage */}
      {showPercentage && (
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-medium ${selectedColor.text}`}>Progress</span>
          {/* <div className="flex flex-col items-end">
            <span className={`text-xl font-bold ${textColor}`}>
              {animatedValue.toFixed(max >= 100 ? 0 : 1)}
            </span>
            <span className={`text-xs ${textColor} opacity-70`}>
              {percentage.toFixed(1)}%
            </span>
          </div> */}
        </div>
      )}
      
      <div className="relative flex items-center py-6">
        {/* Base track */}
        <div className={`w-full h-1.5 rounded-full ${selectedColor.secondary} shadow-inner`} />
        
        {/* Progress track with proper z-index */}
        <div
          className={`absolute left-0 h-1.5 rounded-full ${selectedColor.primary} transition-all duration-300 shadow-sm z-10`}
          style={{ width: `${percentage}%` }}
        />
        
        {/* Indicator marker with no arbitrary position adjustments */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-20"
          style={{ left: `${markerPosition}%`, top: "50%" }}
        >
          <div className={`absolute -inset-1 rounded-full ${selectedColor.secondary} animate-pulse opacity-70`}></div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-md relative"
          >
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              fill={selectedColor.fill} 
              stroke={selectedColor.stroke}
              strokeWidth="2"
            />
            <circle 
              cx="12" 
              cy="12" 
              r="4" 
              fill={selectedColor.stroke}
            />
          </svg>
        </div>
        
        {/* Dynamically positioned tick marks based on the actual scale */}
        {[min, min + ((max - min) * 0.25), min + ((max - min) * 0.5), min + ((max - min) * 0.75), max].map((tick, index) => {
          const tickPosition = getTickPosition(tick);
          return (
            <div 
              key={index}
              className={`absolute h-3 w-0.5 ${tickPosition <= percentage ? selectedColor.primary : 'bg-gray-400'} rounded-full z-0`}
              style={{ left: `${tickPosition}%`, top: "50%", transform: "translateY(-50%)" }}
            />
          );
        })}
        
        {/* Start and end points with accurate positioning */}
        {showLabels && (
          <>
            <div className="absolute left-0 -bottom-8 flex flex-col items-start">
              <span className={`text-sm font-semibold ${textColor}`}>
                {Number(min).toFixed(max >= 100 ? 0 : 1)}
              </span>
            </div>
            
            <div className="absolute -bottom-8 flex flex-col items-center"
                 style={{ left: `${getTickPosition(min + ((max - min) * 0.25))}%`, transform: "translateX(-50%)" }}>
              <span className={`text-sm font-medium ${textColor} opacity-70`}>
                {Number(min + ((max - min) * 0.25)).toFixed(max >= 100 ? 0 : 1)}
              </span>
            </div>
            
            <div className="absolute -bottom-8 flex flex-col items-center"
                 style={{ left: `${getTickPosition(min + ((max - min) * 0.5))}%`, transform: "translateX(-50%)" }}>
              <span className={`text-sm font-medium ${textColor} opacity-70`}>
                {Number(min + ((max - min) * 0.5)).toFixed(max >= 100 ? 0 : 1)}
              </span>
            </div>
            
            <div className="absolute -bottom-8 flex flex-col items-center"
                 style={{ left: `${getTickPosition(min + ((max - min) * 0.75))}%`, transform: "translateX(-50%)" }}>
              <span className={`text-sm font-medium ${textColor} opacity-70`}>
                {Number(min + ((max - min) * 0.75)).toFixed(max >= 100 ? 0 : 1)}
              </span>
            </div>
            
            <div className="absolute right-0 -bottom-8 flex flex-col items-end">
              <span className={`text-sm font-semibold ${textColor}`}>
                {Number(max).toFixed(max >= 100 ? 0 : 1)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IndicatorScale;