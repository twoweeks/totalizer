import { FunctionalComponent } from "preact";

import { useDataContext } from "../DataProvider";
import { CollapseBlock, RenderTextParts } from "../shared";

import "./VotesMode.scss";
import clsx from "clsx";

export const VotesMode: FunctionalComponent = () => {
  const { results } = useDataContext();

  return (
    <div className="authors">
      {results.voters.map((vote, voteIndex) => {
        const isParticipant = vote.type === 'participant'
        const authorName = isParticipant ? `Автор игры ${results.gamesList[vote.gameIndex ?? -1]}` : 'Организатор';

        const timestampDate = new Date(vote.timestamp);
        const formattedTimestamp = timestampDate.toLocaleString();

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
                  <span title="Ваше местное время">{formattedTimestamp}</span>
                </div>
              </div>
            }
          >
            {vote.votes.map((feedback) => {
              const gameTitle = results.gamesList[feedback.gameIndex];
              const isSelected = vote.selectedGamesIndices.includes(
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
                    <RenderTextParts textParts={feedback.feedback} />
                  </div>

                  <div className="author__vote__score">
                    Оценка: {feedback.score} / 10
                  </div>

                  {isSelected ? (
                    <div className="author__vote__note">
                      {isParticipant ? 'Автор' : 'Организатор'} выбрал эту игру
                    </div>
                  ) : null}

                  {feedback.gameIndex === vote.gameIndex ? (
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
