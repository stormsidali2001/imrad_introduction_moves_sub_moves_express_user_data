import {
  getAverageConfidenceScore,
  getTotalIntroductions,
} from "../introductionService";

export const getDashboardStatsUseCase = async (userId?: string) => {
  const [total, { avgMoveConfidence, avgSubMoveConfidence }, totalFeedbacks] =
    await Promise.all([
      getTotalIntroductions(userId),
      getAverageConfidenceScore(userId),
      getTotalFeedbacks(userId),
    ]);

  return {
    total,
    avgMoveConfidence,
    avgSubMoveConfidence,
    totalFeedbacks,
  };
};
function getTotalFeedbacks(userId: string | undefined): any {
  throw new Error("Function not implemented.");
}
