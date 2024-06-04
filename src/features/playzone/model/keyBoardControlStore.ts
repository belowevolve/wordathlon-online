import { create } from "zustand";
import { useGameStore } from "./gameStore";

interface UiState {
  focusedButton: { row: number; col: number };
}

interface UiActions {
  handleKeyDown: (event: KeyboardEvent) => void;
}
export const useKeyboardControlStore = create<UiState & UiActions>((set) => ({
  focusedButton: { row: -1, col: -1 },
  handleKeyDown: (event) =>
    set((state) => {
      let { row, col } = state.focusedButton;
      switch (event.code) {
        case "ArrowUp":
          row = Math.max(row - 1, 0);
          break;
        case "ArrowDown":
          row = Math.min(row + 1, 3 - 1);
          break;
        case "ArrowLeft":
          col = Math.max(col - 1, 0);
          break;
        case "ArrowRight":
          col = Math.min(col + 1, 3 - 1);
          break;
        case "KeyH":
          useGameStore.getState().revealLetter();
          break;
        case "Backspace":
          const { input: currentInput, letters: currentLetters } =
            useGameStore.getState();
          const lastIndex = currentInput.findLastIndex(
            (letter) => letter !== "",
          );
          if (lastIndex !== -1) {
            const lastLetter = currentInput[lastIndex];
            currentInput[lastIndex] = "";
            currentLetters[lastLetter] = (currentLetters[lastLetter] || 0) + 1;
            useGameStore.setState({
              input: [...currentInput],
              letters: { ...currentLetters },
            });
          }
          break;
      }

      return { focusedButton: { row, col } };
    }),
}));
