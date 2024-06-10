import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { OGameStatus, TGameStatus, WordData, WordDataFetched } from "./types";
import {
  countLetters,
  getGridCoordinates,
  initializeGrid,
  revealOrder,
  selectRandomWords,
} from "./utils";

const GEN_WORD_API_URL = "https://api.datamuse.com/words?sp=";

interface State {
  gameStatus: TGameStatus;
  error: string;
  info: string;
  allFetchedWords: WordData;
  input: string[];
  levelWords: string[];
  alreadyFoundWords: string[];
  letters: Record<string, number>;
  levelColor: string;
  grid: Record<string, { letter: string; revealed: boolean }>;
  revealIndex: number;
  totalLevelsFinished: number;
}
const initialState: State = {
  gameStatus: OGameStatus.NOT_STARTED,
  input: Array(5).fill(""),
  error: "",
  info: "Combine letters to form a word",
  letters: {},
  grid: {},
  levelWords: [],
  alreadyFoundWords: [],
  revealIndex: 0,
  allFetchedWords: {},
  levelColor: "",
  totalLevelsFinished: 0,
};
interface Actions {
  incRevealIndex: () => void;
  fetchLevelWords: () => void;
  handleLetterClick: (letter: string) => void;
  handleInputClick: (index: number) => void;
  revealLetter: () => void;
  revealWord: (word: string) => void;
  checkInput: () => void;
  checkWin: () => void;
  addAlreadyFoundWord: (word: string) => void;
  deleteLastLetter: () => void;
}

