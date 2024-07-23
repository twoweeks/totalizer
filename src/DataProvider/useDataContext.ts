import { useContext } from "preact/hooks";

import { DataContext } from "./DataContext";

export const useDataContext = () => {
  return useContext(DataContext);
};
