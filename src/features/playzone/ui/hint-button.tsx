import { m } from "framer-motion";
import { Search } from "lucide-react";
import { memo } from "react";
import { useGameStore } from "../model";
import {
  buttonVariants,
  hoverFocusVariant,
  tapVariant,
} from "./animation-variants";

export const HintButton = () => {
  const revealLetter = useGameStore((state) => state.revealLetter);
  return (
    <m.div
      className="cell flex h-12 gap-1 self-center p-3 text-lg shadow-3d"
      onClick={revealLetter}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.65 }}
      whileTap={tapVariant}
      whileHover={hoverFocusVariant}
      whileFocus={hoverFocusVariant}
      variants={buttonVariants}
    >
      <Search />
      Hint
    </m.div>
  );
};

HintButton.displayName = "HintButton";

export default memo(HintButton);
