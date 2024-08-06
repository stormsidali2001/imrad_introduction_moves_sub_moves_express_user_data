import { DashboardStatsDto } from "../../validation/dashboardStatsDto";
import { getFeedbackCount } from "../feedbackService";
import {
  getAverageConfidenceScore,
  getTotalIntroductions,
} from "../introductionService";

export const getDashboardStatsUseCase = async (userId?: string) => {
  const [total, { avgMoveConfidence, avgSubMoveConfidence }, totalFeedbacks] =
    await Promise.all([
      getTotalIntroductions(userId),
      getAverageConfidenceScore(userId),
      getFeedbackCount(userId),
    ]);

  return DashboardStatsDto.parseAsync({
    total,
    avgMoveConfidence,
    avgSubMoveConfidence,
    totalFeedbacks,
  });
};
