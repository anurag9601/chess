"use client";

import { generateJWTDataType } from "@/lib/jsonWebtoken";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

interface I {
  userData: generateJWTDataType | null;
  setUserData: Dispatch<SetStateAction<generateJWTDataType | null>>;
}

export const UserContext = createContext<I>({
  userData: null,
  setUserData: () => {},
});

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<generateJWTDataType | null>(null);

  const values = {
    userData,
    setUserData,
  };

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
