"use client";

import { UserContext } from "@/context/User.context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
  useContext,
  useRef,
  useState,
} from "react";
import z, { email } from "zod";

interface emailI {
  data: string;
  success: boolean;
  message: string;
}

interface otpI {
  data: string[];
  success: boolean;
  message: string;
}

const page = () => {
  const router = useRouter();
  const { setUserData } = useContext(UserContext);

  const [signInData, setSignInData] = useState<{
    email: emailI;
    otp: otpI;
  }>({
    email: {
      data: "",
      success: false,
      message: "",
    },
    otp: {
      data: Array.from<string>({ length: 6 }).fill(""),
      success: false,
      message: "",
    },
  });

  const [isOtpWindowOpen, setIsOtpWindowOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [otpTime, setOtpTime] = useState<string>("00:00:00");

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const otpTimerOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function onChangeEventHandler(
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) {
    const input = e.target as HTMLInputElement;
    if (/[0-9]/.test(input.value)) {
      const value = input.value;
      setSignInData((prev) => {
        const updatedOtp = [...prev.otp.data];
        updatedOtp[index] = value;

        return {
          ...prev,
          otp: {
            ...prev.otp,
            data: updatedOtp,
          },
        };
      });
      if (index !== signInData.otp.data.length - 1) {
        otpInputsRef.current[index + 1]?.focus();
      }
    } else {
      e.preventDefault();
    }
  }

  function handleKeyDownEvent(
    e: KeyboardEvent<HTMLInputElement>,
    index: number,
  ) {
    const key = e.key;
    const isBackspace = key === "Backspace";

    if (isBackspace) {
      if (signInData.otp.data[index] !== "") {
        setSignInData((prev) => {
          const updatedOtp = [...prev.otp.data];
          updatedOtp[index] = "";

          return {
            ...prev,
            otp: {
              ...prev.otp,
              data: updatedOtp,
            },
          };
        });
      } else if (signInData.otp.data[index] === "" && index > 0) {
        otpInputsRef.current[index - 1]?.focus();
      }
    }

    if (/[0-9]/.test(key) && signInData.otp.data[index] !== "") {
      setSignInData((prev) => {
        const updatedOtp = [...prev.otp.data];
        updatedOtp[index] = key;

        return {
          ...prev,
          otp: {
            ...prev.otp,
            data: updatedOtp,
          },
        };
      });
      if (index !== signInData.otp.data.length - 1) {
        otpInputsRef.current[index + 1]?.focus();
      }
    }
  }

  function handleCopyPaseEvent(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();

    const pasteData = e.clipboardData.getData("text");

    const isOnlyNumbers = /^\d+$/.test(pasteData);

    if (!isOnlyNumbers) {
      alert(`Invalid OTP. Non-numeric characters detected: "${pasteData}"`);
      return;
    }

    if (pasteData.length > signInData.otp.data.length) {
      alert(`OTP cannot be longer than ${signInData.otp.data.length} digits.`);
      return;
    }

    const updatedOtp: string[] = Array.from<string>({
      length: signInData.otp.data.length,
    }).fill("");

    for (let i = 0; i < pasteData.length; i++) {
      updatedOtp[i] = pasteData[i];
    }

    setSignInData((prev) => ({
      ...prev,
      otp: {
        ...prev.otp,
        data: updatedOtp,
      },
    }));

    otpInputsRef.current[pasteData.length - 1]?.focus();
  }

  function onEmailValueChange(e: ChangeEvent<HTMLInputElement>) {
    const email = e.target.value;
    setSignInData((prev) => ({
      ...prev,
      email: {
        ...prev.email,
        data: email,
      },
    }));
  }

  async function handleOnEmailVerificationRequestSend() {
    if (isLoading) return;

    const email = signInData.email.data;

    if (email.length === 0) {
      setSignInData((prev) => ({
        ...prev,
        email: {
          data: "",
          success: false,
          message: "Please enter your email address to proceed.",
        },
      }));
      return;
    }

    const validEmail = z.email().safeParse(email);

    if (!validEmail.success) {
      setSignInData((prev) => ({
        ...prev,
        email: {
          data: email,
          success: false,
          message: validEmail.error.issues[0].message,
        },
      }));

      return;
    }

    setIsLoading(true);

    setSignInData((prev) => ({
      ...prev,
      email: {
        ...prev.email,
        success: true,
        message: "",
      },
    }));

    const request = await fetch("/api/auth/generate-otp", {
      method: "POST",
      body: JSON.stringify({
        emailOrUserName: email,
      }),
    });

    const response = await request.json();

    if (response.success === false) {
      setSignInData((prev) => ({
        ...prev,
        email: {
          ...prev.email,
          success: response.success,
          message: response.error,
        },
      }));
    } else if (response.success === true) {
      setSignInData((prev) => ({
        ...prev,
        email: {
          ...prev.email,
          success: response.success,
          message: response.message,
        },
      }));
      setIsOtpWindowOpen(true);
      if (response.expiredOn) {
        startTheOTPTimer(response.expiredOn);
      } else if (otpTimerOutRef.current) {
        clearTimeout(otpTimerOutRef.current);
      }
    }

    setIsLoading(false);
  }

  async function handleVerifyOTPAndSignInUser() {
    function validOTP() {
      signInData.otp.data.forEach((d) => {
        if (d === "" || !/[0-9]/.test(d)) {
          return false;
        }
      });

      return true;
    }

    if (!validOTP) {
      setSignInData((prev) => ({
        ...prev,
        otp: {
          ...prev.otp,
          success: false,
          message: "All fields are required to proceed with OTP verification.",
        },
      }));

      return;
    }

    setIsLoading(true);

    setSignInData((prev) => ({
      ...prev,
      otp: {
        ...prev.otp,
        success: true,
        message: "",
      },
    }));

    const request = await fetch("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({
        email: signInData.email.data,
        otp: signInData.otp.data.join(""),
      }),
    });

    const response = await request.json();

    if (response.success === false) {
      setSignInData((prev) => ({
        ...prev,
        otp: {
          ...prev.otp,
          success: response.success,
          message: response.error,
        },
      }));
    } else if (response.success === true) {
      setSignInData((prev) => ({
        ...prev,
        otp: {
          ...prev.otp,
          success: response.success,
          message: response.message,
        },
      }));
      router.push("/");
      setUserData(response.data);
    }

    setIsLoading(false);
  }

  function startTheOTPTimer(dateTime: Date) {
    otpTimerOutRef.current = setTimeout(() => {
      const currentTime = Date.now();
      const expireTime = new Date(dateTime).getTime();

      const diff = expireTime - currentTime;

      if (diff <= 0) {
        setOtpTime("00:00:00");
        if (otpTimerOutRef.current) {
          clearTimeout(otpTimerOutRef.current);
        }
        setIsOtpWindowOpen(false);
        setSignInData((prev) => ({
          ...prev,
          email: {
            ...prev.email,
            success: false,
            message:
              "Your email verification OTP has expired. Please enter your registered email address to generate a new OTP and complete the sign-in process.",
          },
        }));
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const formatted = [
        hours.toString().padStart(2, "0"),
        minutes.toString().padStart(2, "0"),
        seconds.toString().padStart(2, "0"),
      ].join(":");

      setOtpTime(formatted);
    }, 1000);
  }

  return (
    <div className="min-h-dvh min-w-dvw flex items-center justify-center">
      <div className="max-w-[550px] min-h-fit flex flex-col items-center justify-center border-[1px] rounded-xl mx-[5px] sm:mx-[20px] my-[5px] sm:my-[20px] px-[20px] py-[20px] shadow-2xl">
        <div className="flex flex-col items-center justify-center gap-[10px] sm:gap-[20px]">
          <div className="flex flex-col gap-[2px] sm:gap-[5px]">
            <label className="text-black font-[700] text-[17px] sm:text-[20px]">
              Welcome Back
            </label>
            <p className="text-gray-600 text-[12px] sm:text-sm font-[600]">
              Sign in to continue your chess journey challenge your friends,
              face new opponents, and improve your strategy with every move.
            </p>
          </div>

          <div className="flex flex-col gap-[5px] sm:gap-[10px] w-full">
            <label className="text-black font-[700] text-[14px] sm:text-[16px]">
              Email Address
            </label>
            <input
              type="email"
              readOnly={isOtpWindowOpen}
              placeholder="e.g. johndoe@gmail.com"
              className="border-[1px] px-[10px] py-[5px] rounded-lg text-[15px]"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onEmailValueChange(e)
              }
            />
            <p
              className={`mt-[-5px] text-[11px] sm:text-[12px] ${
                signInData.email.success === true
                  ? "text-lime-700"
                  : "text-red-600"
              } font-[600]`}
            >
              {signInData.email.message || ""}
            </p>
          </div>

          {isOtpWindowOpen && (
            <div className="w-full flex flex-col items-start justify-center gap-[20px] mb-[10px]">
              <p className="w-full flex items-start justify-between">
                <span className="text-gray-600 text-[12px] sm:text-[13px] font-[600]">
                  Check your email and enter the 6-digit OTP to continue.
                </span>{" "}
                <span className="text-red-500 text-[12px] sm:text-[13px] font-[700]">
                  {otpTime}
                </span>
              </p>

              <div className="w-full flex items-center justify-center gap-[10px]">
                {signInData.otp.data.map((n: string, index: number) => {
                  return (
                    <input
                      key={index}
                      className="h-[30px] w-[30px] border-[1px] border-black rounded-md flex items-center justify-center text-[15px] text-center"
                      type="text"
                      value={n}
                      ref={(e: HTMLInputElement | null) => {
                        otpInputsRef.current[index] = e;
                      }}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        onChangeEventHandler(e, index);
                      }}
                      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                        handleKeyDownEvent(e, index);
                      }}
                      onPaste={(e) => handleCopyPaseEvent(e)}
                      maxLength={1}
                    />
                  );
                })}
              </div>

              <p
                className={`mt-[-5px] text-[11px] sm:text-[12px] ${
                  signInData.otp.success === true
                    ? "text-lime-700"
                    : "text-red-600"
                } font-[600]`}
              >
                {signInData.otp.message || ""}
              </p>
            </div>
          )}

          {!isOtpWindowOpen ? (
            <button
              className={`w-full py-[8px] sm:py-[10px] bg-black text-[#f9f6ed] font-[700] rounded-lg hover:bg-neutral-600 duration-300 text-[15px] sm:text-[16px] ${
                isLoading
                  ? "opacity-60 cursor-not-allowed"
                  : "opacity-100 cursor-pointer"
              }`}
              onClick={handleOnEmailVerificationRequestSend}
            >
              Send OTP
            </button>
          ) : (
            <button
              className={`w-full py-[8px] sm:py-[10px] bg-black text-[#f9f6ed] font-[700] rounded-lg hover:bg-neutral-600 duration-300 text-[15px] sm:text-[16px] ${
                isLoading
                  ? "opacity-60 cursor-not-allowed"
                  : "opacity-100 cursor-pointer"
              }`}
              onClick={handleVerifyOTPAndSignInUser}
            >
              Continue
            </button>
          )}

          <Link
            href="/auth/signup"
            className="text-[14px] font-[500] cursor-pointer hover:underline"
          >
            Don't have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
