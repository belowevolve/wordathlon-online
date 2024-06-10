"use client";

import { Playzone } from "@/features/playzone";
import { OGameStatus, useGameStore } from "@/features/playzone/model";
import { Button } from "@/shared/ui/button";
import { AnimatePresence, LazyMotion, m } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
const checkWordUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";

const variants = {
  hidden: { opacity: 0, y: -30, x: "-50%" },
  visible: { opacity: 1, y: "-50%", x: "-50%" },
};
export default function Home() {
  const { gameStatus, error, levelColor, fetchLevelWords } = useGameStore(
    useShallow((state) => ({
      gameStatus: state.gameStatus,
      error: state.error,
      levelColor: state.levelColor,
      fetchLevelWords: state.fetchLevelWords,
    })),
  );

  return (
    <LazyMotion
      features={() => import("framer-motion").then((res) => res.domAnimation)}
    >
      <main className="flex flex-col items-center">
        <style jsx global>
          {`
            body {
              background-color: ${levelColor};
            }
          `}
        </style>
        {error && <p>Error: {error}</p>}
        {gameStatus === OGameStatus.LOADING && (
          <Loader2 className="absolute left-1/2 top-1/2 animate-spin" />
        )}
        {(gameStatus === OGameStatus.ON_LVL ||
          gameStatus === OGameStatus.AFTER_LVL) && <Playzone />}
        <AnimatePresence>
          {gameStatus === OGameStatus.NOT_STARTED && (
            <m.div
              className="absolute left-1/2 top-1/2 grid max-w-xl gap-4
              border bg-background p-6 shadow-lg sm:rounded-lg"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={variants}
            >
              <h3 className="text-lg font-semibold">
                {"Hello, it's a Wordtahlon!"}
              </h3>
              <p>
                You will need to solve square shaped anagram puzzles. Click
                buttons to build a word, you can delete letters by clicking on
                them.
              </p>
              <Button autoFocus onClick={fetchLevelWords}>
                Generate level
              </Button>
            </m.div>
          )}
          {gameStatus === OGameStatus.AFTER_LVL && (
            <m.div
              className="absolute left-1/2 top-1/2 grid max-w-xl gap-4
              border bg-background p-6 shadow-lg sm:rounded-lg"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={variants}
            >
              <h3 className="text-lg font-semibold">You did this!</h3>
              <p>Click the button below to generate a new level.</p>
              <Button autoFocus onClick={fetchLevelWords}>
                Generate level
              </Button>
            </m.div>
          )}
        </AnimatePresence>
      </main>
    </LazyMotion>
  );
}
