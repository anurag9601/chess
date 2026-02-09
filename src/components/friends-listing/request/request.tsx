"use client";

import ListLoading from "@/components/animation/list-loading/listLoading";
import { NotificationContext } from "@/context/Notification.context";
import { UserContext } from "@/context/User.context";
import React, { useContext, useEffect, useRef, useState } from "react";

const Request = () => {
  const { userData } = useContext(UserContext);
  const { setNotificationData } = useContext(NotificationContext);
  const [requests, setRequests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const pageSizeRef = useRef<number>(10);

  async function getCurrentUserAllActiveRequests() {
    const request = await fetch("/api/online/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pageSize: pageSizeRef.current,
      }),
    });

    const response = await request.json();

    console.log("response", response);

    if (!response.success) {
      setNotificationData({
        notificationMessage: response.error,
        notificationChildMessages: [],
        notificationType: "error",
      });
    } else if (response.success) {
      setRequests(response.requestList);
    }

    setIsLoading(false);
  }

  async function acceptFriendRequest(requestAcceptUserName: string) {
    if (!userData) return;

    const request = await fetch("/api/requests/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestAcceptUserName,
      }),
    });

    const response = await request.json();

    console.log("response", response);

    if (response.success === false) {
      setNotificationData({
        notificationMessage: response.error,
        notificationChildMessages: [],
        notificationType: "error",
      });
    } else if (response.success === true) {
      setNotificationData({
        notificationMessage: response.message,
        notificationChildMessages: [],
        notificationType: "success",
      });
    }
  }

  async function rejectFriendRequest() {}

  useEffect(() => {
    if (userData) {
      getCurrentUserAllActiveRequests();
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <ListLoading />
      ) : requests.length > 0 ? (
        requests.map((userName) => (
          <div
            className="flex-1 flex flex-col items-start justify-start gap-[10px] h-full w-full overflow-y-auto custom-scrollbar"
            key={userName}
          >
            <div className="flex items-start justify-between gap-[10px] w-full bg-[#f9f6ed] p-[10px] rounded-md hover: ">
              <div className="flex items-center justify-center gap-[10px]">
                <img
                  src="./images/user-pawn.png"
                  alt="user-pawn"
                  className="h-[20px] w-[20px]"
                />
                <p className="text-[14px] font-[700] break-all">{userName}</p>
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
        ))
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
