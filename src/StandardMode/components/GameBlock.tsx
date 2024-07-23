import { FunctionalComponent, Fragment } from "preact";
import { useMemo } from "preact/hooks";
import clsx from "clsx";

import { useDataContext } from "../../DataProvider";
import { CollapseBlock, RenderTextParts } from "../../shared";

type GameBlockPropsType = {
  gameIndex: number;
  place: number;
  openByDefault?: boolean;
};

export const GameBlock: FunctionalComponent<GameBlockPropsType> = ({
  gameIndex,
  place,
  openByDefault = false,
}) => {
  const { results } = useDataContext();

  const game = useMemo(() => {
    const gameTitle = results.games[gameIndex];
    const gameResult = results.results.find(
      (result) => result.gameIndex === gameIndex,
    );
    const feedbacks = [];

    for (const vote of results.votes) {
      feedbacks.push({
        voterType: vote.voterType,
        voterGameIndex: vote.voterGameIndex,
        voterGame: results.games[vote.voterGameIndex],
        isSelected: vote.selectedIndexesList.includes(gameIndex),
        feedback: vote.feedbacks[gameIndex],
      });
    }

    return {
      title: gameTitle,
      result: gameResult,
      feedbacks,
    };
  }, [results, gameIndex]);

  return (
    <CollapseBlock
      baseClassName="game"
      headerClassName="game__header"
      contentClassName="game__groups"
      openByDefault={openByDefault}
      headerContent={
        <Fragment>
          <h2 className="game__title">{game.title}</h2>
          {game.result.votes ? (
            <div className="game__score">
              голосов: <b>{game.result.votes}</b>
            </div>
          ) : null}
          <div className="game__score">
            место: <b>{place}</b>
          </div>
        </Fragment>
      }
    >
      {game.feedbacks.map((feedbackData) => {
        return (
          <div
            key={feedbackData.voterGameIndex}
            className={clsx(
              "game__vote",
              feedbackData.isSelected ? "game__vote--selected" : null,
            )}
          >
            <h4 className="game__vote__title">
              {feedbackData.voterType === "judge"
                ? "Cудья (организатор)"
                : `Автор игры ${feedbackData.voterGame}`}
            </h4>
            {feedbackData.feedback &&
            feedbackData.feedback.text.length !== 0 ? (
              <div className="game__vote__feedback">
                <RenderTextParts textParts={feedbackData.feedback.text} />
              </div>
            ) : null}
            {feedbackData.isSelected ? (
              <div className="game__vote__note">
                {feedbackData.voterType === "judge" ? "Судья" : "Автор"}{" "}
                проголосовал за эту игру
              </div>
            ) : null}
            {feedbackData.feedback.gameIndex === feedbackData.voterGameIndex ? (
              <div className="game__vote__note">Игра автора</div>
            ) : null}
          </div>
        );
      })}
    </CollapseBlock>
  );
};
