import { FunctionalComponent, Fragment } from "preact";
import { useRef, useMemo } from "preact/hooks";

import { GameBlock } from "./components";
import { useDataContext } from "../DataProvider";

export const StandardMode: FunctionalComponent = () => {
  const { results, resultsUrl } = useDataContext();

  const locationSearch = useRef(window.location.search);

  const sortedByVotesResults = useMemo(() => {
    const influenceMap = new Map(
      results.influence.map((influence) => [
        influence.gameIndex,
        influence.influence,
      ]),
    );

    return results.results
      .toSorted((a, b) => {
        const aInfluence = influenceMap.get(a.gameIndex) || 0;
        const bInfluence = influenceMap.get(b.gameIndex) || 0;
        return bInfluence - aInfluence;
      })
      .toSorted((a, b) => b.result - a.result);
  }, [results]);

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
        <div
          className="buttons__button"
          onClick={() => downloadData(resultsUrl, "twg-25-results-data")}
        >
          <button>data source</button>
        </div>
      </div>
    </Fragment>
  );
};

const downloadData = (url: any, name: string) => {
  const dlAnchorElem = document.createElement("a");
  dlAnchorElem.setAttribute("href", url);
  dlAnchorElem.setAttribute("download", `${name}.json`);
  dlAnchorElem.click();
  dlAnchorElem.remove();
};

const OPEN_ALL = "?openall";
