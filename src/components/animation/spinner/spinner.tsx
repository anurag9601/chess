import React from "react";

const Spinner = ({ width }: { width: number }) => {
  return (
    <div className="absolute h-full w-full flex items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/40">
      <div
        style={{ width, height: width }}
        className="rounded-full border-[2px] border-black border-t-transparent spinner-loading-animation"
      ></div>
    </div>
  );
};

export default Spinner;
