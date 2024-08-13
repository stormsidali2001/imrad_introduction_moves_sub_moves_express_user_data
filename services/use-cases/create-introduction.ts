import { GlobalSummaryEventDto } from "../../validation/GlobalSummaryEventDto";
import { IntroductionDtoType } from "../../validation/introduction";
import { createIntroduction } from "../introductionService";
import { publishEvent } from "../redisService";

export const createIntroductionUseCase = async (
  introduction: IntroductionDtoType,
  isPremium: boolean,
) => {
  console.log("Creating introduction ----");
  const introductionDb = await createIntroduction(introduction);
  if (isPremium) {
    console.log("Publishing GlobalSummaryEvent ----");
    const globalSummary = await GlobalSummaryEventDto.parseAsync({
      content: introductionDb.sentences.map((s) => s.text).join("."),
      introductionId: introductionDb.id,
    });
    await publishEvent("REQUEST_GLOBAL_SUMMARY", JSON.stringify(globalSummary));
  }
  return introductionDb;
};
