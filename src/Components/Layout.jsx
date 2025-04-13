import React from "react";
import Sidepanel from "./SidePanel/sidePanel";
// import Navbar from "./Navbar/navbar";

const Layout = ({ children }) => {
  return (
    <div className="layout min-h-screen">
      {/* <Navbar /> */}
      <div className="flex flex-col md:flex-row w-full h-full mt-4">
        <Sidepanel className="h-screen" />
        {/* <Sidepanel className="hidden md:block" /> */}
        <div className="w-full max-w-5xl flex flex-col justify-between items-center pb-16 md:pb-0 px-4 md:px-8 md:pl-30">
          {children}
        </div>
        {/* <div className="hidden md:block p-4 ml-4">ADS</div> */}
      </div>
    </div>
  );
};

export default Layout;
