import ChessBoard from "@/components/chess-board/chessBoard";
import FriendsListing from "@/components/friends-listing/friendsListing";
import Players from "@/components/players/Players";
import Settings from "@/components/settings/Settings";
import React from "react";

const page = () => {
  return (
    <div className="chessPlayContainer min-h-screen min-w-screen flex items-center justify-between px-[5%] py-[20px]">
      <FriendsListing />
      <Players />
      <ChessBoard />
      <Settings />
    </div>
  );
};

export default page;
