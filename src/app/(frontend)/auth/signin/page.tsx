"use client";

import Link from "next/link";
import React from "react";

const page = () => {

  return (
    <div className="min-h-dvh min-w-dvw flex items-center justify-center">
      <div className="max-w-[550px] min-h-fit flex flex-col items-center justify-center border-[1px] rounded-xl mx-[5px] sm:mx-[20px] my-[5px] sm:my-[20px] px-[20px] py-[20px] shadow-2xl">
        <form className="flex flex-col items-center justify-center gap-[10px] sm:gap-[20px]">
          <div className="flex flex-col gap-[2px] sm:gap-[5px]">
            <label className="text-black font-[700] text-[17px] sm:text-[20px]">
              Welcome Back
            </label>
            <p className="text-gray-600 text-[12px] sm:text-sm font-[600]">
              Sign in to continue your chess journey challenge your friends,
              face new opponents, and improve your strategy with every move.
            </p>
          </div>

          <div className="flex flex-col gap-[5px] sm:gap-[10px] w-full">
            <label className="text-black font-[700] text-[14px] sm:text-[16px]">
              Email Address or Username
            </label>
            <input
              type="text"
              placeholder="e.g. johndoe@gmail.com or john_doe01"
              className="border-[1px] px-[10px] py-[5px] rounded-lg text-[15px]"
            />
            <p></p>
          </div>

          <button className="w-full py-[8px] sm:py-[10px] bg-black text-[#f9f6ed] font-[700] rounded-lg cursor-pointer hover:bg-neutral-600 duration-300 text-[15px] sm:text-[16px]">
            Continue
          </button>

          <Link href='/auth/signup' className="text-[14px] font-[500] cursor-pointer hover:underline">Don't have an account?</Link>
        </form>
      </div>
    </div>
  );
};

export default page;
