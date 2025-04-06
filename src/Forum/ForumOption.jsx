import React, { useState } from 'react';

const ForumOption = () => {
  const [sortOpen, setSortOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [sortOption, setSortOption] = useState('Newest');
  const [timeOption, setTimeOption] = useState('All Time');

  return (
    <div className="flex flex-col space-y-3 w-full max-w-xs">
      {/* Profile Edit Button */}
      <button className="flex items-center space-x-3 bg-indigo-950 text-white py-3 px-4 rounded-lg">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
          {/* <img 
            src="/avatar-placeholder.png" 
            alt="Profile" 
            className="w-7 h-7 rounded-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/28?text=User";
            }}
          /> */}
        </div>
        <span className="font-medium">Edit Profile</span>
      </button>

      {/* Sort Dropdown */}
      <div className="relative">
        <button 
          className="flex items-center justify-between w-full bg-indigo-950 text-white py-3 px-4 rounded-lg"
          onClick={() => setSortOpen(!sortOpen)}
        >
          <span>Sort: {sortOption}</span>
          <svg 
            className={`w-5 h-5 transition-transform ${sortOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {sortOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {['Newest', 'Oldest', 'Most Popular', 'Most Commented'].map((option) => (
              <button 
                key={option}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setSortOption(option);
                  setSortOpen(false);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Time Filter Dropdown */}
      <div className="relative">
        <button 
          className="flex items-center justify-between w-full bg-indigo-950 text-white py-3 px-4 rounded-lg"
          onClick={() => setTimeOpen(!timeOpen)}
        >
          <span>{timeOption}</span>
          <svg 
            className={`w-5 h-5 transition-transform ${timeOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {timeOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {['All Time', 'Today', 'This Week', 'This Month', 'This Year'].map((option) => (
              <button 
                key={option}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setTimeOption(option);
                  setTimeOpen(false);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ad Space */}
      <div className="bg-gray-200 w-[255px] h-[570px] rounded-lg flex items-center justify-center text-gray-500 font-medium">
        AD
      </div>
    </div>
  );
};

export default ForumOption;
