import { createContext } from "preact";

type Voter = {
  timestamp: string;
  type: 'judge' | 'participant',
  gameIndex: number | null,
  selectedGamesIndices: number[];
  votes: {
    gameIndex: number;
    score: number;
    feedback: string[];
  }[];
  contestFeedback: string[];
};

type Results = {
  gamesList: string[];
  influence: {
    influence: number;
    gameIndex: number;
    scores: number[];
  }[];
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
