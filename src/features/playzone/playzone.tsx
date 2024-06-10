import { m } from "framer-motion";
import { memo, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import Cell from "./ui/cell";
import CellButton from "./ui/cell-button";
import { useGameStore } from "./model";
import { useKeyboardControlStore } from "./model";
import HintButton from "./ui/hint-button";
import InputPanel from "./input-panel";
import { containerVariants } from "./ui/animation-variants";

export const Playzone = memo(() => {
  const { grid, letters, handleLetterClick } = useGameStore(
    useShallow((state) => ({
      grid: state.grid,
      letters: Object.entries(state.letters).sort(),
      handleLetterClick: state.handleLetterClick,
    })),
  );

  const { focusedButton, handleKeyDown } = useKeyboardControlStore();

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <InputPanel />
      <m.div
        className="relative grid grid-cols-5 place-items-center gap-1"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {Array.from({ length: 25 }, (_, index) => {
          const rowIndex = Math.floor(index / 5);
          const colIndex = index % 5;
          const key = `${rowIndex}-${colIndex}`;
          if (rowIndex < 4 && rowIndex > 0 && colIndex > 0 && colIndex < 4) {
            const isFocused =
              rowIndex === focusedButton.row && colIndex === focusedButton.col;
            const letterIndex = rowIndex + colIndex - (2 - rowIndex) * 2;
            const letter = letters[letterIndex][0];
            const count = letters[letterIndex][1];
            return (
              <CellButton
                key={key}
                handleClick={handleLetterClick}
                count={count}
                letter={letter}
                isFocused={isFocused}
              />
            );
          }
          const cell = grid[key];
          return (
            <Cell
              key={key}
              className="bg-opacity-50"
              revealed={cell.revealed}
              letter={cell.letter}
            />
          );
        })}
        <HintButton />
      </m.div>
    </>
  );
});

Playzone.displayName = "Playzone";
