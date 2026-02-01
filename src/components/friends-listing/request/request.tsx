"use client";

import ListLoading from "@/components/animation/list-loading/listLoading";
import { UserContext } from "@/context/User.context";
import React, { useContext, useEffect, useRef, useState } from "react";

interface friendRequestsI {}

const Request = () => {
  const { userData } = useContext(UserContext);
  const [requests, setRequests] = useState<friendRequestsI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const pageSizeRef = useRef<number>(10);

  async function getCurrentUserAllActiveRequests(userId: string) {
    const request = await fetch("/api/online/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userId,
        pageSize: pageSizeRef.current,
      }),
    });

    const response = await request.json();

    if (!response.success) {
    } else if (response.success) {
      setRequests(response.requestList);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (userData) {
      getCurrentUserAllActiveRequests(userData._id);
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <ListLoading />
      ) : requests.length > 0 ? (
        <div className="flex-1 flex flex-col items-start justify-start gap-[10px] h-full w-full overflow-y-auto custom-scrollbar">
          <div className="flex items-start justify-between gap-[10px] w-full bg-[#f9f6ed] p-[10px] rounded-md hover: ">
            <div className="flex items-center justify-center gap-[10px]">
              <img
                src="./images/user-pawn.png"
                alt="user-pawn"
                className="h-[20px] w-[20px]"
              />
              <p className="text-[14px] font-[700] break-all">Anurag 01</p>
            </div>
            <div className="flex items-center gap-[10px]">
              <img
                src="/images/black-reject.png"
                alt="reject"
                className="h-[20px] w-[20px] cursor-pointer"
              />
              <img
                src="/images/black-accept.png"
                alt="accept"
                className="h-[20px] w-[20px] cursor-pointer"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[13px] text-[#888883] font-[700] text-center">
            You currently don’t have any friend requests. If there are any
            updates, you’ll receive a notification, and new requests will appear
            here for you to accept.
          </p>
        </div>
      )}
    </>
  );
};

export default Request;
