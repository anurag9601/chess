"use client";

import { BoardContext } from "@/app/context/Board.context";
import { getpieceImage } from "@/functions/initialBoard";
import React, { useContext } from "react";

interface I {
  boxpiece: string;
  row: number;
  col: number;
}

const BoardBox = ({ boxpiece, row, col }: I) => {
  const { setSelectedPiece, turnOf } = useContext(BoardContext);

  const isBlackBox =
    ((row + 1) % 2 !== 0 && (col + 1) % 2 === 0) ||
    ((row + 1) % 2 === 0 && (col + 1) % 2 !== 0);

  const setSelectedPieceIndexes = (): void => {
    const [type, piece] = boxpiece.split("-");

    if (type.toLowerCase() === turnOf.toLowerCase()) {
      setSelectedPiece([row, col]);
    }
  };

  return (
    <div
      className={`h-[50px] w-[50px] ${
        isBlackBox ? "blackBoardBox" : "whiteBoardBox"
      } flex items-center justify-center`}
      onClick={() => setSelectedPieceIndexes()}
    >
      {getpieceImage(boxpiece) ? (
        <img
          src={getpieceImage(boxpiece)}
          alt=""
          className="h-[40px] w-[40px]"
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default BoardBox;
