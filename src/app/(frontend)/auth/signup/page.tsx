import React from "react";

const page = () => {
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      <div className="max-w-[550px] min-h-fit flex flex-col items-center justify-center border-[1px] rounded-xl mx-[20px] my-[20px] px-[20px] py-[20px] shadow-2xl">
        <form className="flex flex-col items-center justify-center gap-[20px]">
          <div className="flex flex-col gap-[5px]">
            <label className="text-black font-[700] text-[20px]">Sign Up</label>
            <p className="text-gray-600 text-sm font-[600]">
              Create your account to join exciting chess matches and challenge
              your friends. Let the game begin!
            </p>
          </div>

          <div className="flex items-center justify-between gap-[20px] w-full">
            <div className="flex flex-col gap-[10px] w-full">
              <label className="text-black font-[700]">First Name</label>
              <input
                type="text"
                placeholder="John"
                className="border-[1px] px-[10px] py-[5px] rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-[10px] w-full">
              <label className="text-black font-[700]">Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                className="border-[1px] px-[10px] py-[5px] rounded-lg"
              />
            </div>
          </div>

          <div className="flex flex-col gap-[10px] w-full">
            <label className="text-black font-[700]">Email Address</label>
            <input
              type="email"
              placeholder="eg.johnDoe@gmail.com"
              className="border-[1px] px-[10px] py-[5px] rounded-lg"
            />
            <p></p>
          </div>

          <div className="flex flex-col gap-[10px] w-full">
            <label className="text-black font-[700]">Your Unique Username</label>
            <input
              type="text"
              placeholder="eg.johnDoe01"
              className="border-[1px] px-[10px] py-[5px] rounded-lg"
            />
            <p></p>
          </div>

          <button className="w-full py-[10px] bg-black text-[#f9f6ed] font-[700] rounded-lg cursor-pointer hover:bg-neutral-600 duration-300">Register</button>
        </form>
      </div>
    </div>
  );
};

export default page;
