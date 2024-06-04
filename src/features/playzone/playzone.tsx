import { cn } from "@/shared/lib/utils";
import { Fragment, useCallback, useEffect, useState } from "react";
import LetterButton from "./letterButton";
import {
  useGameStore,
  useKeyboardControlStore,
} from "@/features/playzone/model";
import { Search } from "lucide-react";
import { m } from "framer-motion";

const container = {
  initial: { opacity: 0 },
  animate: (i: number) => ({
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: i,
    },
  }),
};

const square = {
  initial: {
    scale: 0,
  },
  animate: {
    scale: 1,
  },
};
export const Playzone = () => {
  const {
    input,
    letters,
    grid,
    handleLetterClick,
    handleInputClick,
    revealLetter,
  } = useGameStore((state) => ({
    input: state.input,
    letters: state.letters,
    grid: state.grid,
    handleLetterClick: state.handleLetterClick,
    handleInputClick: state.handleInputClick,
    revealLetter: state.revealLetter,
  }));

  const { focusedButton, handleKeyDown } = useKeyboardControlStore();
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <m.div
        className="my-1 flex gap-1"
        variants={container}
        custom={1.3}
        initial="initial"
        animate="animate"
      >
        {input.map((inputLetter, index) =>
          inputLetter ? (
            <LetterButton
              key={`input-${index}`}
              className={cn("bg-transparent", {
                "bg-white": inputLetter,
              })}
              onClick={() => handleInputClick(index)}
            >
              {inputLetter?.toUpperCase()}
            </LetterButton>
          ) : (
            <m.div
              variants={square}
              key={`input-${index}`}
              className="size-24 rounded-md shadow-3d"
            ></m.div>
          ),
        )}
      </m.div>

      <m.div
        className="relative grid grid-cols-5 place-items-center gap-1"
        variants={container}
        initial="initial"
        animate="animate"
      >
        {Array.from({ length: 5 * 5 }).map((_, index) => {
          const rowIndex = Math.floor(index / 5);
          const colIndex = index % 5;
          const key = `${rowIndex}-${colIndex}`;
          if (rowIndex < 4 && rowIndex > 0 && colIndex > 0 && colIndex < 4) {
            return <div key={key} className="size-24" />;
          }
          const cell = grid[key];
          return (
            <m.div
              key={key}
              variants={square}
              className="grid size-24 place-items-center rounded-md bg-white bg-opacity-50 text-5xl"
            >
              {cell.revealed && (
                <m.span variants={square}>{cell.letter}</m.span>
              )}
            </m.div>
          );
        })}
        {letters && (
          <div className="absolute grid grid-cols-3 gap-1">
            {Object.entries(letters)
              .sort()
              .map(([letter, count], index) => {
                const row = Math.floor(index / 3);
                const col = index % 3;
                const isFocused =
                  row === focusedButton.row && col === focusedButton.col;
                return (
                  <LetterButton
                    key={letter}
                    onClick={() => handleLetterClick(letter)}
                    isFocused={isFocused}
                  >
                    {count > 0 && letter.toUpperCase()}
                    <p className="absolute bottom-2 right-2 text-lg leading-none">
                      {count > 0 && count}
                    </p>
                  </LetterButton>
                );
              })}
          </div>
        )}
        <LetterButton
          className="absolute -bottom-14 flex h-12 gap-1 p-3 text-lg"
          onClick={revealLetter}
        >
          <Search />
          Hint
        </LetterButton>
      </m.div>
    </>
  );
};
