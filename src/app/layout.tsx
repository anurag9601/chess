import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BoardContextProvider from "@/context/Board.context";
import UserContextProvider from "@/context/User.context";
import AuthInitializer from "@/components/auth-initializer/AuthInitializer";
import MusicContextProvider from "@/context/Music.context";
import Header from "@/components/header/header";
import NotificationContextProvider from "@/context/Notification.context";
import Notification from "@/components/notification/notification";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Multiplayer Chess",
  description: "A mutiplayer chess game.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserContextProvider>
          <BoardContextProvider>
            <MusicContextProvider>
              <NotificationContextProvider>
                <Notification />
                <AuthInitializer />
                <Header />
                {children}
              </NotificationContextProvider>
            </MusicContextProvider>
          </BoardContextProvider>
        </UserContextProvider>
      </body>
    </html>
  );
}
