import { create } from "zustand";
import { useGameStore } from "./game-store";
import { devtools } from "zustand/middleware";

interface UiState {
  focusedButton: { row: number; col: number };
}

interface UiActions {
  handleKeyDown: (event: KeyboardEvent) => void;
}

export const useKeyboardControlStore = create<UiState & UiActions>()(
  devtools(
    (set) => ({
      focusedButton: { row: 0, col: 0 },

      handleKeyDown: (event) =>
        set(
          (state) => {
            let { row, col } = state.focusedButton;
            switch (event.code) {
              case "ArrowUp":
                row = Math.max(row - 1, 1);
                if (col === 0) col = 1;
                break;
              case "ArrowDown":
                row = Math.min(row + 1, 3);
                if (col === 0) col = 1;
                break;
              case "ArrowLeft":
                col = Math.max(col - 1, 1);
                if (row === 0) row = 1;
                break;
              case "ArrowRight":
                col = Math.min(col + 1, 3);
                if (row === 0) row = 1;
                break;
              case "KeyH":
                useGameStore.getState().revealLetter();
                return state;
              case "Backspace":
                useGameStore.getState().deleteLastLetter();
                return state;
              default:
                return state;
            }
            return { focusedButton: { row, col } };
          },
          false,
          "key-down",
        ),
    }),
    {
      store: "keyboard-control",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);
