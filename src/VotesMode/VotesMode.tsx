import { FunctionalComponent } from "preact";

import { useDataContext } from "../DataProvider";
import { CollapseBlock, RenderTextParts } from "../shared";

import "./VotesMode.scss";
import clsx from "clsx";

export const VotesMode: FunctionalComponent = () => {
  const { results } = useDataContext();

  return (
    <div className="authors">
      {results.votes.map((vote, voteIndex) => {
        const authorName =
          vote.voterType === "judge"
            ? `Судья (организатор)`
            : `Автор игры ${results.games[vote.voterGameIndex]}`;

        const timestampDate = new Date(vote.timestamp);
        const formatedTimestamp = timestampDate.toLocaleString();

        return (
          <CollapseBlock
            key={vote.timestamp}
            baseClassName="author"
            headerClassName="author__header"
            contentClassName="author__votes"
            headerContent={
              <div>
                <div className="author__name">{authorName}</div>
                <div
                  className="author__time"
                  data-is-first={voteIndex === 0 ? "" : null}
                >
                  Анкета отправлена{" "}
                  <span title="Ваше местное время">{formatedTimestamp}</span>
                </div>
              </div>
            }
          >
            {vote.feedbacks.map((feedback: any) => {
              const gameTitle = results.games[feedback.gameIndex];
              const isSelected = vote.selectedIndexesList.includes(
                feedback.gameIndex,
              );

              return (
                <div
                  key={vote.gameIndex}
                  className={clsx(
                    "author__vote",
                    isSelected ? "author__vote--selected" : null,
                  )}
                >
                  <h4 className="author__vote__game">{gameTitle}</h4>

                  <div className="author__vote__feedback">
                    <RenderTextParts textParts={feedback.text} />
                  </div>

                  {isSelected ? (
                    <div className="author__vote__note">
                      {vote.voterType === "judge" ? "Судья" : "Автор"}{" "}
                      проголосовал за эту игру
                    </div>
                  ) : null}

                  {feedback.gameIndex === vote.voterGameIndex ? (
                    <div className="author__vote__note">Игра автора</div>
                  ) : null}
                </div>
              );
            })}
          </CollapseBlock>
        );
      })}
    </div>
  );
};
