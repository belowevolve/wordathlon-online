import { AnimatePresence, m } from "framer-motion";
import { useGameStore } from "./model";
import { useShallow } from "zustand/react/shallow";
import { OWordStatus } from "./model/types";
import { useEffect } from "react";

const WordStatusPanel = () => {
  const { wordStatus } = useGameStore(
    useShallow((state) => ({
      wordStatus: state.wordStatus,
    })),
  );
  const message = wordStatus.message;

  return (
    <div className="h-10 text-center">
      <AnimatePresence>
        {(() => {
          switch (wordStatus.message) {
            case OWordStatus.INITIAL:
              return (
                <m.h2
                  key={`word-status-${message}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {message.toUpperCase()}
                </m.h2>
              );
            case OWordStatus.ERROR:
              return (
                <m.h2
                  key={`word-status-${message}`}
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 100 }}
                >
                  {message.toUpperCase()}
                </m.h2>
              );
            default:
              return null;
          }
        })()}
      </AnimatePresence>
    </div>
  );
};

export { WordStatusPanel };
