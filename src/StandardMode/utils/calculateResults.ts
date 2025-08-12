import { isNotNil } from "es-toolkit";

import type { Result, ResultsData } from "../../DataProvider/DataContext";
import type { InteractiveFormValues } from "../types";

type CalculateResultsFnOptions = Partial<InteractiveFormValues>;

export const calculateResults = (
  resultsData: ResultsData,
  options: CalculateResultsFnOptions = {},
): Result[] => {
  return resultsData.gamesList.map((_gameTitle, gameIndex) => {
    let totalWeightedScore = 0;
    let totalWeightForScore = 0;
    let totalWeightedThemeScore = 0;
    let totalWeightForThemeScore = 0;
    let selectionCount = 0;

    for (const voter of resultsData.voters) {
      if (isNotNil(voter.judgeIndex) && options.hiddenJudges?.includes(voter.judgeIndex)) {
        continue;
      }
      if (isNotNil(voter.gameIndex) && options.hiddenAuthors?.includes(voter.gameIndex)) {
        continue;
      }

      // Judges have double weight
      const weight = voter.type === "judge" ? 2 : 1;

      // Calculate weighted scores from votes
      for (const vote of voter.votes) {
        if (
          vote.gameIndex === gameIndex &&
          (options.countThemselvesVotes || voter.gameIndex !== gameIndex)
        ) {
          if (!Number.isNaN(vote.score)) {
            totalWeightedScore += vote.score * weight;
            totalWeightForScore += weight;
          }
          if (!Number.isNaN(vote.themeScore)) {
            totalWeightedThemeScore += vote.themeScore * weight;
            totalWeightForThemeScore += weight;
          }
        }
      }

      // Count selections
      if (
        voter.selectedGamesIndices.includes(gameIndex) &&
        (options.countThemselvesVotes || voter.gameIndex !== gameIndex)
      ) {
        selectionCount += weight;
      }
    }

    // 1. Calculate average of all games scores
    const averageScore = totalWeightForScore > 0 ? totalWeightedScore / totalWeightForScore : 0;

    // 2. Calculate average of theme scores
    const averageThemeScore =
      totalWeightForThemeScore > 0 ? totalWeightedThemeScore / totalWeightForThemeScore : 0;

    // 3. Sum these values
    const sumOfAverages = averageScore + averageThemeScore;

    // 4. Sum value from third step, and value from fourth step multiplied by 2
    const finalResult = sumOfAverages + selectionCount * 2;

    return {
      gameIndex,
      result: Number.parseFloat(finalResult.toFixed(3)),
    };
  });
};
