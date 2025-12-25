"use client";

import { UserContext } from "@/context/User.context";
import Link from "next/link";
import { useContext } from "react";

export default function Home() {
  const { userData } = useContext(UserContext);

  return (
    <div className="bg-[url('/images/background.jpg')] bg-cover bg-center h-dvh w-dvw flex flex-col items-center justify-center px-[10%] text-[#1a1a1a] relative">
      <div className="absolute inset-0 bg-[rgba(255,255,255,0.5)] backdrop-blur-[2px]"></div>

      {userData && !userData.isEmailVerified && (
        <div className="absolute inset-y-[25px] px-[10px] py-[10px] border-[1px] h-fit w-fit rounded-lg shadow-2xl flex items-center gap-[20px] mx-[10px]">
          <p className="text-[#2b2b2b] text-[12px] sm:text-[13px] font-[600] sm:font-[700]">
            Please verify your email to unlock online play with your friends.
          </p>{" "}
          <button className="px-[10px] py-[5px] rounded-md bg-gradient-to-r from-[#000000] to-[#3b3b3b] text-[#f4f4f4] font-[600] text-[11px] sm:text-[13px] shadow-md transition-all">
            Unverified
          </button>
        </div>
      )}

      <div className="relative z-10 text-center flex flex-col items-center gap-[25px] mb-[40px] sm:mb-[70px] md:mb-[80px]">
        <h1 className="text-[30px] sm:text-[38px] font-[800] bg-gradient-to-r from-[#0f172a] via-[#334155] to-[#64748b] bg-clip-text text-transparent tracking-tight">
          Welcome <span className="font-[900]">Anurag Mishra</span>
        </h1>

        <p className="text-[12px] xs:text-[13px] sm:text-[14px] md:text-[17px] text-[#2b2b2b] max-w-[850px] leading-relaxed font-[500] text-justify sm:text-center">
          Step into the world of strategy and skill. Challenge your friends in
          real-time chess battles or connect online with players across the
          globe your move decides the game.
        </p>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-[18px]">
        <Link
          className="w-[250px] py-[10px] sm:py-[12px] rounded-xl bg-gradient-to-r from-[#000000] to-[#3b3b3b] text-[#f4f4f4] font-[600] text-[14px] sm:text-[16px] shadow-md hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer text-center"
          href="/play"
          data-click-sound
        >
          Play With Friend
        </Link>
        <button
          className={`w-[250px] py-[10px] sm:py-[12px] rounded-xl border border-[#00000090] text-[#1a1a1a] font-[600] text-[14px] sm:text-[16px] bg-[rgba(255,255,255,0.7)] shadow-sm transition-all ${
            userData?.isEmailVerified === true
              ? "hover:bg-[rgba(255,255,255,0.9)] opacity-100 cursor-pointer"
              : "opacity-50 cursor-not-allowed"
          }`}
          data-click-sound
        >
          Play Online
        </button>
      </div>
    </div>
  );
}
