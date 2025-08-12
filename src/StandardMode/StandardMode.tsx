import { Fragment, type FunctionalComponent } from "preact";
import { useCallback, useMemo, useRef, useState } from "preact/hooks";

import { useDataContext } from "../DataProvider";
import type { Result } from "../DataProvider/DataContext";

import { GameBlock } from "./components";
import { InteractiveFormField } from "./constants";
import styles from "./StandardMode.module.scss";
import type { InteractiveFormValues } from "./types";
import { calculateResults } from "./utils/calculateResults";

export const StandardMode: FunctionalComponent = () => {
  const { results, resultsUrl } = useDataContext();

  const locationSearch = useRef(window.location.search);

  const [interactiveEnabled, setInteractiveEnabled] = useState(false);
  const [interactiveFormHidden, setInteractiveFormHidden] = useState(false);
  const [interactiveFormValues, setInteractiveFormValues] = useState<InteractiveFormValues>({
    [InteractiveFormField.countThemselvesVotes]: true,
    [InteractiveFormField.hiddenJudges]: [],
    [InteractiveFormField.hiddenAuthors]: [],
  });

  const toggleInteractiveMode = useCallback(() => {
    setInteractiveEnabled(prev => !prev);
  }, []);

  const toggleInteractiveFormVisibility = useCallback(() => {
    setInteractiveFormHidden(prev => !prev);
  }, []);

  const handleInteractiveFormSubmit = useCallback((event: Event) => {
    event.preventDefault();
  }, []);

  const handleFormValuesChange = useCallback((formValues: Partial<InteractiveFormValues>) => {
    setInteractiveFormValues(prev => ({
      ...prev,
      ...formValues,
    }));
  }, []);

  const handleHiddenJudgesChange = useCallback((rawValue: string) => {
    const value = parseInt(rawValue, 10);
    setInteractiveFormValues(prev => {
      const hiddenJudges = prev.hiddenJudges.includes(value)
        ? prev.hiddenJudges.filter(index => index !== value)
        : [...prev.hiddenJudges, value];
      return { ...prev, hiddenJudges };
    });
  }, []);

  const handleHiddenAuthorChange = useCallback((rawValue: string) => {
    const value = parseInt(rawValue, 10);
    setInteractiveFormValues(prev => {
      const hiddenAuthors = prev.hiddenAuthors.includes(value)
        ? prev.hiddenAuthors.filter(index => index !== value)
        : [...prev.hiddenAuthors, value];
      return { ...prev, hiddenAuthors };
    });
  }, []);

  const preparedResults = useMemo(() => {
    let rawResultsData: Result[] = results.results;

    if (interactiveEnabled) {
      rawResultsData = calculateResults(results, interactiveFormValues);
    }

    return rawResultsData.toSorted((a, b) => b.result - a.result);
  }, [results, interactiveEnabled, interactiveFormValues]);

  const handleDownloadData = useCallback(() => {
    downloadData(resultsUrl, "twg-28-results-data");
  }, [resultsUrl]);

  return (
    <Fragment>
      <div className="games">
        {preparedResults.map((gameResult, index) => {
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

      <div className={styles.interactive__container}>
        <div className={styles.interactive__switchContainer}>
          <button type="button" onClick={toggleInteractiveMode}>
            интерактивный режим: {interactiveEnabled ? "вкл" : "выкл"}
          </button>

          {interactiveEnabled && (
            <Fragment>
              {" | "}
              <button type="button" onClick={toggleInteractiveFormVisibility}>
                {interactiveFormHidden ? "показать" : "скрыть"} форму
              </button>
            </Fragment>
          )}
        </div>

        {interactiveEnabled && (
          <form
            className={styles.interactive__form}
            onSubmit={handleInteractiveFormSubmit}
            hidden={interactiveFormHidden}
          >
            <fieldset>
              <legend>Общее</legend>

              <label>
                <input
                  type="checkbox"
                  name={InteractiveFormField.countThemselvesVotes}
                  checked={interactiveFormValues[InteractiveFormField.countThemselvesVotes]}
                  onChange={event =>
                    handleFormValuesChange({ countThemselvesVotes: event.currentTarget.checked })
                  }
                />
                Считать голоса за себя
              </label>
            </fieldset>

            <fieldset>
              <legend>Фильтры</legend>

              <p>Удалить оценки судей:</p>
              <ul className={styles.interactive__list}>
                {results.judgesList.map((judge, index) => (
                  <li key={index}>
                    <label>
                      <input
                        type="checkbox"
                        name={InteractiveFormField.hiddenJudges}
                        value={index}
                        checked={interactiveFormValues[InteractiveFormField.hiddenJudges].includes(
                          index,
                        )}
                        onChange={event => handleHiddenJudgesChange(event.currentTarget.value)}
                      />
                      {judge}
                    </label>
                  </li>
                ))}
              </ul>

              <p>Удалить оценки авторов:</p>
              <div>
                <ul className={styles.interactive__list}>
                  {results.voters
                    .filter(voter => voter.type === "participant")
                    .map(voter => (
                      <li key={voter.gameIndex ?? -1}>
                        <label>
                          <input
                            type="checkbox"
                            name={InteractiveFormField.hiddenAuthors}
                            value={voter.gameIndex ?? -1}
                            checked={interactiveFormValues[
                              InteractiveFormField.hiddenAuthors
                            ].includes(voter.gameIndex ?? -1)}
                            onChange={event => handleHiddenAuthorChange(event.currentTarget.value)}
                          />
                          Автор игры {results.gamesList[voter.gameIndex ?? -1]}
                        </label>
                      </li>
                    ))}
                </ul>
              </div>
            </fieldset>
          </form>
        )}
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
