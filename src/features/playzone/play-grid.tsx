import { m } from "framer-motion";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGameStore, useKeyboardControlStore } from "./model";
import { Cell, CellButton, containerVariants } from "./ui";

const PlayGrid = () => {
  const { grid, letters, handleLetterClick } = useGameStore(
    useShallow((state) => ({
      grid: state.grid,
      letters: Object.entries(state.letters).sort(),
      handleLetterClick: state.handleLetterClick,
    })),
  );
  const focusedButton = useKeyboardControlStore(
    useShallow((state) => state.focusedButton),
  );
  const handleKeyDown = useKeyboardControlStore((state) => state.handleKeyDown);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <m.div
      className="grid grid-cols-5 gap-1"
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
          const isFocused =
            rowIndex === focusedButton.row && colIndex === focusedButton.col;
          if (letters[letterIndex]) {
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
          return (
            <CellButton
              aria-hidden
              isFocused={isFocused}
              key={key}
              count={0}
              letter={""}
              handleClick={handleLetterClick}
              className=" bg-transparent"
            />
          );
        }
        const cell = grid[key];
        return (
          <Cell
            key={key}
            className="grid place-items-center bg-cell/50"
            revealed={cell.revealed}
            letter={cell.letter}
          />
        );
      })}
    </m.div>
  );
};

export { PlayGrid };
