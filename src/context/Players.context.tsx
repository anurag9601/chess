import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

interface I {
  playerPiece: "White" | "Black";
  setCurrentPlayPiece: Dispatch<SetStateAction<"White" | "Black">>;
}

export const PlayerContext = createContext<I>({
  playerPiece: "White",
  setCurrentPlayPiece: () => {},
});

const PlayerContextProvider = ({ children }: { children: ReactNode }) => {
  const [playerPiece, setCurrentPlayPiece] = useState<"White" | "Black">(
    "White"
  );

  const values = {
    playerPiece,
    setCurrentPlayPiece,
  };

  return (
    <PlayerContext.Provider value={values}>{children}</PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
