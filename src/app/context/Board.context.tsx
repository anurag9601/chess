"use client";

import { initialBoard } from "@/functions/initialBoard";
import React, { createContext, Dispatch, SetStateAction } from "react";

interface I {
    board: string[][];
    setBoard: Dispatch<SetStateAction<string[][]>>;
    selectedPiece: null | number[];
    setSelectedPiece: Dispatch<SetStateAction<null | number[]>>;
    turnOf: "Black" | "White";
    setTurnOf: Dispatch<SetStateAction<"Black" | "White">>
}

export const BoardContext = createContext<I>({
    board: initialBoard,
    setBoard: () => {},
    selectedPiece: null,
    setSelectedPiece: () => {},
    turnOf: "White",
    setTurnOf: () => {}
});

const BoardContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [board, setBoard] = React.useState<string[][]>(initialBoard);

  const [selectedPiece, setSelectedPiece] = React.useState<null | number[]>(
    null
  );

  const [turnOf, setTurnOf] = React.useState<"Black" | "White">("White");

  const values = {
    board,
    setBoard,
    selectedPiece,
    setSelectedPiece,
    turnOf,
    setTurnOf
  };

  return <BoardContext.Provider value={values}></BoardContext.Provider>;
};

export default BoardContextProvider;
