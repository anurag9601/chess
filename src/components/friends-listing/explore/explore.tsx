"use client";

import ListLoading from "@/components/animation/list-loading/listLoading";
import Spinner from "@/components/animation/spinner/spinner";
import { NotificationContext } from "@/context/Notification.context";
import { UserContext } from "@/context/User.context";
import React, { useContext, useEffect, useRef, useState } from "react";

interface exploreUserI {
  isFriend: boolean;
  isAlreadyRequestSend: boolean;
  userName: string;
}

const Explore = () => {
  const { userData } = useContext(UserContext);
  const { setNotificationData } = useContext(NotificationContext);
  const [exploreUsers, setExploreUsers] = useState<exploreUserI[]>([]);
  const [requestQueue, setRequestQueue] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const pageSizeRef = useRef<number>(10);

  async function getUsersToExplore() {
    const request = await fetch("/api/online/explore", {
      method: "POST",
      body: JSON.stringify({
        pageSize: pageSizeRef.current,
      }),
    });

    const response = await request.json();

    if (!response.success) {
      setNotificationData({
        id: Date.now(),
        notificationMessage: response.error,
        notificationChildMessages: [],
        notificationType: "error",
        animationType: "notification",
        showActionButtons: false,
      });
    } else if (response.success) {
      setExploreUsers(response.users);
    }

    setIsLoading(false);
  }

  async function sendFriendRequest(requestSendUserName: string, index: number) {
    if (!userData || requestQueue.includes(index)) return;

    setRequestQueue((prev) => [...prev, index]);

    const request = await fetch("/api/online/requests/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestUserName: requestSendUserName,
      }),
    });

    const response = await request.json();

    if (response.success === true) {
      setExploreUsers((prev) => {
        const updatedExploreUsers = [...prev];
        updatedExploreUsers[index].isAlreadyRequestSend = true;
        return updatedExploreUsers;
      });

      setNotificationData({
        id: Date.now(),
        notificationMessage: response.message,
        notificationChildMessages: [],
        notificationType: "success",
        animationType: "notification",
        showActionButtons: false,
      });
    } else if (response.success === false) {
      setNotificationData({
        id: Date.now(),
        notificationMessage: response.error,
        notificationChildMessages: [],
        notificationType: "error",
        animationType: "notification",
        showActionButtons: false,
      });
    }

    setRequestQueue((prev) => {
      const updated_queue = [...prev];
      updated_queue.shift();
      return updated_queue;
    });
  }

  useEffect(() => {
    if (userData) {
      getUsersToExplore();
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <ListLoading />
      ) : exploreUsers.length > 0 ? (
        <>
          <div className="flex-1 flex flex-col items-start justify-start gap-[10px] h-full w-full overflow-y-auto custom-scrollbar">
            {exploreUsers.map((user, index) => (
              <div
                className="flex items-start justify-between gap-[10px] w-full bg-[#f9f6ed] p-[10px] rounded-md hover: "
                key={user.userName}
              >
                <div className="flex items-start justify-center gap-[10px]">
                  <img
                    src="./images/friend-request.png"
                    alt="user-pawn"
                    className="h-[20px] w-[20px]"
                  />
                  <div className="flex flex-col gap-[3px]">
                    <p className="text-[14px] font-[700] break-all">
                      {user.userName}
                    </p>
                    {user.isAlreadyRequestSend && (
                      <p className="text-[12px] font-[600] text-lime-700">
                        A friend request has already been sent to this user.
                      </p>
                    )}
                    {user.isFriend && (
                      <p className="text-[12px] font-[600] text-lime-700">
                        You’re already friends with this user.
                      </p>
                    )}
                  </div>
                </div>
                {!user.isAlreadyRequestSend && !user.isFriend && (
                  <button
                    className="bg-gradient-to-r from-[#000000] to-[#3b3b3b] text-[#f4f4f4] font-[600] text-[13px] px-[10px] py-[5px] rounded-lg cursor-pointer min-w-[103px] relative"
                    onClick={() => sendFriendRequest(user.userName, index)}
                  >
                    {requestQueue.includes(index) && <Spinner width={20} />}
                    Send Request
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[13px] text-[#888883] font-[700] text-center">
            Sorry for the inconvenience. Currently, there are no available users
            for you to send a friend request to. You may have already sent
            requests to all existing users, or there are no other users yet.
          </p>
        </div>
      )}
    </>
  );
};

export default Explore;
