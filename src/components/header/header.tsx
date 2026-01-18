"use client";
import { UserContext } from "@/context/User.context";
import react, {
  ChangeEvent,
  MouseEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface editUserNameI {
  isUnquieUserNameEditable: boolean;
  success: boolean;
  message: string;
}

const Header = () => {
  const { userData } = useContext(UserContext);
  const userInfoContainerRef = useRef<HTMLDivElement | null>(null);
  const [userInfoWindowControler, setUserInfoWindowControler] = useState<{
    isWindowOpen: boolean;
    editUserNameData: editUserNameI;
  }>({
    isWindowOpen: false,
    editUserNameData: {
      isUnquieUserNameEditable: false,
      success: false,
      message: "",
    },
  });

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
  };

  function onChangeOfUniqueUserName(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target.value;

    if(input.length < 3) {
      setUserInfoWindowControler((prev) => ({
        ...prev,
        editUserNameData: {
          ...prev.editUserNameData,
          success: false,
          message: "A unique username must be at least 3 characters long."
        }
      }))
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
            className="absolute top-[45px] right-[3px] border-[1px] border-[#99a1af] shadow-lg rounded-lg h-fit w-[180px] p-[10px]"
            onClick={(e: ChangeEvent<HTMLDivElement>) => {
              e.stopPropagation();
            }}
          >
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
                  onClick={(e: ChangeEvent<HTMLInputElement>) => {
                    e.stopPropagation();
                  }}
                />
                {/* <p
              className={`mt-[-5px] text-[11px] sm:text-[12px] ${
                signInData.email.success === true
                  ? "text-lime-700"
                  : "text-red-600"
              } font-[600]`}
            >
              {signInData.email.message || ""}
            </p> */}
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

            <hr className="h-[1px] border-none outline-none bg-[#99a1af] rounded-lg my-[8px]" />

            <button className="w-full py-[5px] bg-black text-[#f9f6ed] font-[600] rounded-lg hover:bg-neutral-600 duration-300 text-[13px] cursor-pointer">
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default Header;
