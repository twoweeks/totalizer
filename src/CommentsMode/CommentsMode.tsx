import { FunctionalComponent } from "preact";
import { useMemo } from "preact/hooks";

import { useDataContext } from "../DataProvider";
import { RenderTextParts } from "../shared";

export const CommentsMode: FunctionalComponent = () => {
  const { results } = useDataContext();

  const comments = useMemo(() => {
    return results.votes
      .map((vote) => {
        return {
          voterType: vote.voterType,
          voterGameIndex: vote.voterGameIndex,
          voterGame: results.games[vote.voterGameIndex],
          contestFeedback: vote.contestFeedback,
        };
      })
      .filter((vote) => !!vote.contestFeedback);
  }, [results]);

  return (
    <div className="comments">
      {comments.map((commentInfo) => {
        const author =
          commentInfo.voterType === "judge"
            ? `Судья (организатор)`
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
