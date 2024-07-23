import { createContext } from "preact";

type Results = {
  games: string[];
  results: any[];
  votes: any[];
};

export type DataContextValue = {
  results: Results;
  resultsUrl: string;
};

export const DataContext = createContext({} as DataContextValue);
