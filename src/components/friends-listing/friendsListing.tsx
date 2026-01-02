"use client";
import React, { useRef, useState } from "react";

const FriendsListing = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [openTab, setOpenTab] = useState<"friends" | "explore" | "request">(
    "friends"
  );

  const [connectionInfo, setConnectionInfo] = useState();

  const [challengeQueue, setChallengeQueue] = useState<number[]>([]);

  function onTabSelect(tabName: "friends" | "explore" | "request") {
    setOpenTab(tabName);
  }

  return (
    <div className="flex flex-col items-center gap-[10px] max-w-[400px] w-full border-r-[1px] border-[#99a1af] max-h-screen h-[500px] pr-[20px]">
      <div
        className="w-full flex items-center border-[1px] border-[#99a1af] px-[10px] py-[5px] rounded-md"
        onClick={() => inputRef.current?.focus()}
      >
        <input
          type="text"
          className="w-full border-none outline-none font-[700] text-[14px]"
          placeholder="Search by username"
          ref={inputRef}
        />
        <img
          src="./images/search.png"
          alt="search"
          className="h-[20px] w-[20px]"
        />
      </div>

      <div className="flex items-center justify-start gap-[30px] w-full h-[30px]">
        <div
          className="text-[14px] font-[600] cursor-pointer"
          onClick={() => onTabSelect("friends")}
        >
          Friends
          {openTab === "friends" && (
            <hr className="border-none outline-none h-[3px] w-full bg-[#888883] rounded-lg" />
          )}
        </div>
        <div
          className="text-[14px] font-[600] cursor-pointer"
          onClick={() => onTabSelect("explore")}
        >
          Explore
          {openTab === "explore" && (
            <hr className="border-none outline-none h-[3px] w-full bg-[#888883] rounded-lg" />
          )}
        </div>

        <div
          className="text-[14px] font-[600] cursor-pointer"
          onClick={() => onTabSelect("request")}
        >
          Request
          {openTab === "request" && (
            <hr className="border-none outline-none h-[3px] w-full bg-[#888883] rounded-lg" />
          )}
        </div>
      </div>

      {openTab === "friends" && (
        // <div className="flex-1 flex flex-col items-start justify-start gap-[10px] h-full w-full overflow-y-auto custom-scrollbar">
        //   <div className="flex items-start justify-between gap-[10px] w-full bg-[#f9f6ed] p-[10px] rounded-md hover: ">
        //     <div className="flex items-center justify-center gap-[10px]">
        //       <img
        //         src="./images/user-pawn.png"
        //         alt="user-pawn"
        //         className="h-[20px] w-[20px]"
        //       />
        //       <p className="text-[14px] font-[700] break-all">Anurag 01</p>
        //     </div>
        //     <button className="bg-gradient-to-r from-[#000000] to-[#3b3b3b] text-[#f4f4f4] font-[600] text-[13px] px-[10px] py-[5px] rounded-lg cursor-pointer">
        //       Challenge
        //     </button>
        //   </div>
        // </div>

        <div className="flex-1 flex items-center justify-center">
          <p className="text-[13px] text-[#888883] font-[700] text-center">
            You don’t have any friends connected yet. Go to the Explore tab to
            discover real users and send them a friend request to start playing
            online.
          </p>
        </div>
      )}

      {openTab === "explore" && (
        // <div className="flex-1 flex flex-col items-start justify-start gap-[10px] h-full w-full overflow-y-auto custom-scrollbar">
        //   <div className="flex items-start justify-between gap-[10px] w-full bg-[#f9f6ed] p-[10px] rounded-md hover: ">
        //     <div className="flex items-center justify-center gap-[10px]">
        //       <img
        //         src="./images/friend-request.png"
        //         alt="user-pawn"
        //         className="h-[20px] w-[20px]"
        //       />
        //       <p className="text-[14px] font-[700] break-all">Anurag 01</p>
        //     </div>
        //     <button className="bg-gradient-to-r from-[#000000] to-[#3b3b3b] text-[#f4f4f4] font-[600] text-[13px] px-[10px] py-[5px] rounded-lg cursor-pointer">
        //       Send Request
        //     </button>
        //   </div>
        // </div>

        <div className="flex-1 flex items-center justify-center">
          <p className="text-[13px] text-[#888883] font-[700] text-center">
            Sorry for the inconvenience. Currently, there are no available users
            for you to send a friend request to. You may have already sent
            requests to all existing users, or there are no other users yet.
          </p>
        </div>
      )}

      {openTab === "request" && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[13px] text-[#888883] font-[700] text-center">
            You currently don’t have any friend requests. If there are any
            updates, you’ll receive a notification, and new requests will appear
            here for you to accept.
          </p>
        </div>
      )}
    </div>
  );
};

export default FriendsListing;
