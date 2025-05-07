import React from "react";
import Sidepanel from "./SidePanel/sidePanel";
// import Navbar from "./Navbar/navbar";

const Layout = ({ children }) => {
  return (
    <div className="layout min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      <div className="flex flex-col md:flex-row w-full min-h-screen px-2 sm:px-4 md:px-6 gap-4 md:gap-6">
        {/* Sidebar - Hidden on extra small screens, collapsible on small screens */}
        <aside className="w-full sm:w-auto md:sticky md:top-6 md:self-start order-2 md:order-1">
          <Sidepanel className="h-auto md:h-screen shadow-md rounded-lg overflow-hidden" />
        </aside>
        
        {/* Main Content - Full width on mobile, centered on larger screens */}
        <main className="flex-1 flex flex-col justify-between pb-8 md:pb-6 order-1 md:order-2 min-w-0">
          {children}
        </main>
        
        {/* Advertisement Section - Horizontal on mobile, vertical on desktop */}
        <aside className="w-full md:w-auto flex justify-center md:sticky md:top-6 md:h-screen md:flex-col md:self-start mb-6 md:mb-0 order-3">
          <div className="w-full max-w-[320px] md:max-w-none md:w-[160px] h-[180px] sm:h-[250px] md:h-[600px] bg-white rounded-lg flex items-center justify-center text-gray-400 font-medium sticky top-6">
            ADS
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Layout;
