import { create } from "zustand";
import { useGameStore } from "./game-store";

interface UiState {
  focusedButton: { row: number; col: number };
}

interface UiActions {
  handleKeyDown: (event: KeyboardEvent) => void;
}

export const useKeyboardControlStore = create<UiState & UiActions>((set) => ({
  focusedButton: { row: 0, col: 0 },
  handleKeyDown: (event) =>
    set((state) => {
      let { row, col } = state.focusedButton;
      switch (event.code) {
        case "ArrowUp":
          row = Math.max(row - 1, 1);
          break;
        case "ArrowDown":
          row = Math.min(row + 1, 4 - 1);
          break;
        case "ArrowLeft":
          col = Math.max(col - 1, 1);
          break;
        case "ArrowRight":
          col = Math.min(col + 1, 4 - 1);
          break;
        case "KeyH":
          useGameStore.getState().revealLetter();
          break;
        case "Backspace":
          useGameStore.getState().deleteLastLetter();
          break;
      }
      return { focusedButton: { row, col } };
    }),
}));
