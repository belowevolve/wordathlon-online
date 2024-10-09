import { m, stagger, useAnimate } from "framer-motion";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGameStore } from "./model";
import { Cell, CellButton, containerVariants } from "./ui";
import { OWordStatus } from "./model/types";

const InputPanel = () => {
  const { input, handleInputClick, wordStatus, lastInputIndexAdded } =
    useGameStore(
      useShallow((state) => ({
        input: state.input,
        handleInputClick: state.handleInputClick,
        wordStatus: state.wordStatus,
        lastInputIndexAdded: state.lastInputIndexAdded,
      })),
    );
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (wordStatus.message === OWordStatus.ERROR) {
      animate(
        "button",
        {
          rotate: [0, -2, 0, 2, 0],
          y: [0, -10, 0],
          backgroundColor: [
            "var(--cell-hsl)",
            "var(--cell-error-hsl)",
            "var(--cell-hsl)",
          ],
        },
        {
          delay: stagger(0.15, { from: lastInputIndexAdded }),
          rotate: { repeat: 3, duration: 0.2 },
          duration: 0.2 * 3,
          ease: "easeInOut",
        },
      );
    }
  }, [wordStatus]);

  return (
    <m.div
      ref={scope}
      className="grid grid-cols-5 gap-1"
      variants={containerVariants}
      custom={1.3}
      initial="initial"
      animate="animate"
    >
      {input.map((inputLetter, index) =>
        inputLetter ? (
          <CellButton
            key={`input-${index}`}
            index={index}
            handleClick={handleInputClick}
            letter={inputLetter}
          />
        ) : (
          <Cell key={`input-${index}`} className="bg-transparent shadow-3d " />
        ),
      )}
    </m.div>
  );
};

InputPanel.displayName = "InputPanel";
export { InputPanel };
