"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

interface notificationI {
  id: number;
  notificationMessage: string;
  notificationChildMessages: string[];
  notificationType: "success" | "error" | "warning" | "info" | "";
}

interface I {
  notificationData: notificationI;
  setNotificationData: Dispatch<SetStateAction<notificationI>>;
}

export const NotificationContext = createContext<I>({
  notificationData: {
    id: 0,
    notificationMessage: "",
    notificationChildMessages: [],
    notificationType: "",
  },
  setNotificationData: () => {},
});

const NotificationContextProvider = ({ children }: { children: ReactNode }) => {
  const [notificationData, setNotificationData] = useState<notificationI>({
    id: 0,
    notificationMessage: "",
    notificationChildMessages: [],
    notificationType: "",
  });

  const values = {
    notificationData,
    setNotificationData,
  };

  return (
    <NotificationContext.Provider value={values}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContextProvider;
