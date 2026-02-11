"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useRef,
  useState,
} from "react";

export interface NotificationI {
  id: number;
  notificationMessage: string;
  notificationChildMessages: string[];
  notificationType: "success" | "error" | "warning" | "info" | "";
  animationType: "notification" | "alert";
  showActionButtons: boolean;
  payload?: any;
}

interface I {
  notificationData: NotificationI;
  setNotificationData: Dispatch<SetStateAction<NotificationI>>;
  showAlert: (data: Omit<NotificationI, "id">) => Promise<any>;
  resolveAlert: (value: any) => void;
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
  showAlert: async () => null,
  resolveAlert: () => {},
});

const NotificationContextProvider = ({ children }: { children: ReactNode }) => {
  const [notificationData, setNotificationData] = useState<NotificationI>({
    id: 0,
    notificationMessage: "",
    notificationChildMessages: [],
    notificationType: "",
    animationType: "notification",
    showActionButtons: false,
  });

  const resolverRef = useRef<(value: any) => void>(null);

  const showAlert = (data: Omit<NotificationI, "id">) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;

      setNotificationData({
        ...data,
        id: Date.now(),
      });
    });
  };

  const resolveAlert = (value: any) => {
    if (resolverRef.current) {
      resolverRef.current(value);
      resolverRef.current = null;
    }
  };

  const values = {
    notificationData,
    setNotificationData,
    showAlert,
    resolveAlert,
  };

  return (
    <NotificationContext.Provider value={values}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContextProvider;
