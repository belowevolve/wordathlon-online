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
  const { grid, letters, handleLetterClick, info, totalLevelsFinished } =
    useGameStore(
      useShallow((state) => ({
        grid: state.grid,
        letters: Object.entries(state.letters).sort(),
        handleLetterClick: state.handleLetterClick,
        info: state.info,
        totalLevelsFinished: state.totalLevelsFinished,
      })),
    );

  const { focusedButton, handleKeyDown } = useKeyboardControlStore();

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <h3 className="text-center text-2xl font-bold">
        Total levels finished: {totalLevelsFinished}
      </h3>
      <h3 className="text-center text-2xl font-bold">{info}</h3>
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
          if (rowIndex > 0 && rowIndex < 4 && colIndex > 0 && colIndex < 4) {
            const letterIndex = rowIndex + colIndex - (2 - rowIndex) * 2;
            if (letters[letterIndex]) {
              const isFocused =
                rowIndex === focusedButton.row &&
                colIndex === focusedButton.col;
              const letter = letters[letterIndex][0];
              const count = letters[letterIndex][1];
              return (
                <CellButton
                  key={key}
                  handleClick={handleLetterClick}
                  letter={letter}
                  count={count}
                  isFocused={isFocused}
                />
              );
            }
            return <Cell key={key} className="bg-transparent" />;
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
