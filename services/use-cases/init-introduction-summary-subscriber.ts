import {
  GlobalSummaryEventDto,
  GlobalSummaryEventDtoType,
} from "../../validation/GlobalSummaryEventDto";
import { createSummary } from "../introductionService";
import { createUniqueSubscriber } from "../redisService";

export const initIntroductionSummarySubscriberUseCase = async () => {
  console.log("initIntroductionSummarySubscriberUseCase ...");
  await createUniqueSubscriber(
    "GLOBAL_SUMMARY_CREATED",
    async (message, channel) => {
      console.info("GLOBAL_SUMMARY_CREATED: creating summary");
      let globalSummary: GlobalSummaryEventDtoType;
      try {
        const parsed = JSON.parse(message);

        globalSummary = await GlobalSummaryEventDto.parseAsync(parsed);
      } catch (err) {
        console.error(
          `Failed to parse ${message} broadcasted in ${channel}` + err,
        );
        throw err;
      }

      try {
        await createSummary(globalSummary);
      } catch (err) {
        console.error(
          `Failed to create the global summary for introduction ${globalSummary.introductionId} ` +
            err,
        );
        throw err;
      }
    },
  );
};
