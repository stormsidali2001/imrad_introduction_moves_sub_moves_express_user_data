import { ClassBasedSummaryEventDto } from "../../validation/ClassBasedSummaryEventDto";
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

    console.log("Publishing ClassBasedSummaryEventDto ----");
    const classBasedSummary = await ClassBasedSummaryEventDto.parseAsync({
      introductionId: introductionDb.id,
      content: introductionDb.sentences.map((s) => ({
        sentence: s.text,
        move: s.move,
        subMove: s.subMove,
      })),
    });
    await publishEvent(
      "REQUEST_CLASS_BASED_SUMMARY",
      JSON.stringify(classBasedSummary),
    );
  }
  return introductionDb;
};
