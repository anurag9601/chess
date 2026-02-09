"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "@/context/User.context";
import ListLoading from "@/components/animation/list-loading/listLoading";
import { NotificationContext } from "@/context/Notification.context";

interface friendsDataI {}

const Friends = () => {
  const { userData } = useContext(UserContext);
  const { setNotificationData } = useContext(NotificationContext);

  const [challengeQueue, setChallengeQueue] = useState<number[]>([]);
  const [friends, setFriends] = useState<friendsDataI[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const pageSizeRef = useRef<number>(10);

  async function getCurrentUserAllFriends() {
    const request = await fetch("/api/online/friends", {
      method: "POST",
      body: JSON.stringify({
        pageSize: pageSizeRef.current,
      }),
    });

    const response = await request.json();

    if (!response.success) {
      setNotificationData({
        notificationMessage: response.error,
        notificationChildMessages: [],
        notificationType: "error",
      });
    } else if (response.success) {
      setFriends(response.users);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (userData) {
      getCurrentUserAllFriends();
    }
  }, [userData]);
  return (
    <>
      {isLoading ? (
        <ListLoading />
      ) : friends.length > 0 ? (
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
            <button className="bg-gradient-to-r from-[#000000] to-[#3b3b3b] text-[#f4f4f4] font-[600] text-[13px] px-[10px] py-[5px] rounded-lg cursor-pointer">
              Challenge
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[13px] text-[#888883] font-[700] text-center">
            You don’t have any friends connected yet. Go to the Explore tab to
            discover real users and send them a friend request to start playing
            online.
          </p>
        </div>
      )}
    </>
  );
};

export default Friends;
