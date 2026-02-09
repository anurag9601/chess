"use client";
import { NotificationContext } from "@/context/Notification.context";
import { UserContext } from "@/context/User.context";
import react, {
  ChangeEvent,
  FormEvent,
  FormEventHandler,
  MouseEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface editUserNameI {
  isUnquieUserNameEditable: boolean;
  data: string;
  isLoading: boolean;
  success: boolean;
  message: string;
}

const Header = () => {
  const { userData, setUserData } = useContext(UserContext);
  const { setNotificationData } = useContext(NotificationContext);
  const userInfoContainerRef = useRef<HTMLDivElement | null>(null);
  const [userInfoWindowControler, setUserInfoWindowControler] = useState<{
    isWindowOpen: boolean;
    editUserNameData: editUserNameI;
  }>({
    isWindowOpen: false,
    editUserNameData: {
      isUnquieUserNameEditable: false,
      data: "",
      isLoading: false,
      success: false,
      message: "",
    },
  });

  const debouncingTimeId = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleToggleUserWindow() {
    setUserInfoWindowControler((prev) => ({
      ...prev,
      isWindowOpen: !prev.isWindowOpen,
    }));
  }

  function handleToggleEditUserName() {
    setUserInfoWindowControler((prev) => ({
      ...prev,
      editUserNameData: {
        ...prev.editUserNameData,
        isUnquieUserNameEditable:
          !prev.editUserNameData.isUnquieUserNameEditable,
      },
    }));
  }

  async function onChangeOfUniqueUserName(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target.value;

    if (input.length === 0) {
      setUserInfoWindowControler((prev) => ({
        ...prev,
        editUserNameData: {
          ...prev.editUserNameData,
          data: input,
          isLoading: false,
          success: false,
          message: "",
        },
      }));

      if (debouncingTimeId.current) clearTimeout(debouncingTimeId.current);
      return;
    }

    if (input.length < 3) {
      setUserInfoWindowControler((prev) => ({
        ...prev,
        editUserNameData: {
          ...prev.editUserNameData,
          data: input,
          success: false,
          message: "A unique username must be at least 3 characters long.",
        },
      }));

      if (debouncingTimeId.current) clearTimeout(debouncingTimeId.current);
      return;
    }

    if (debouncingTimeId.current) {
      clearTimeout(debouncingTimeId.current);
    }

    setUserInfoWindowControler((prev) => ({
      ...prev,
      editUserNameData: {
        ...prev.editUserNameData,
        data: input,
        isLoading: true,
      },
    }));

    debouncingTimeId.current = setTimeout(async () => {
      try {
        const request = await fetch("/api/auth/uniqueUserName", {
          method: "POST",
          body: JSON.stringify({
            uniqueUserName: input,
          }),
        });

        const response = await request.json();

        if (!response.success) {
          setUserInfoWindowControler((prev) => ({
            ...prev,
            editUserNameData: {
              ...prev.editUserNameData,
              data: input,
              isLoading: false,
              success: false,
              message: response.error,
            },
          }));

          setNotificationData({
            id: Date.now(),
            notificationMessage: response.error,
            notificationChildMessages: [],
            notificationType: "error",
          });
        } else if (response.success) {
          setUserInfoWindowControler((prev) => ({
            ...prev,
            editUserNameData: {
              ...prev.editUserNameData,
              data: input,
              isLoading: false,
              success: true,
              message:
                "Great! This username is available. Press Enter to proceed.",
            },
          }));

          setNotificationData({
            id: Date.now(),
            notificationMessage:
              "Great! This username is available. Press Enter to proceed.",
            notificationChildMessages: [],
            notificationType: "success",
          });
        }
      } catch (error) {
        console.error("Error validating email:", error);
        setUserInfoWindowControler((prev) => ({
          ...prev,
          editUserNameData: {
            ...prev.editUserNameData,
            data: input,
            isLoading: false,
            success: false,
            message: "Network error. Please try again.",
          },
        }));

        setNotificationData({
          id: Date.now(),
          notificationMessage: "Network error. Please try again.",
          notificationChildMessages: [],
          notificationType: "error",
        });
      }
    }, 1000);
  }

  async function handleOnUserNameSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (userInfoWindowControler.editUserNameData.success === false) return;

    const request = await fetch("/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "applicaiton/json" },
      body: JSON.stringify({
        userId: userData?._id,
        newUniqueUserName: userInfoWindowControler.editUserNameData.data,
      }),
    });

    const response = await request.json();

    if (response.success === true) {
      setUserData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          uniqueUserName: userInfoWindowControler.editUserNameData.data,
        };
      });

      setUserInfoWindowControler((prev) => ({
        ...prev,
        editUserNameData: {
          isUnquieUserNameEditable: false,
          data: "",
          isLoading: false,
          success: false,
          message: "",
        },
      }));

      setNotificationData({
        id: Date.now(),
        notificationMessage: response.message,
        notificationChildMessages: [],
        notificationType: "success",
      });
    } else if (response.success === false) {
      setNotificationData({
        id: Date.now(),
        notificationMessage: response.error,
        notificationChildMessages: [],
        notificationType: "error",
      });
    }
  }

  async function handleOnSignOut() {
    const request = await fetch("/api/auth/signout");

    const response = await request.json();

    if (response.success === true) {
      setNotificationData({
        id: Date.now(),
        notificationMessage: response.message,
        notificationChildMessages: [],
        notificationType: "success",
      });

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else if (response.success === false) {
      setNotificationData({
        id: Date.now(),
        notificationMessage: response.error,
        notificationChildMessages: [],
        notificationType: "error",
      });
    }
  }

  useEffect(() => {
    function handleClickOutSide(event: MouseEvent) {
      if (
        userInfoContainerRef.current &&
        !userInfoContainerRef.current.contains(event.target as Node)
      ) {
        setUserInfoWindowControler({
          isWindowOpen: false,
          editUserNameData: {
            isUnquieUserNameEditable: false,
            data: "",
            isLoading: false,
            success: false,
            message: "",
          },
        });
      }
    }

    document.addEventListener("mousedown", handleClickOutSide);

    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);

  return userData ? (
    <div className="flex items-center justify-between absolute top-[10px] right-[10px] z-[9999] w-full">
      <div></div>
      <div
        className="h-[40px] w-[40px] flex items-center justify-center rounded-full cursor-pointer border-[1px] border-[#99a1af] shadow-md relative group"
        ref={userInfoContainerRef}
        onClick={(e: MouseEvent<HTMLDivElement>) => {
          e.stopPropagation();
          handleToggleUserWindow();
        }}
      >
        <img
          src="images/user-pawn.png"
          alt="user"
          className={`h-[25px] w-[25px] transition-all ${
            !userInfoWindowControler.isWindowOpen && "hover:scale-[1.1]"
          }`}
        />
        {!userInfoWindowControler.isWindowOpen && (
          <div className="px-[8px] py-[2px] rounded-lg absolute top-[38px] bg-gradient-to-r from-[#000000] to-[#3b3b3b] text-[#f4f4f4] font-[600] opacity-0 hidden group-hover:opacity-100 group-hover:block transition-all duration-300">
            user
          </div>
        )}

        {userInfoWindowControler.isWindowOpen && (
          <div
            className="absolute top-[45px] right-[3px] border-[1px] border-[#99a1af] shadow-lg rounded-lg h-fit w-[180px] p-[10px] bg-[#f9f6ed]"
            onClick={(e: MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
            }}
          >
            <form onSubmit={handleOnUserNameSubmit}>
              {userInfoWindowControler.editUserNameData
                .isUnquieUserNameEditable ? (
                <div className="flex flex-col gap-[3px] w-full">
                  <label className="text-black font-[600] text-[12px]">
                    New Unique Username
                  </label>
                  <input
                    type="text"
                    placeholder={`e.g. ${userData.uniqueUserName}`}
                    className="border-[1px] px-[10px] py-[5px] rounded-lg text-[13px]"
                    onClick={(e: MouseEvent<HTMLInputElement>) => {
                      e.stopPropagation();
                    }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      onChangeOfUniqueUserName(e)
                    }
                  />
                  <p
                    className={`mt-[5px] text-[10px] ${
                      userInfoWindowControler.editUserNameData.success === true
                        ? "text-lime-700"
                        : "text-red-600"
                    } font-[500]`}
                  >
                    {userInfoWindowControler.editUserNameData.message || ""}
                  </p>
                </div>
              ) : (
                <div className="flex itmes-center justify-between gap-[10px]">
                  <p className="break-all text-[13px] font-[600]">
                    {userData.uniqueUserName}
                  </p>
                  <img
                    src="images/edit.png"
                    alt="edit"
                    className="h-[20px] w-[20px]"
                    onClick={(e: MouseEvent<HTMLImageElement>) => {
                      e.stopPropagation();
                      handleToggleEditUserName();
                    }}
                  />
                </div>
              )}
            </form>

            <hr className="h-[1px] border-none outline-none bg-[#99a1af] rounded-lg my-[8px]" />

            <button
              className="w-full py-[5px] bg-black text-[#f9f6ed] font-[600] rounded-lg hover:bg-neutral-600 duration-300 text-[13px] cursor-pointer"
              onClick={handleOnSignOut}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default Header;
