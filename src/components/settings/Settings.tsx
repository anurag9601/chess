"use client";

import { MusicContext } from "@/context/music.context";
import React, { useContext, useEffect, useState } from "react";

interface I {
  settingOpen: boolean;
  homeOpen: boolean;
}

const Settings = () => {
  const { controller, setController } = useContext(MusicContext);

  const [windows, setWindows] = useState<I>({
    settingOpen: false,
    homeOpen: false,
  });

  function toggleWindow(window: "settingOpen" | "homeOpen") {
    setWindows((prev) => ({
      ...prev,
      [window]: !prev[window],
    }));
  }

  function togglecontroller(opertaioncontroller: "music" | "sound") {
    setController((prev) => ({
      ...prev,
      [opertaioncontroller]: !prev[opertaioncontroller],
    }));
  }

  return (
    <>
      {windows.settingOpen && (
        <div
          className="absolute inset-0 bg-black/70 flex items-center justify-center"
          onClick={() => {
            toggleWindow("settingOpen");
          }}
        >
          <div
            className="flex flex-col items-center justify-center gap-[15px] px-[20px] py-[20px] border-[1px] border-[#f7f2eb] bg-[#2e2e2e] min-w-[250px] relative"
            onClick={(e: React.MouseEvent<HTMLDivElement>) =>
              e.stopPropagation()
            }
          >
            <div
              className="absolute top-0 right-0 border-[1px] border-[#f6f2ec] text-[#f6f2ec] w-[30px] h-[30px] flex items-center justify-center font-[700] cursor-pointer bg-[#626262]"
              onClick={() => toggleWindow("settingOpen")}
              data-click-sound
            >
              &#10005;
            </div>
            <h1 className="text-[30px] font-[900] text-[#f6f2ec]">Settings</h1>
            <div className="w-[100%] h-[3px] bg-[#141414] rounded-lg"></div>
            <div className="flex items-center justify-center gap-[30px]">
              <div className="flex flex-col items-center gap-[5px]">
                <div
                  className={`border-[2px] border-[#888683] px-[10px] py-[10px] cursor-pointer ${
                    controller.music && "bg-[#f4f4f4]"
                  }`}
                  onClick={() => togglecontroller("music")}
                  data-click-sound
                >
                  <img
                    src="./images/music.png"
                    alt="music"
                    className="h-[30px] w-[30px]"
                  />
                </div>
                <p className="text-[14px] font-[700] text-[#898784]">Music</p>
              </div>
              <div className="flex flex-col items-center gap-[5px]">
                <div
                  className={`border-[2px] border-[#888683] px-[10px] py-[10px] cursor-pointer ${
                    controller.sound && "bg-[#f4f4f4]"
                  }`}
                  onClick={() => togglecontroller("sound")}
                  data-click-sound
                >
                  <img
                    src="./images/sound.png"
                    alt="music"
                    className="h-[30px] w-[30px]"
                  />
                </div>
                <p className="text-[14px] font-[700] text-[#898784]">Sound</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-items items-top justify-top max-h-screen h-[500px]">
        <div className="flex gap-[40px]">
          <button
            className="h-[50px] w-[50px] border-[1px] border-[#888883] rounded-md flex items-center justify-center cursor-pointer hover:bg-[#f9f6ed] transition-all duration-100"
            onClick={() => toggleWindow("homeOpen")}
            data-click-sound
          >
            <img
              src="./images/home.png"
              alt="home"
              className="h-[25px] w-[25px]"
            />
          </button>
          <button
            className="h-[50px] w-[50px] border-[1px] border-[#888883] rounded-md flex items-center justify-center cursor-pointer hover:bg-[#f9f6ed] transition-all duration-100"
            onClick={() => toggleWindow("settingOpen")}
            data-click-sound
          >
            <img
              src="./images/setting.png"
              alt="setting"
              className="h-[25px] w-[25px]"
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default Settings;
