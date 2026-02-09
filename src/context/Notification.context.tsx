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
  animationType: "notification" | "alert",
  showActionButtons: boolean;
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
    animationType: "notification",
    showActionButtons: false,
  },
  setNotificationData: () => {},
});

const NotificationContextProvider = ({ children }: { children: ReactNode }) => {
  const [notificationData, setNotificationData] = useState<notificationI>({
    id: 0,
    notificationMessage: "",
    notificationChildMessages: [],
    notificationType: "",
    animationType: "notification",
    showActionButtons: false,
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
