"use client";

import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="min-h-dvh min-w-dvw flex items-center justify-center">
      <div className="max-w-[550px] min-h-fit flex flex-col items-center justify-center border-[1px] rounded-xl mx-[5px] sm:mx-[20px] my-[5px] sm:my-[20px] px-[20px] py-[20px] shadow-2xl">
        <form className="flex flex-col items-center justify-center gap-[20px]">
          <div className="flex flex-col gap-[2px] sm:gap-[5px]">
            <label className="text-black font-[700] text-[17px] sm:text-[20px]">
              Sign Up
            </label>
            <p className="text-gray-600 text-[12px] sm:text-sm font-[600]">
              Create your account to join exciting chess matches and challenge
              your friends. Let the game begin!
            </p>
          </div>

          <div className="flex items-center justify-between gap-[10px] sm:gap-[20px] w-full flex-col sm:flex-row">
            <div className="flex flex-col gap-[5px] sm:gap-[10px] w-full">
              <label className="text-black font-[700] text-[14px] sm:text-[16px]">
                First Name
              </label>
              <input
                type="text"
                placeholder="John"
                className="border-[1px] px-[10px] py-[5px] rounded-lg text-[15px]"
              />
            </div>
            <div className="flex flex-col gap-[5px] sm:gap-[10px] w-full">
              <label className="text-black font-[700] text-[14px] sm:text-[16px]">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Doe"
                className="border-[1px] px-[10px] py-[5px] rounded-lg text-[15px]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-[5px] sm:gap-[10px] w-full">
            <label className="text-black font-[700] text-[14px] sm:text-[16px]">
              Email Address
            </label>
            <input
              type="email"
              placeholder="eg.johnDoe@gmail.com"
              className="border-[1px] px-[10px] py-[5px] rounded-lg text-[15px]"
            />
            <p></p>
          </div>

          <div className="flex flex-col gap-[5px] sm:gap-[10px] w-full">
            <label className="text-black font-[700] text-[14px] sm:text-[16px]">
              Your Unique Username
            </label>
            <input
              type="text"
              placeholder="eg.johnDoe01"
              className="border-[1px] px-[10px] py-[5px] rounded-lg text-[15px]"
            />
            <p></p>
          </div>

          <button className="w-full py-[8px] sm:py-[10px] bg-black text-[#f9f6ed] font-[700] rounded-lg cursor-pointer hover:bg-neutral-600 duration-300 text-[15px] sm:text-[16px]">
            Register
          </button>

          <Link
            href="/auth/signin"
            className="mt-[-10px] text-[14px] font-[500] cursor-pointer hover:underline"
          >
            Already have an account?
          </Link>
        </form>
      </div>
    </div>
  );
};

export default page;
