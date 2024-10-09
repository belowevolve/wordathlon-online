import { memo } from "react";
import { useShallow } from "zustand/react/shallow";
import { InputPanel } from "./input-panel";
import { useGameStore } from "./model";
import { PlayGrid } from "./play-grid";
import { HintButton } from "./ui";
import { WordStatusPanel } from "./word-status-panel";

export const Playzone = memo(() => {
  const { totalLevelsFinished } = useGameStore(
    useShallow((state) => ({
      totalLevelsFinished: state.totalLevelsFinished,
    })),
  );

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-stretch justify-center gap-1 px-1">
      <WordStatusPanel />

      <InputPanel />
      <PlayGrid />
      <HintButton />

      <h3 className="text-center text-2xl font-bold">
        Total levels finished: {totalLevelsFinished}
      </h3>
    </div>
  );
});

Playzone.displayName = "Playzone";
