import { createContext } from "preact";

export type Vote = {
  gameIndex: number;
  score: number;
  themeScore: number;
  feedback: string[];
};

export type Voter = {
  timestamp: string;
  type: "judge" | "participant";
  gameIndex: number | null;
  judgeIndex: number | null;
  selectedGamesIndices: number[];
  votes: Vote[];
  contestFeedback: string[];
};

export type Result = {
  gameIndex: number;
  result: number;
};

export type ResultsData = {
  gamesList: string[];
  judgesList: string[];
  results: Result[];
  voters: Voter[];
};

export type DataContextValue = {
  results: ResultsData;
  resultsUrl: string;
};

export const DataContext = createContext({} as DataContextValue);
