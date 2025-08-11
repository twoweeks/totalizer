import { createContext } from "preact";

type Voter = {
  timestamp: string;
  type: "judge" | "participant";
  gameIndex: number | null;
  judgeIndex: number | null;
  selectedGamesIndices: number[];
  votes: {
    gameIndex: number;
    score: number;
    themeScore: number;
    feedback: string[];
  }[];
  contestFeedback: string[];
};

type Results = {
  gamesList: string[];
  judgesList: string[];
  results: {
    gameIndex: number;
    result: number;
  }[];
  voters: Voter[];
};

export type DataContextValue = {
  results: Results;
  resultsUrl: string;
};

export const DataContext = createContext({} as DataContextValue);
