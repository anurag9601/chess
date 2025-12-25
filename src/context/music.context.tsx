"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

interface controllerI {
  music: boolean;
  sound: boolean;
}

interface I {
  controller: controllerI;
  setController: Dispatch<SetStateAction<controllerI>>;
}

export const MusicContext = createContext<I>({
  controller: {
    music: true,
    sound: true,
  },
  setController: () => {},
});

const MusicContextProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [controller, setController] = useState<controllerI>({
    music: true,
    sound: true,
  });

  const isSoundOn = useRef<boolean>(true);

  function clickSound() {
    audioRef.current = new Audio("/sound/tap.mp3");
    audioRef.current.volume = 1;

    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }

  function playSound(e: MouseEvent) {
    if (!isSoundOn.current) return;

    const target = (e.target as HTMLElement).closest("[data-click-sound]");

    if (!target) return;

    clickSound();
  }

  useEffect(() => {
    isSoundOn.current = controller.sound;
  }, [controller.sound]);

  useEffect(() => {
    document.addEventListener("click", playSound);

    return () => {
      document.removeEventListener("click", playSound);
    };
  }, []);

  const values = {
    controller,
    setController,
  };

  return (
    <MusicContext.Provider value={values}>{children}</MusicContext.Provider>
  );
};

export default MusicContextProvider;
