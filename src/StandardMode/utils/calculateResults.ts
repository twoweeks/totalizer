import { isNotNil } from "es-toolkit";

import type { Result, ResultsData } from "../../DataProvider/DataContext";
import type { InteractiveFormValues } from "../types";

type CalculateResultsFnOptions = Partial<InteractiveFormValues>;

export const calculateResults = (
  resultsData: ResultsData,
  options: CalculateResultsFnOptions = {},
): Result[] => {
  return resultsData.gamesList.map((_gameTitle, gameIndex) => {
    let totalScore = 0;

    for (const voter of resultsData.voters) {
      if (isNotNil(voter.judgeIndex) && options.hiddenJudges?.includes(voter.judgeIndex)) {
        continue;
      }
      if (isNotNil(voter.gameIndex) && options.hiddenAuthors?.includes(voter.gameIndex)) {
        continue;
      }

      const isJudge = voter.type === "judge";
      const scoreMultiplier = isJudge ? 2 : 1;

      // Sum scores and theme scores (with judge multiplier)
      for (const vote of voter.votes) {
        if (
          vote.gameIndex === gameIndex &&
          (options.countThemselvesVotes || voter.gameIndex !== gameIndex)
        ) {
          if (!Number.isNaN(vote.score)) {
            totalScore += vote.score * scoreMultiplier;
          }
          if (!Number.isNaN(vote.themeScore)) {
            totalScore += vote.themeScore * scoreMultiplier;
          }
        }
      }

      // Add points for being selected as favorite (2 for participant, 4 for judge)
      if (
        voter.selectedGamesIndices.includes(gameIndex) &&
        (options.countThemselvesVotes || voter.gameIndex !== gameIndex)
      ) {
        totalScore += isJudge ? 4 : 2;
      }
    }

    const finalResult = totalScore;

    return {
      gameIndex,
      result: Number.parseFloat(finalResult.toFixed(3)),
    };
  });
};
