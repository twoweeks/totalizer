import { Fragment, type FunctionalComponent } from "preact";
import { useMemo } from "preact/hooks";

import clsx from "clsx";

import { useDataContext } from "../../DataProvider";
import { CollapseBlock, RenderTextParts } from "../../shared";

import styles from "./GameBlock.module.scss";

type GameBlockPropsType = {
  gameIndex: number;
  result: number;
  place: number;
  openByDefault?: boolean;
};

export const GameBlock: FunctionalComponent<GameBlockPropsType> = ({
  gameIndex,
  result,
  place,
  openByDefault = false,
}) => {
  const { results } = useDataContext();

  const game = useMemo(() => {
    const gameTitle = results.gamesList[gameIndex];

    const feedbacks = [];

    for (const vote of results.voters) {
      const feedback = vote.votes.find(vote => vote.gameIndex === gameIndex);

      feedbacks.push({
        voterType: vote.type,
        voterGameIndex: vote.gameIndex,
        voterGame: results.gamesList[vote.gameIndex ?? -1],
        judgeName: results.judgesList[vote.judgeIndex ?? -1],
        isSelected: vote.selectedGamesIndices.includes(gameIndex),
        feedback,
      });
    }

    return {
      title: gameTitle,
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
            <div>
              Результат: <b>{result}</b>
            </div>
            <div>
              место: <b>{place}</b>
            </div>
          </div>
        </Fragment>
      }
    >
      {game.feedbacks.map((feedbackData, index) => {
        return (
          <div
            key={index}
            className={clsx(
              styles.game__vote,
              feedbackData.isSelected ? styles["game__vote--selected"] : null,
            )}
          >
            {feedbackData.voterType === "judge" ? (
              <h4 className={styles.game__vote__title}>Судья {feedbackData.judgeName}</h4>
            ) : (
              <h4 className={styles.game__vote__title}>Автор игры {feedbackData.voterGame}</h4>
            )}
            {feedbackData.feedback && feedbackData.feedback.feedback.length !== 0 ? (
              <Fragment>
                <div className={styles.game__vote__feedback}>
                  <RenderTextParts textParts={feedbackData.feedback.feedback} />
                </div>
                <div className={styles.game__vote__score}>
                  Оценка за игру {feedbackData.feedback.score} / 5, за тему{" "}
                  {feedbackData.feedback.themeScore} / 5
                </div>
              </Fragment>
            ) : null}
            {feedbackData.isSelected ? (
              <Fragment>
                <div className={styles.game__vote__note}>
                  {feedbackData.voterType === "participant" ? "Автор" : "Судья"} выбрал эту игру
                </div>
              </Fragment>
            ) : null}
            {feedbackData.feedback?.gameIndex === feedbackData.voterGameIndex ? (
              <div className={styles.game__vote__note}>Игра автора</div>
            ) : null}
          </div>
        );
      })}
    </CollapseBlock>
  );
};
