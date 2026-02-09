"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

interface notificationI {
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
    notificationMessage: "",
    notificationChildMessages: [],
    notificationType: "",
  },
  setNotificationData: () => {},
});

const NotificationContextProvider = ({ children }: { children: ReactNode }) => {
  const [notificationData, setNotificationData] = useState<notificationI>({
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
