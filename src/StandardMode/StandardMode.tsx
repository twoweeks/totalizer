import { Fragment, type FunctionalComponent } from "preact";
import { useCallback, useMemo, useRef } from "preact/hooks";

import { useDataContext } from "../DataProvider";

import { GameBlock } from "./components";

export const StandardMode: FunctionalComponent = () => {
  const { results, resultsUrl } = useDataContext();

  const locationSearch = useRef(window.location.search);

  const sortedByVotesResults = useMemo(() => {
    return results.results.toSorted((a, b) => b.result - a.result);
  }, [results]);

  const handleDownloadData = useCallback(() => {
    downloadData(resultsUrl, "twg-28-results-data");
  }, []);

  return (
    <Fragment>
      <div className="games">
        {sortedByVotesResults.map((gameResult, index) => {
          return (
            <GameBlock
              key={gameResult.gameIndex}
              gameIndex={gameResult.gameIndex}
              place={index + 1}
              openByDefault={locationSearch.current === OPEN_ALL}
            />
          );
        })}
      </div>

      <div className="buttons">
        <button type="button" className="buttons__button" onClick={handleDownloadData}>
          download data source
        </button>
      </div>
    </Fragment>
  );
};

const downloadData = (url: string, name: string) => {
  const dlAnchorElem = document.createElement("a");
  dlAnchorElem.setAttribute("href", url);
  dlAnchorElem.setAttribute("download", `${name}.json`);
  dlAnchorElem.click();
  dlAnchorElem.remove();
};

const OPEN_ALL = "?openall";
