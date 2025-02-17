import { FunctionalComponent, Fragment } from "preact";
import { useMemo } from "preact/hooks";
import clsx from "clsx";

import { useDataContext } from "../../DataProvider";
import { CollapseBlock, RenderTextParts } from "../../shared";

import styles from "./GameBlock.module.scss";

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
    const gameTitle = results.gamesList[gameIndex];
    const gameResult = results.results.find(
      (result) => result.gameIndex === gameIndex,
    );

    const influenceMap = new Map(
      results.influence.map((influence) => [
        influence.gameIndex,
        influence.influence,
      ]),
    );

    const influence = influenceMap.get(gameIndex) || 0;

    const feedbacks = [];

    for (const vote of results.voters) {
      const feedback = vote.votes.find((vote) => vote.gameIndex === gameIndex);
      const voterInfluence = influenceMap.get(vote.gameIndex ?? -1) || 0;

      feedbacks.push({
        voterGameIndex: vote.gameIndex,
        voterGame: results.gamesList[vote.gameIndex ?? -1],
        voterInfluence,
        isSelected: vote.selectedGamesIndices.includes(gameIndex),
        feedback,
      });
    }

    return {
      title: gameTitle,
      result: gameResult?.result || 0,
      influence: influence,
      feedbacks,
    };
  }, [results, gameIndex]);

  return (
    <CollapseBlock
      baseClassName={styles.game}
      headerClassName={styles.game__header}
      headerContentClassName={styles.game__headerContent}
      contentClassName={styles.game__groups}
      openByDefault={openByDefault}
      headerContent={
        <Fragment>
          <h2 className={styles.game__title}>{game.title}</h2>
          <div className={styles.game__result}>
            {game.result ? (
              <div>
                Результат: <b>{game.result}</b>
              </div>
            ) : null}
            <div>
              влияние: <b>{game.influence}</b>
            </div>
            {game.result ? (
              <div>
                место: <b>{place}</b>
              </div>
            ) : null}
          </div>
        </Fragment>
      }
    >
      {game.feedbacks.map((feedbackData) => {
        return (
          <div
            key={feedbackData.voterGameIndex}
            className={clsx(
              styles.game__vote,
              feedbackData.isSelected ? styles["game__vote--selected"] : null,
            )}
          >
            <h4 className={styles.game__vote__title}>
              Автор игры {feedbackData.voterGame}
            </h4>
            {feedbackData.feedback &&
            feedbackData.feedback.feedback.length !== 0 ? (
              <Fragment>
                <div className={styles.game__vote__feedback}>
                  <RenderTextParts textParts={feedbackData.feedback.feedback} />
                </div>
                <div className={styles.game__vote__score}>
                  Оценка {feedbackData.feedback.score} / 10
                </div>
              </Fragment>
            ) : null}
            {feedbackData.isSelected ? (
              <div className={styles.game__vote__note}>
                Автор выбрал эту игру, влияние {feedbackData.voterInfluence}
              </div>
            ) : null}
            {feedbackData.feedback?.gameIndex ===
            feedbackData.voterGameIndex ? (
              <div className={styles.game__vote__note}>Игра автора</div>
            ) : null}
          </div>
        );
      })}
    </CollapseBlock>
  );
};
