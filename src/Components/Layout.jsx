import React, { useEffect, useState } from "react";

import Sidepanel from "./SidePanel/sidePanel";
// import Navbar from "./Navbar/navbar";

const Layout = ({ children }) => {
  const [adData, setAdData] = useState(null);

  useEffect(() => {
    // Simulating fetching data from an ad script
    const fetchAdData = async () => {
      try {
        // Example: Loading a script dynamically
        const script = document.createElement("script");
        script.src = "https://your-ad-provider.com/ad-script.js"; // Replace with your actual script URL
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          // Simulating ad data retrieval after script loads
          const adInfo = window.adData || {
            image: "your-banner-image.jpg",
            link: "https://your-ad-link.com",
          };
          setAdData(adInfo);
        };
      } catch (error) {
        console.error("Error loading ad script:", error);
      }
    };

    fetchAdData();
  }, []);

  return (
    <div className="layout min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      <div className="flex flex-col md:flex-row w-full min-h-screen  sm:px-4 md:px-6 lg:px-8 gap-3 sm:gap-4 md:gap-5 lg:gap-6 py-3 sm:py-4 md:py-5 lg:py-6">
        {/* Sidebar - Enhanced for all device types */}
        <aside className="w-full xs:w-full sm:w-60 md:w-64 lg:w-72 md:sticky md:top-6 md:self-start md:order-1 mb-3 sm:mb-0  h-auto rounded-lg overflow-hidden">
          <Sidepanel className="h-auto md:h-screen shadow-md rounded-lg overflow-hidden" />
        </aside>

        {/* Main Content - Responsive for all devices */}
        <main className="flex-1 flex flex-col justify-between pb-4 sm:pb-6 md:pb-6 lg:pb-8 order-1 md:order-2 min-w-0 w-full sm:w-[calc(100%-240px)] md:w-[calc(100%-260px)] lg:w-[calc(100%-288px)] rounded-lg">
          <div className="w-full h-full p-2  lg:p-5">
            {children}
          </div>
        </main>

        {/* Advertisement Section - Responsive for all devices */}
        {/* Uncomment and use if needed */}
        {/* <aside className="w-full xs:hidden sm:hidden md:flex lg:flex md:w-auto justify-center md:sticky md:top-6 md:h-screen md:flex-col md:self-start mb-4 sm:mb-0 order-3">
          <div className="w-full max-w-[300px] sm:max-w-[250px] md:max-w-none md:w-[160px] lg:w-[180px] xl:w-[200px] h-[120px] sm:h-[180px] md:h-[600px] bg-backdrop-blur rounded-lg flex items-center justify-center text-gray-400 font-medium sticky top-6">
            <div className="banner-container w-full h-full overflow-hidden rounded-lg">
              {adData ? (
                <a href={adData.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                  <img src={adData.image} alt="Ad Banner" className="banner w-full h-full object-contain" />
                </a>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm sm:text-base">Loading Ad...</p>
                </div>
              )}
            </div>
          </div>
        </aside> */}
      </div>
    </div>
  );
};

export default Layout;
