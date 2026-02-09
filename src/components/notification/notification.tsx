"use client";

import { NotificationContext } from "@/context/Notification.context";
import React, { useContext, useEffect, useRef, useState } from "react";

const Notification = () => {
  const { notificationData, setNotificationData } =
    useContext(NotificationContext);

  const backgroundMapOnNotificationType = {
    success: "bg-green-50 border-green-400 text-green-800",
    error: "bg-red-50 border-red-400 text-red-800",
    warning: "bg-yellow-50 border-yellow-400 text-yellow-800",
    info: "bg-blue-50 border-blue-400 text-blue-800",
    "": "bg-[#f9f6ed] border-[#99a1af]",
  };

  const [showNotification, setShowNotification] = useState<boolean>(false);
  const showNotificationTimeOutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  useEffect(() => {
    if (!notificationData.id) return;

    setShowNotification(false);

    const ref = requestAnimationFrame(() => {
      setShowNotification(true);
    });

    if (showNotificationTimeOutRef.current) {
      clearTimeout(showNotificationTimeOutRef.current);
    }

    showNotificationTimeOutRef.current = setTimeout(() => {
      setShowNotification(false);
    }, 2 * 1000);

    return () => {
      cancelAnimationFrame(ref);
      if (showNotificationTimeOutRef.current) {
        clearTimeout(showNotificationTimeOutRef.current);
      }
    };
  }, [notificationData]);

  return (
    <>
      {showNotification && (
        <div
          className={`fixed top-2 left-1/2 max-w-[350px] min-w-[250px]
  rounded-lg py-[10px] px-[15px] border shadow-lg
  ${backgroundMapOnNotificationType[notificationData.notificationType]}
  flex flex-col gap-[10px] notification-pop-up-animation`}
        >
          {notificationData.notificationMessage && (
            <p className="text-[13px] font-[700]">
              {notificationData.notificationMessage}
            </p>
          )}
          {notificationData.notificationChildMessages && (
            <ul className="flex flex-col gap-[3px] pl-[10px]">
              {notificationData.notificationChildMessages.map(
                (message, index) => (
                  <li
                    className="text-[12px] font-[600] list-disc break-all"
                    key={index}
                  >
                    {message}
                  </li>
                ),
              )}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

export default Notification;
