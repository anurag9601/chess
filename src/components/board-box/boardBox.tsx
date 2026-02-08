"use client";

import { BoardContext } from "@/context/Board.context";
import { getpieceImage } from "@/functions/frontend/initialBoard";
import { bishop, king, knight, pawn, queen, rook } from "@/functions/frontend/pieceStepFunction";
import React, { useContext } from "react";

interface I {
  boxpiece: string;
  row: number;
  col: number;
}

const BoardBox = ({ boxpiece, row, col }: I) => {
  const {
    board,
    setBoard,
    selectedPiece,
    setSelectedPiece,
    turnOf,
    setTurnOf,
    moves,
    setMoves,
  } = useContext(BoardContext);

  const isBlackBox =
    ((row + 1) % 2 !== 0 && (col + 1) % 2 === 0) ||
    ((row + 1) % 2 === 0 && (col + 1) % 2 !== 0);

  const setSelectedPieceIndexes = (): void => {
    if (moves.some(([r , c]) => r === row && c === col)) {
      onMove();
    } else {
      const [type, piece] = boxpiece.split("-");

      if (type.toLowerCase() === turnOf.toLowerCase()) {
        setSelectedPiece([row, col]);
        getMovesForSelectedPiece(piece);
      }
    }
  };

  function getMovesForSelectedPiece(piece: string) {
    if (piece === "pawn") {
      setMoves(pawn(row, col, board, turnOf));
    }
    if (piece === "rook") {
      setMoves(rook(row, col, board, turnOf));
    }
    if (piece === "knight") {
      setMoves(knight(row, col, board, turnOf));
    }
    if (piece === "bishop") {
      setMoves(bishop(row, col, board, turnOf));
    }
    if (piece === "queen") {
      setMoves(queen(row, col, board, turnOf));
    }
    if (piece === "king") {
      setMoves(king(row, col, board, turnOf));
    }
  }

  function onMove() {
    const isMove = moves.some(([r, c]) => r === row && c === col);

    if (!isMove || !selectedPiece) return;

    const updatedBoard = [...board];

    if (board[row][col] === "") {
      updatedBoard[row][col] = updatedBoard[selectedPiece[0]][selectedPiece[1]];
      updatedBoard[selectedPiece[0]][selectedPiece[1]] = "";
    } else {
      updatedBoard[row][col] = board[selectedPiece[0]][selectedPiece[1]];
      updatedBoard[selectedPiece[0]][selectedPiece[1]] = "";
    }
    setBoard(updatedBoard);
    setTurnOf((prev) => (prev === "White" ? "Black" : "White"));
    setMoves([]);
    setSelectedPiece([]);
  }

  return (
    <div
      className={`h-[50px] w-[50px] ${
        selectedPiece && row === selectedPiece[0] && col === selectedPiece[1]
          ? "selectedPiece"
          : isBlackBox
          ? "blackBoardBox"
          : "whiteBoardBox"
      } flex items-center justify-center`}
      onClick={() => setSelectedPieceIndexes()}
    >
      {getpieceImage(boxpiece) ? (
        moves.some(([r, c]) => r === row && c === col) ? (
          <div
            className={`flex items-center justify-center border-[2px] border-green-800 h-full w-full bg-green-100`}
          >
            <img
              src={getpieceImage(boxpiece)}
              alt=""
              className="h-[40px] w-[40px]"
            />
          </div>
        ) : (
          <img
            src={getpieceImage(boxpiece)}
            alt=""
            className="h-[40px] w-[40px]"
          />
        )
      ) : moves.some(([r, c]) => r === row && c === col) ? (
        <img src="/pieces/step-dot.png" alt="" className="h-[15px] w-[15px]" />
      ) : (
        ""
      )}
    </div>
  );
};

export default BoardBox;
