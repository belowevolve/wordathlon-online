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
