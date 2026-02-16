"use client";

import { NotificationContext } from "@/context/Notification.context";
import React, {
  MouseEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const Notification = () => {
  const { notificationData, setNotificationData, resolveAlert } =
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
  const [closeAlert, setCloseAlert] = useState<boolean>(false);
  const notificationContainerRef = useRef<HTMLDivElement | null>(null);

  function resetNotificationState() {
    setNotificationData({
      id: 0,
      notificationMessage: "",
      notificationChildMessages: [],
      notificationType: "",
      animationType: "notification",
      showActionButtons: false,
      payload: undefined,
    });
  }

  function closeAlertBox() {
    setCloseAlert(true);

    const timeout = setTimeout(() => {
      setShowNotification(false);
      setCloseAlert(false);
      clearTimeout(timeout);
      resetNotificationState();
    }, 500);

    if (showNotificationTimeOutRef.current) {
      clearTimeout(showNotificationTimeOutRef.current);
    }
  }

  function handleMouseClickEvent(e: MouseEvent | globalThis.MouseEvent) {
    if (!notificationContainerRef.current) return;
    if (notificationContainerRef.current.contains(e.target as Node)) return;

    resolveAlert(null);
    closeAlertBox();
  }

  useEffect(() => {
    if (!notificationData.id) return;

    setShowNotification(false);

    const ref = requestAnimationFrame(() => {
      setShowNotification(true);
    });

    if (showNotificationTimeOutRef.current) {
      clearTimeout(showNotificationTimeOutRef.current);
    }

    if (notificationData.animationType === "alert") return;

    showNotificationTimeOutRef.current = setTimeout(() => {
      setShowNotification(false);
    }, 2000);

    return () => {
      cancelAnimationFrame(ref);
      if (showNotificationTimeOutRef.current) {
        clearTimeout(showNotificationTimeOutRef.current);
      }
    };
  }, [notificationData]);

  useEffect(() => {
    if (notificationData.animationType !== "alert") return;

    document.addEventListener("mousedown", handleMouseClickEvent);

    return () => {
      document.removeEventListener("mousedown", handleMouseClickEvent);
    };
  }, [notificationData]);

  return (
    <>
      {showNotification && (
        <div
          className={`fixed top-2 left-1/2 max-w-[350px]
          rounded-lg py-[10px] px-[15px] border shadow-lg
          ${backgroundMapOnNotificationType[notificationData.notificationType]}
          flex flex-col gap-[10px] ${
            notificationData.animationType === "notification"
              ? "notification-pop-up-animation"
              : closeAlert === false
                ? "alert-pop-up-open-animation"
                : "alert-pop-up-close-animation"
          }`}
          ref={notificationContainerRef}
        >
          {notificationData.notificationMessage && (
            <p className="text-[13px] font-[700]">
              {notificationData.notificationMessage}
            </p>
          )}

          {notificationData.notificationChildMessages.length > 0 && (
            <ul className="flex flex-col gap-[3px] pl-[10px]">
              {notificationData.notificationChildMessages.map(
                (message, index) => (
                  <li
                    className="text-[12px] font-[600] list-disc break-words"
                    key={index}
                  >
                    {message}
                  </li>
                ),
              )}
            </ul>
          )}

          {notificationData.showActionButtons === true && (
            <div className="flex items-center justify-end gap-[10px]">
              <button
                className="text-black border-[1px] hover:text-[#f9f6ed] font-[600] rounded-md hover:bg-black duration-300 text-[14px] px-[10px] py-[5px] cursor-pointer"
                onClick={() => {
                  resolveAlert(null);
                  closeAlertBox();
                }}
              >
                Cancel
              </button>

              <button
                className="bg-black border-[1px] text-[#f9f6ed] font-[600] rounded-md hover:bg-neutral-600 duration-300 text-[14px] px-[10px] py-[5px] cursor-pointer"
                onClick={() => {
                  resolveAlert(notificationData.payload);
                  closeAlertBox();
                }}
              >
                Confirm
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Notification;
