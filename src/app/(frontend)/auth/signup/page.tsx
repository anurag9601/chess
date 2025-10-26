"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  ChangeEvent,
  FormEvent,
  useRef,
  useState,
} from "react";
import z from "zod";

interface I {
  fName: string;
  lName: string;
  userEmail: string;
  uniqueUserName: string;
}

interface validationInterface {
  success: boolean;
  message: string;
}

const page = () => {
  const router = useRouter();

  const [formError, setFormError] = useState<
    Record<string, validationInterface>
  >({});

  const [userData, setUserData] = useState<I>({
    fName: "",
    lName: "",
    userEmail: "",
    uniqueUserName: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const debouncingTimeId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const userSignUpDataValidation = z.object({
    fName: z.string().min(3, "First name must be at least 3 characters"),
    lName: z.string().min(3, "Last name must be at least 3 characters"),
    userEmail: z.email("Please enter a valid email address"),
    uniqueUserName: z.string().min(3, "Username must be at least 3 characters"),
  });

  function onInputValueChange(
    event: ChangeEvent<HTMLInputElement>,
    field: string
  ) {
    const input = event.target.value;

    setUserData((prev) => ({
      ...prev,
      [field]: input,
    }));
  }

  async function userRegistration(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isLoading) return;

    const isValidUserData = userSignUpDataValidation.safeParse(userData);

    if (!isValidUserData.success) {
      const errorMap: Record<string, validationInterface> = {};
      isValidUserData.error.issues.forEach((e) => {
        const fieldName = e.path[0] as string;
        errorMap[fieldName] = {
          success: false,
          message: e.message,
        };
      });

      setFormError(errorMap);
      return;
    }

    if (!formError.userEmail?.success || !formError.uniqueUserName?.success)
      return;

    const request = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isValidUserData.data)
    });

    const response = await request.json();

    if(response.success) {
      router.push("/");
    }

    console.log("response", response);
  }

  function onEmailInput(e: ChangeEvent<HTMLInputElement>) {
    setIsLoading(true);
    const input = e.target.value;

    if (debouncingTimeId.current) clearTimeout(debouncingTimeId.current);

    debouncingTimeId.current = setTimeout(async () => {
      const isValidEmail = z
        .email("Please enter a valid email address")
        .safeParse(input);

      if (!isValidEmail.success) {
        setFormError((prev) => ({
          ...prev,
          userEmail: {
            success: false,
            message: isValidEmail.error.issues[0].message,
          },
        }));
        setIsLoading(false);
        return;
      }

      try {
        const request = await fetch("/api/auth/uniqueEmail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enteredEmail: isValidEmail.data }),
        });

        const response = await request.json();

        if (!response.success) {
          setFormError((prev) => ({
            ...prev,
            userEmail: { success: false, message: response.error },
          }));
        } else {
          setFormError((prev) => ({
            ...prev,
            userEmail: { success: true, message: response.message },
          }));
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error validating email:", error);
        setFormError((prev) => ({
          ...prev,
          userEmail: { success: false, message: "Network error. Try again." },
        }));

        setIsLoading(false);
      }
    }, 500);
  }

  function onUserNameInput(e: ChangeEvent<HTMLInputElement>) {
    setIsLoading(true);
    const input = e.target.value;

    if (debouncingTimeId.current) {
      clearTimeout(debouncingTimeId.current);
    }

    debouncingTimeId.current = setTimeout(async () => {
      const isValidUserName = z
        .string()
        .min(3, "Username must be at least 3 characters")
        .safeParse(input);

      if (!isValidUserName.success) {
        setFormError((prev) => ({
          ...prev,
          uniqueUserName: {
            success: false,
            message: isValidUserName.error.issues[0].message,
          },
        }));
        setIsLoading(false);
        return;
      }

      try {
        const request = await fetch("/api/auth/uniqueUserName", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uniqueUserName: isValidUserName.data,
          }),
        });

        const response = await request.json();

        if (!response.success) {
          setFormError((prev) => ({
            ...prev,
            uniqueUserName: {
              success: false,
              message: response.error,
            },
          }));
        } else {
          setFormError((prev) => ({
            ...prev,
            uniqueUserName: {
              success: true,
              message: response.message,
            },
          }));
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error validating username:", error);
        setFormError((prev) => ({
          ...prev,
          uniqueUserName: {
            success: false,
            message: "Network error. Try again.",
          },
        }));
        setIsLoading(false);
      }
    }, 500);
  }

  return (
    <div className="min-h-dvh min-w-dvw flex items-center justify-center">
      <div className="max-w-[550px] min-h-fit flex flex-col items-center justify-center border-[1px] rounded-xl mx-[5px] sm:mx-[20px] my-[5px] sm:my-[20px] px-[20px] py-[20px] shadow-2xl">
        <form
          className="flex flex-col items-center justify-center gap-[10px] sm:gap-[20px]"
          onSubmit={(e: FormEvent<HTMLFormElement>) => userRegistration(e)}
        >
          <div className="flex flex-col gap-[2px] sm:gap-[5px]">
            <label className="text-black font-[700] text-[17px] sm:text-[20px]">
              Sign Up
            </label>
            <p className="text-gray-600 text-[12px] sm:text-sm font-[600]">
              Create your account to join exciting chess matches and challenge
              your friends. Let the game begin!
            </p>
          </div>

          <div className="flex items-center justify-between gap-[10px] sm:gap-[20px] w-full flex-col sm:flex-row">
            <div className="flex flex-col gap-[5px] sm:gap-[10px] w-full">
              <label className="text-black font-[700] text-[14px] sm:text-[16px]">
                First Name
              </label>
              <input
                type="text"
                placeholder="John"
                className="border-[1px] px-[10px] py-[5px] rounded-lg text-[15px]"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onInputValueChange(e, "fName")
                }
              />
              <p className="mt-[-5px] text-[11px] sm:text-[12px] text-red-600 font-[600]">
                {formError.fName?.message || ""}
              </p>
            </div>
            <div className="flex flex-col gap-[5px] sm:gap-[10px] w-full">
              <label className="text-black font-[700] text-[14px] sm:text-[16px]">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Doe"
                className="border-[1px] px-[10px] py-[5px] rounded-lg text-[15px]"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onInputValueChange(e, "lName")
                }
              />
              <p className="mt-[-5px] text-[11px] sm:text-[12px] text-red-600 font-[600]">
                {formError.lName?.message || ""}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-[5px] sm:gap-[10px] w-full">
            <label className="text-black font-[700] text-[14px] sm:text-[16px]">
              Email Address
            </label>
            <input
              type="email"
              placeholder="eg.johnDoe@gmail.com"
              className="border-[1px] px-[10px] py-[5px] rounded-lg text-[15px]"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                onInputValueChange(e, "userEmail");
                onEmailInput(e);
              }}
            />
            <p
              className={`mt-[-5px] text-[11px] sm:text-[12px] ${
                formError.userEmail?.success === true
                  ? "text-lime-700"
                  : "text-red-600"
              } font-[600]`}
            >
              {formError.userEmail?.message || ""}
            </p>
          </div>

          <div className="flex flex-col gap-[5px] sm:gap-[10px] w-full">
            <label className="text-black font-[700] text-[14px] sm:text-[16px]">
              Your Unique Username
            </label>
            <input
              type="text"
              placeholder="eg.johnDoe01"
              className="border-[1px] px-[10px] py-[5px] rounded-lg text-[15px]"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                onInputValueChange(e, "uniqueUserName");
                onUserNameInput(e);
              }}
            />
            <p
              className={`mt-[-5px] text-[11px] sm:text-[12px] font-[600] ${
                formError.uniqueUserName?.success
                  ? "text-lime-700"
                  : "text-red-600"
              }`}
            >
              {formError.uniqueUserName?.message || ""}
            </p>
          </div>

          <button
            className={`w-full py-[8px] sm:py-[10px] bg-black text-[#f9f6ed] font-[700] rounded-lg hover:bg-neutral-600 duration-300 text-[15px] sm:text-[16px] ${
              isLoading
                ? "opacity-60 cursor-not-allowed"
                : "opacity-100 cursor-pointer"
            }`}
          >
            Register
          </button>

          <Link
            href="/auth/signin"
            className="text-[14px] font-[500] cursor-pointer hover:underline"
          >
            Already have an account?
          </Link>
        </form>
      </div>
    </div>
  );
};

export default page;
