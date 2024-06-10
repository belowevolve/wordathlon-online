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
      className="cell absolute -bottom-14 flex h-12 gap-1 p-3 text-lg shadow-3d"
      onClick={revealLetter}
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
