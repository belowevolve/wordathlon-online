import { m } from "framer-motion";
import { memo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGameStore } from "./model";
import { Cell, CellButton, containerVariants } from "./ui";

const InputPanel = () => {
  const { input, handleInputClick } = useGameStore(
    useShallow((state) => ({
      input: state.input,
      handleInputClick: state.handleInputClick,
    })),
  );
  return (
    <m.div
      className="my-1 flex gap-1"
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
          <Cell key={`input-${index}`} className="shadow-3d bg-transparent" />
        )
      )}
    </m.div>
  );
};

InputPanel.displayName = "InputPanel";
export default memo(InputPanel);