export const useGameStore = create<State & Actions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        incRevealIndex: () =>
          set((state) => ({
            revealIndex: state.revealIndex + 1,
          })),

        addAlreadyFoundWord: (word: string) => {
          set((state) => ({
            alreadyFoundWords: [...state.alreadyFoundWords, word],
          }));
        },

        fetchLevelWords: async () => {
          let attempts = 0;
          while (attempts < 5) {
            set({
              error: "",
              levelWords: [],
              input: Array(5).fill(""),
              letters: {},
              grid: {},
              revealIndex: 0,
              info: initialState.info,
              gameStatus: OGameStatus.LOADING,
              levelColor: `hsl(${360 * Math.random()}, ${25 + 70 * Math.random()}%, ${
                65 + 20 * Math.random()
              }%)`,
            });
            attempts++;
            try {
              // Generate a random starting letter
              const randomLetter = String.fromCharCode(
                97 + Math.floor(Math.random() * 26),
              );

              // Fetch initial two words starting with random letter and four additional characters
              const initialResponse = await fetch(
                `${GEN_WORD_API_URL}${randomLetter}????&md=d&max=1000`,
              );
              if (!initialResponse.ok)
                throw new Error("Failed to fetch initial words");

              const initialData: WordDataFetched[] =
                await initialResponse.json();
              const selectedWords = selectRandomWords(initialData, 2, []);
              if (selectedWords.length < 2)
                throw new Error("Not enough valid words found");
              const newLevelWords = [
                selectedWords[0].word,
                selectedWords[1].word,
              ];

              // Fetch third word based on the last character of the first selected word
              const lastCharOfFirst = selectedWords[0].word.slice(-1);
              const thirdWordResponse = await fetch(
                `${GEN_WORD_API_URL}${lastCharOfFirst}????&md=d&max=1000`,
              );
              if (!thirdWordResponse.ok)
                throw new Error("Failed to fetch third word");
              const thirdWordData: WordDataFetched[] =
                await thirdWordResponse.json();
              const thirdWord = selectRandomWords(
                thirdWordData,
                1,
                newLevelWords,
              )[0];
              if (!thirdWord) throw new Error("No valid third word found");
              newLevelWords.push(thirdWord.word);

              // Fetch fourth word based on the last character of the second selected word and last character of the third word
              const lastCharOfSecond = selectedWords[1].word.slice(-1);
              const lastCharOfThird = thirdWord.word.slice(-1);
              const fourthWordResponse = await fetch(
                `${GEN_WORD_API_URL}${lastCharOfSecond}???${lastCharOfThird}&md=d&max=1000`,
              );
              if (!fourthWordResponse.ok)
                throw new Error("Failed to fetch fourth word");
              const fourthWordData: WordDataFetched[] =
                await fourthWordResponse.json();
              const fourthWord = selectRandomWords(
                fourthWordData,
                1,
                newLevelWords,
              )[0];
              if (!fourthWord) throw new Error("No valid fourth word found");
              newLevelWords.push(fourthWord.word);

              const combineAndTransformFetchedWords = [
                ...initialData,
                ...thirdWordData,
                ...fourthWordData,
              ].reduce<WordData>((acc, item) => {
                acc[item.word] = { score: item.score, defs: item.defs };
                return acc;
              }, {});
              attempts = 100;
              set({
                gameStatus: OGameStatus.ON_LVL,
                allFetchedWords: combineAndTransformFetchedWords,
                levelWords: newLevelWords,
                letters: countLetters(newLevelWords),
                grid: initializeGrid(newLevelWords),
              });
            } catch (err) {
              if (err instanceof Error) {
                set({
                  gameStatus: OGameStatus.ERROR,
                  error: err.message,
                  levelWords: [],
                  input: Array(5).fill(""),
                  revealIndex: 0,
                  letters: {},
                  allFetchedWords: {},
                  grid: {},
                });
                console.error(err);
              }
            }
          }
        },

        revealWord: (word: string) => {
          const { grid, levelWords } = get();
          const wordIndex = levelWords.findIndex((w) => w === word);
          if (wordIndex !== -1) {
            const newGrid = { ...grid };
            for (
              let letterIndex = 0;
              letterIndex < word.length;
              letterIndex++
            ) {
              const key = getGridCoordinates(wordIndex, letterIndex);
              newGrid[key].revealed = true;
            }
            set({ grid: newGrid, input: Array(5).fill("") });
          }
        },

        handleLetterClick: (letter: string) => {
          const { input, letters, checkInput } = get();
          if (letters[letter] > 0) {
            const emptyIndex = input.indexOf("");
            if (emptyIndex !== -1) {
              const newInput = [...input];
              newInput[emptyIndex] = letter;
              set({
                input: newInput,
                letters: { ...letters, [letter]: letters[letter] - 1 },
              });
            }
            checkInput();
          }
        },

        handleInputClick: (index: number) => {
          const { input, letters } = get();
          const removedLetter = input[index];
          if (removedLetter) {
            const newInput = [...input];
            newInput[index] = "";
            set({
              input: newInput,
              letters: {
                ...letters,
                [removedLetter]: letters[removedLetter] + 1,
              },
            });
          }
        },

        checkInput: () => {
          const {
            input,
            alreadyFoundWords,
            levelWords,
            addAlreadyFoundWord,
            revealWord,
            allFetchedWords,
            revealLetter,
            handleInputClick,
            checkWin,
          } = get();
          const word = input.join("").toLowerCase();
          if (word.length === 5) {
            if (alreadyFoundWords.includes(word)) {
              set({ info: "Already found" });
              console.log("Already found");
            } else if (levelWords.includes(word)) {
              set({ info: "Word is in level words" });
              console.log("Word is in level words");
              addAlreadyFoundWord(word);
              revealWord(word);
              checkWin();
            } else if (allFetchedWords[word]) {
              set({ info: "Word is in all fetched words" });
              console.log("Word is in all fetched words");
              revealLetter();
              addAlreadyFoundWord(word);
              input.forEach((_, i) => handleInputClick(i));
            } else {
              // Handle an incorrect word
              set({ info: "Word is not correct" });
              console.log("Word is not correct");
            }
          }
        },

        checkWin: () => {
          const { grid, totalLevelsFinished } = get();
          const allRevealed = Object.values(grid).every(
            (cell) => cell.revealed,
          );
          if (allRevealed) {
            set({
              gameStatus: OGameStatus.AFTER_LVL,
              totalLevelsFinished: totalLevelsFinished + 1,
            });
          }
        },

        revealLetter: () => {
          const {
            grid,
            revealIndex,
            levelWords,
            input,
            handleInputClick,
            checkWin,
          } = get();
          const newGrid = { ...grid };
          let tempRevealIndex = revealIndex;
          let revealedSomething = false;
          let currentKey = "";

          while (!revealedSomething && tempRevealIndex < revealOrder.length) {
            currentKey = revealOrder[tempRevealIndex];
            if (!newGrid[currentKey].revealed) {
              newGrid[currentKey].revealed = true;
              revealedSomething = true;
              break;
            }
            tempRevealIndex++;
          }

          if (revealedSomething) {
            set({ grid: newGrid, revealIndex: tempRevealIndex });
            const [row, col] = currentKey.split("-").map(Number);
            const wordIndex = row === 0 ? 0 : col === 0 ? 1 : col === 4 ? 2 : 3;
            const levelWord = levelWords[wordIndex].split("");
            const isWordComplete = levelWord.every((_, idx) => {
              const checkKey = getGridCoordinates(wordIndex, idx);
              return newGrid[checkKey].revealed;
            });

            if (isWordComplete) {
              input.forEach((_, i) => handleInputClick(i));
              levelWord.forEach((letter) => {
                set((state) => ({
                  letters: {
                    ...state.letters,
                    [letter.toLowerCase()]:
                      state.letters[letter.toLowerCase()] - 1,
                  },
                }));
              });
              checkWin();
            }
          }
        },

        deleteLastLetter: () => {
          const { input: currentInput, letters: currentLetters } = get();
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
        },
      }),
      {
        name: "game-storage",
        partialize: (state) => {
          if (state.gameStatus === OGameStatus.LOADING)
            return {
              ...state,
              info: initialState.info,
              gameStatus: initialState.gameStatus,
            };
          return state;
        },
      },
    ),
    {
      store: "game",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);
