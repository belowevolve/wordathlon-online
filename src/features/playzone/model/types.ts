export interface WordDataFetched {
  word: string;
  score: number;
  defs?: string[];
}

export interface WordData {
  [word: string]: {
    score: number;
    defs?: string[];
  };
}

export const OGameStatus = {
  NOT_STARTED: "NOT_STARTED",
  LOADING: "LOADING",
  ON_LVL: "ON_LVL",
  AFTER_LVL: "AFTER_LVL",
  ERROR: "ERROR",
} as const;
export type TGameStatus = (typeof OGameStatus)[keyof typeof OGameStatus];

export const OWordStatus = {
  INITIAL: "Combine letters to form a word",
  ALREADY_FOUND: "Word already found",
  FOUND: "Congrats! Can you find another?",
  HIDDEN: "Hidden word found",
  ERROR: "Word is not correct",
  EMPTY: "",
} as const;
export type TWordStatus = (typeof OWordStatus)[keyof typeof OWordStatus];
