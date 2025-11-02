import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BoardContextProvider from "@/context/Board.context";
import UserContextProvider from "@/context/User.context";
import AuthInitializer from "@/components/auth-initializer/AuthInitializer";

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
            <AuthInitializer />
            {children}
          </BoardContextProvider>
        </UserContextProvider>
      </body>
    </html>
  );
}
