import React from "react";

const Players = () => {
  return (
    <div className="flex flex-col items-center justify-between max-h-screen h-[500px]">
      <div className="bg-[#f9f6ed] px-[25px] py-[15px] rounded-lg max-w-[200px] font-[700] border-[1px] border-[#99a1af] flex items-start justify-center gap-[10px]">
        <div className="h-[35px] w-[35px] px-[8px] py-[8px] flex items-center justify-center bg-[#888883] rounded-md">
          <img src="./pieces/users/user-black.png" alt="User" />
        </div>
        <p>Player 1</p>
      </div>
      <div className="bg-[#888883] px-[25px] py-[15px] rounded-lg max-w-[200px] font-[700] text-white flex items-start justify-center gap-[10px]">
        <div className="h-[35px] w-[35px] px-[8px] py-[8px] flex items-center justify-center bg-[#f9f6ed] rounded-md">
          <img src="./pieces/users/user-white.png" alt="User" />
        </div>
        <p>Player 2</p>
      </div>
    </div>
  );
};

export default Players;
