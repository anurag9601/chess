"use client";
import { UserContext } from "@/context/User.context";
import React, { useContext, useEffect, useRef, useState } from "react";
import Friends from "./friends/friends";
import Explore from "./explore/explore";
import Request from "./request/request";

const FriendsListing = () => {
  const { userData } = useContext(UserContext);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [openTab, setOpenTab] = useState<"friends" | "explore" | "request">(
    "friends"
  );

  const [connectionInfo, setConnectionInfo] = useState();

  function onTabSelect(tabName: "friends" | "explore" | "request") {
    setOpenTab(tabName);
  }

  // async function explore(userName: string) {
  //   const request = await fetch("/api/online/explore", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       userName: userName,
  //     }),
  //   });

  //   const response = await request.json();

  //   console.log("explore users", response);
  // }

  // useEffect(() => {
  //   if (userData) {
  //     explore(userData.uniqueUserName);
  //   }
  // }, [userData]);

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

      {openTab === "friends" && <Friends />}

      {openTab === "explore" && <Explore />}

      {openTab === "request" && <Request />}
    </div>
  );
};

export default FriendsListing;
