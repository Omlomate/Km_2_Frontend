import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Loader = () => {
  return (
    <div>
      <div className="flex items-center justify-center w-full h-full py-8">
        <div className="relative">
          <div className="relative w-32 h-32">
            <div className="absolute w-full h-full rounded-full border-[3px] border-gray-100/10 border-r-[#12153D] border-b-[#12153D] animate-spin" style={{ animationDuration: "3s" }}></div>
            <div className="absolute w-full h-full rounded-full border-[3px] border-gray-100/10 border-t-[#E5590F] animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse" }}></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-[#12153D]/20 via-transparent to-[#E5590F]/15 animate-pulse rounded-full blur-sm"></div>
        </div>
      </div>
      {/* <DotLottieReact
        src="https://lottie.host/81dca7af-afc5-4fda-a629-2cbef62173b2/DqQvljk9ii.lottie"
        loop
        autoplay
      /> */}
    </div>
  );
};

export default Loader;
