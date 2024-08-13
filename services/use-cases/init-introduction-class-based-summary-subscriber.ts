import {
  ClassBasedSummaryCreatedEventDto,
  type ClassBasedSummaryCreatedEventDtoType,
} from "../../validation/ClassBasedSummaryEventDto";
import { createClassBasedSummary, createSummary } from "../introductionService";
import { createUniqueSubscriber } from "../redisService";

export const initIntroductionClassBasedSummarySubscriberUseCase = async () => {
  console.log("initIntroductionClassBasedSummarySubscriberUseCase...");
  await createUniqueSubscriber(
    "CLASS_BASED_SUMMARY_CREATED",
    async (message, channel) => {
      console.info("CLASS_BASED_SUMMARY_CREATED: creating summary");
      let classBasedSummary: ClassBasedSummaryCreatedEventDtoType;
      try {
        const parsed = JSON.parse(message);

        classBasedSummary =
          await ClassBasedSummaryCreatedEventDto.parseAsync(parsed);
        console.log("ClassBasedSummaryCreatedEventDto -->", classBasedSummary);
      } catch (err) {
        console.error(
          `Failed to parse ${message} broadcasted in ${channel}` + err,
        );
        throw err;
      }

      try {
        await createClassBasedSummary(classBasedSummary);
      } catch (err) {
        console.error(
          `Failed to create the class based summary for introduction ${classBasedSummary.introductionId} ` +
            err,
        );
        throw err;
      }
    },
  );
};
