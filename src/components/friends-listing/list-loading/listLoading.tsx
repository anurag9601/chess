import React from "react";

const ListLoading = () => {
  return (
    <div className="flex-1 flex flex-col items-start justify-start gap-[10px] h-full w-full overflow-y-auto custom-scrollbar">
      <div className="flex items-start justify-between gap-[10px] w-full bg-[#f9f6ed] p-[10px] rounded-md blink-loading-animation">
        <div className="flex items-center justify-center gap-[10px]">
          <div className="h-[25px] w-[25px] rounded-full bg-[#888883]"></div>
          <p className="h-[16px] w-[100px] bg-[#888883] rounded-md"></p>
        </div>
        <button className="bg-[#888883] h-[28px] w-[80px] rounded-lg cursor-pointer">
        </button>
      </div>
      <div className="flex items-start justify-between gap-[10px] w-full bg-[#f9f6ed] p-[10px] rounded-md blink-loading-animation">
        <div className="flex items-center justify-center gap-[10px]">
          <div className="h-[25px] w-[25px] rounded-full bg-[#888883]"></div>
          <p className="h-[16px] w-[100px] bg-[#888883] rounded-md"></p>
        </div>
        <button className="bg-[#888883] h-[28px] w-[80px] rounded-lg cursor-pointer">
        </button>
      </div>
      <div className="flex items-start justify-between gap-[10px] w-full bg-[#f9f6ed] p-[10px] rounded-md blink-loading-animation">
        <div className="flex items-center justify-center gap-[10px]">
          <div className="h-[25px] w-[25px] rounded-full bg-[#888883]"></div>
          <p className="h-[16px] w-[100px] bg-[#888883] rounded-md"></p>
        </div>
        <button className="bg-[#888883] h-[28px] w-[80px] rounded-lg cursor-pointer">
        </button>
      </div>
    </div>
  );
};

export default ListLoading;
