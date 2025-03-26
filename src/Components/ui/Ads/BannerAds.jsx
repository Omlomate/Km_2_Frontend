import React from 'react';

const BannerAds = () => {
  return (
    <div className="w-full h-[220px] xs:h-[250px] sm:h-[280px] md:h-[340px] sm:w-[95%] md:w-[895px] mx-auto">
      <div
        className="grid bg-[url('/src/assets/bgimage.png')] bg-cover bg-center p-2 sm:p-4 md:p-15 rounded-lg text-white mx-auto w-full h-full"
        style={{ fontFamily: "Space Grotesk, sans-serif" }}
      >
        <div className="p-1 xs:p-2 sm:p-4">
          <div className="flex justify-center items-center p-1 xs:p-2 sm:p-4 min-w-12">
            <h1 className="text-sm xs:text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-wantedSans">
              ADS
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerAds;
