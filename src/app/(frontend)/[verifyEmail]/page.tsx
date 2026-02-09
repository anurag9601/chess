"use client";

import { NotificationContext } from "@/context/Notification.context";
import { UserContext } from "@/context/User.context";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

interface statusDataTypeI {
  success: boolean;
  message: string;
}

const page = () => {
  const pathName = usePathname();
  const router = useRouter();
  const { setNotificationData } = useContext(NotificationContext);

  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [status, setStatus] = useState<statusDataTypeI>({
    success: false,
    message: "Your email verified successfully now you can play online",
  });

  async function verifyEmail() {
    const uuid = pathName.split("/")[1];

    const request = await fetch("/api/auth/emailVerification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uuid }),
    });

    const response = await request.json();

    if (response.success === true) {
      setStatus({
        success: true,
        message: response.message,
      });

      setNotificationData({
        id: Date.now(),
        notificationMessage: response.message,
        notificationChildMessages: [],
        notificationType: "success",
      });
    } else {
      setStatus({
        success: false,
        message: response.error,
      });

      setNotificationData({
        id: Date.now(),
        notificationMessage: response.error,
        notificationChildMessages: [],
        notificationType: "error",
      });
    }

    setIsVerifying(false);
  }

  function redirect() {
    if (!status.success) {
      router.push("/auth/signin");
    } else {
      router.push("/");
    }
  }

  useEffect(() => {
    verifyEmail();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen px-[10%]">
      {isVerifying ? (
        <div className="flex flex-col items-center justify-center gap-[20px]">
          <p className="text-center font-[600]">
            Your email verification is in progress and will be completed in a
            few seconds.
          </p>

          <img
            src="./gifs/email-verification.gif"
            alt=""
            className="h-[80px] w-[80px]"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-[30px]">
          <p
            className={`text-center font-[600] text-${
              status.success === true ? "green" : "red"
            }-600 text-[13px] md:text-[16px]`}
          >
            {status.message}
          </p>
          <img
            src={`./images/${
              status.success === true ? "success" : "error"
            }-check.png`}
            alt="Success"
            className="h-[50px] w-[50px]"
          />

          <button
            className="w-[200px] sm:w-[250px] py-[8px] sm:py-[10px] rounded-xl bg-gradient-to-r from-[#000000] to-[#3b3b3b] text-[#f4f4f4] font-[600] text-[13px] sm:text-[15px] shadow-md hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
            onClick={redirect}
          >
            {status.success === true ? "Go to Home" : "Return to Login"}
          </button>
        </div>
      )}
    </div>
  );
};

export default page;
