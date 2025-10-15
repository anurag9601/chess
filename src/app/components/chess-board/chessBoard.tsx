"use client";

import React, { useContext, useEffect } from "react";
import BoardBox from "../board-box/boardBox";
import { BoardContext } from "@/app/context/Board.context";

const ChessBoard = () => {

  const { board } = useContext(BoardContext);

  return (
    <div className="chessBoardCotainer h-[405px] w-[405px] border-[.1px] border-gray-400 grid grid-cols-8 grid-row-8">
      {board.map((boardRow: string[], rowIndex: number) => {
        return boardRow.map((boardCol: string, colIndex: number) => {
          return <BoardBox boxpiece={boardCol} row={rowIndex} col={colIndex} key={`${rowIndex}-${colIndex}`}/>;
        });
      })}
    </div>
  );
};

export default ChessBoard;
