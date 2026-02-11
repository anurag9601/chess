"use client";

import ListLoading from "@/components/animation/list-loading/listLoading";
import { NotificationContext } from "@/context/Notification.context";
import { UserContext } from "@/context/User.context";
import React, { useContext, useEffect, useRef, useState } from "react";

const Request = () => {
  const { userData } = useContext(UserContext);
  const { setNotificationData, showAlert } = useContext(NotificationContext);
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
        id: Date.now(),
        notificationMessage: response.error,
        notificationChildMessages: [],
        notificationType: "error",
        animationType: "notification",
        showActionButtons: false,
      });
    } else if (response.success) {
      setRequests(response.requestList);
    }

    setIsLoading(false);
  }

  async function acceptFriendRequest(requestAcceptUserName: string) {
    if (!userData) return;

    const result = await showAlert({
      notificationMessage: `Confirm Friend Request Access`,
      notificationChildMessages: [
        `Do you want to accept the friend request from ${requestAcceptUserName}?`,
        "Accepting this request will add the user to your friends list",
        "Once added, you can play online and interact with this user",
      ],
      notificationType: "",
      animationType: "alert",
      showActionButtons: true,
      payload: requestAcceptUserName,
    });

    if (result) {
      const request = await fetch("/api/online/requests/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestAcceptUserName: result,
        }),
      });

      const response = await request.json();

      if (response.success === false) {
        setNotificationData({
          id: Date.now(),
          notificationMessage: response.error,
          notificationChildMessages: [],
          notificationType: "error",
          animationType: "notification",
          showActionButtons: false,
        });
      } else if (response.success === true) {
        setNotificationData({
          id: Date.now(),
          notificationMessage: response.message,
          notificationChildMessages: [],
          notificationType: "success",
          animationType: "notification",
          showActionButtons: false,
        });

        setRequests((prev) =>
          prev.filter((user) => user !== requestAcceptUserName),
        );
      }
    } else {
      console.log("The action is canceled.");
    }
  }

  async function rejectFriendRequest(requestRejectUserName: string) {
    const result = await showAlert({
      notificationMessage: `Confirm Friend Request Rejection`,
      notificationChildMessages: [
        `Are you sure you want to reject the friend request from ${requestRejectUserName}?`,
        "If you reject this user more than three times, they will no longer be able to send you friend requests.",
        "If you choose to report this user, they will immediately lose the ability to send you any further requests.",
        "Please proceed carefully before making your decision.",
      ],
      notificationType: "warning",
      animationType: "alert",
      showActionButtons: true,
      payload: requestRejectUserName,
    });

    if (result) {
      const request = await fetch("/api/online/requests/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestRejectUserName: result,
        }),
      });

      const response = await request.json();

      if (response.success === false) {
        setNotificationData({
          id: Date.now(),
          notificationMessage: response.error,
          notificationChildMessages: [],
          notificationType: "error",
          animationType: "notification",
          showActionButtons: false,
        });
      } else if (response.success === true) {
        setNotificationData({
          id: Date.now(),
          notificationMessage: response.message,
          notificationChildMessages: [],
          notificationType: "success",
          animationType: "notification",
          showActionButtons: false,
        });

        setRequests((prev) =>
          prev.filter((user) => user !== requestRejectUserName),
        );
      }
    } else {
      console.log("The action is canceled.");
    }
  }

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
                  onMouseDown={() => acceptFriendRequest(userName)}
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
