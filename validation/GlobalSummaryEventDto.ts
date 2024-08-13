import { z } from "zod";
export const GlobalSummaryEventDto = z.object({
  introductionId: z.string(),
  content: z.string(),
});
export type GlobalSummaryEventDtoType = z.infer<typeof GlobalSummaryEventDto>;
