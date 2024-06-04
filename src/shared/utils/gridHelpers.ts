import { WordDataFetched } from "@/features/playzone/model/gameStore";

// Return {row, col} of letter in word
export const getGridCoordinates = (wordIndex: number, letterIndex: number) => {
  switch (wordIndex) {
    case 0:
      return `0-${letterIndex}`; // Top row
    case 1:
      return `${letterIndex}-0`; // Left column
    case 2:
      return `${letterIndex}-4`; // Right column
    case 3:
      return `4-${letterIndex}`; // Bottom row
    default:
      return ``;
  }
};

export const initializeGrid = (levelWords: string[]) => {
  const newGrid: Record<string, { letter: string; revealed: boolean }> = {};
  levelWords.forEach((word, wordIndex) => {
    word.split("").forEach((letter, letterIndex) => {
      const key = getGridCoordinates(wordIndex, letterIndex);
      newGrid[key] = { letter: letter.toUpperCase(), revealed: false };
    });
  });
  return newGrid;
};

export const revealOrder = [
  "0-0",
  "0-4",
  "4-4",
  "4-0",
  "0-1",
  "1-4",
  "4-3",
  "3-0",
  "0-2",
  "2-4",
  "4-2",
  "2-0",
  "0-3",
  "3-4",
  "4-1",
  "1-0",
];

export const countLetters = (words: string[]): { [letter: string]: number } => {
  const letterCounts: { [letter: string]: number } = {};
  // Loop through each word
  for (const word of words) {
    // Loop through each letter in the word
    for (const letter of word) {
      if (letterCounts.hasOwnProperty(letter)) {
        // If the letter is already in the object, increment its count
        letterCounts[letter]++;
      } else {
        // If the letter is not in the object, add it with a count of 1
        letterCounts[letter] = 1;
      }
    }
  }
  return letterCounts;
};

export function selectRandomWords(
  data: WordDataFetched[],
  count: number,
  levelWords: string[],
) {
  const words = [];
  let attempts = 0;
  while (words.length < count && data.length > 0 && attempts < 1000) {
    const randomIndex = Math.floor(Math.random() * data.length);
    const wordData = data.splice(randomIndex, 1)[0];
    if (
      /^[a-zA-Z]+$/.test(wordData.word) &&
      wordData.defs &&
      // For difficulty levels
      wordData.score > 300 &&
      Object.keys(countLetters([...levelWords, wordData.word])).length <= 9
    ) {
      words.push(wordData);
    }
    attempts++;
  }
  return words;
}
