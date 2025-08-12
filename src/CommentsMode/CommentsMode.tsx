import type { FunctionalComponent } from "preact";
import { useMemo } from "preact/hooks";

import { useDataContext } from "../DataProvider";
import { RenderTextParts } from "../shared";

export const CommentsMode: FunctionalComponent = () => {
  const { results } = useDataContext();

  const comments = useMemo(() => {
    return results.voters
      .map(vote => {
        return {
          voterType: vote.type,
          voterGameIndex: vote.gameIndex,
          voterGame: results.gamesList[vote.gameIndex ?? -1],
          voterJudgeName: results.judgesList[vote.judgeIndex ?? 1],
          contestFeedback: vote.contestFeedback,
        };
      })
      .filter(vote => vote.contestFeedback.length > 0);
  }, [results]);

  return (
    <div className="comments">
      {comments.map(commentInfo => {
        const author =
          commentInfo.voterType === "judge"
            ? `Судья ${commentInfo.voterJudgeName}`
            : `Автор игры ${commentInfo.voterGame}`;

        return (
          <div key={commentInfo.voterGameIndex} className="comment">
            <div className="comment__author">{author}</div>

            <div className="comment__text">
              <RenderTextParts textParts={commentInfo.contestFeedback} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
