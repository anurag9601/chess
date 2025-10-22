"use client";

import { initialBoard } from "@/functions/initialBoard";
import React, { createContext, Dispatch, SetStateAction } from "react";

interface I {
    board: string[][];
    setBoard: Dispatch<SetStateAction<string[][]>>;
    selectedPiece: null | number[];
    setSelectedPiece: Dispatch<SetStateAction<null | number[]>>;
    turnOf: "Black" | "White";
    setTurnOf: Dispatch<SetStateAction<"Black" | "White">>;
    moves: number[][];
    setMoves: Dispatch<SetStateAction<number[][]>>;
}

export const BoardContext = createContext<I>({
    board: initialBoard,
    setBoard: () => {},
    selectedPiece: null,
    setSelectedPiece: () => {},
    turnOf: "White",
    setTurnOf: () => {},
    moves: [],
    setMoves: () => {},
});

const BoardContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [board, setBoard] = React.useState<string[][]>(initialBoard);

  const [selectedPiece, setSelectedPiece] = React.useState<null | number[]>(
    null
  );

  const [turnOf, setTurnOf] = React.useState<"Black" | "White">("White");

  const [moves, setMoves] = React.useState<number[][]>([]);

  const values = {
    board,
    setBoard,
    selectedPiece,
    setSelectedPiece,
    turnOf,
    setTurnOf,
    moves,
    setMoves
  };

  return <BoardContext.Provider value={values}>
    { children }
  </BoardContext.Provider>;
};

export default BoardContextProvider;
