import type { ComponentChildren, FunctionComponent, RefObject } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

import resultsUrl from "../data/result.json?url";

import { DataContext, type ResultsData } from "./DataContext";

type DataProviderProps = {
  children?: ComponentChildren;
};

export const DataProvider: FunctionComponent<DataProviderProps> = ({ children }) => {
  const results = useRef<ResultsData>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData(setLoading, results);
  }, []);

  if (!results.current || loading) {
    return <div className="loading">loading...</div>;
  }

  return (
    <DataContext.Provider
      value={{
        results: results.current,
        resultsUrl,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

const loadData = async (
  setLoading: (loading: boolean) => void,
  resultsRef: RefObject<ResultsData>,
) => {
  setLoading(true);

  const [resultsResponse] = await Promise.all([fetch(resultsUrl)]);
  const [results] = await Promise.all([resultsResponse.json()]);

  resultsRef.current = results;

  setLoading(false);
};
