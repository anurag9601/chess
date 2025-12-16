"use client";

import React from "react";

const Settings = () => {
  return (
    <>
      {/* <div className="absolute inset-0 bg-black/70"></div> */}
      <div className="flex flex-items items-top justify-top max-h-screen h-[500px]">
        <div className="flex gap-[40px]">
          <div className="h-[50px] w-[50px] border-[1px] border-[#888883] rounded-md flex items-center justify-center cursor-pointer hover:bg-[#f9f6ed] transition-all duration-100">
            <img
              src="./images/home.png"
              alt="home"
              className="h-[25px] w-[25px]"
            />
          </div>
          <div className="h-[50px] w-[50px] border-[1px] border-[#888883] rounded-md flex items-center justify-center cursor-pointer hover:bg-[#f9f6ed] transition-all duration-100">
            <img
              src="./images/setting.png"
              alt="setting"
              className="h-[25px] w-[25px]"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
