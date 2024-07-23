import { FunctionalComponent, JSX } from "preact";
import { useState, useCallback, useMemo } from "preact/hooks";

import { DataProvider } from "./DataProvider";

import { StandardMode } from "./StandardMode";
import { VotesMode } from "./VotesMode";
import { CommentsMode } from "./CommentsMode";

export const App: FunctionalComponent = () => {
  const [pageMode, setPageMode] = useState<PageModeKey>(PageMode.Standard);

  const handleModeChange = useCallback(
    (event: JSX.TargetedEvent<HTMLInputElement, Event>) => {
      setPageMode(event.currentTarget.value as PageModeKey);
    },
    [],
  );

  const pageContent = useMemo(() => {
    switch (pageMode) {
      case PageMode.Standard:
        return <StandardMode />;
      case PageMode.Votes:
        return <VotesMode />;
      case PageMode.Comments:
        return <CommentsMode />;
    }
  }, [pageMode]);

  return (
    <div className="app">
      <div className="mode-select">
        <span>Режим:</span>
        <label>
          Итоги
          <input
            type="radio"
            id="pageMode"
            name="pageMode"
            value={PageMode.Standard}
            checked={pageMode === PageMode.Standard}
            onChange={handleModeChange}
          />
        </label>
        <label>
          Оценки
          <input
            type="radio"
            id="pageMode"
            name="pageMode"
            value={PageMode.Votes}
            checked={pageMode === PageMode.Votes}
            onChange={handleModeChange}
          />
        </label>
        <label>
          Отзывы о конкурсе
          <input
            type="radio"
            id="pageMode"
            name="pageMode"
            value={PageMode.Comments}
            checked={pageMode === PageMode.Comments}
            onChange={handleModeChange}
          />
        </label>
      </div>

      <DataProvider>
        <main className="main">{pageContent}</main>
      </DataProvider>

      <div class="version">
        TWG Totalizer -{" "}
        <a href="https://github.com/twoweeks/totalizer">GitHub</a>
      </div>
    </div>
  );
};

const PageMode = {
  Standard: "Standard",
  Votes: "Votes",
  Comments: "Comments",
} as const;
type PageModeKey = keyof typeof PageMode;
