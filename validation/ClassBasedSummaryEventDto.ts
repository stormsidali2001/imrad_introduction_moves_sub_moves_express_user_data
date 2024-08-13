import { z } from "zod";
export const ClassBasedSummaryEventDto = z.object({
  introductionId: z.string(),
  content: z.array(
    z.object({
      sentence: z.string(),
      move: z.coerce.number().int(),
      subMove: z.coerce.number().int(),
    }),
  ),
});

export const ClassBasedSummaryCreatedEventDto = z.object({
  introductionId: z.string(),
  content: z.string(),
});

export type ClassBasedSummaryEventDtoType = z.infer<
  typeof ClassBasedSummaryEventDto
>;

export type ClassBasedSummaryCreatedEventDtoType = z.infer<
  typeof ClassBasedSummaryCreatedEventDto
>;
