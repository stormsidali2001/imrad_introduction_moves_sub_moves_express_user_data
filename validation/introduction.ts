import { z } from "zod";
import { PaginatedResultDtoMaker } from "./paginatedDtoMaker";
import { FeedbackDto } from "./feedbackDto";

export const SentenceDto = z.object({
  id: z.string().optional(),
  move: z.coerce.number(),
  subMove: z.coerce.number(),
  text: z.coerce.string(),
  order: z.number(),
  moveConfidence: z.number(),
  subMoveConfidence: z.number(),
  feedback: FeedbackDto.optional(),
});

export const IntroductionDto = z.object({
  id: z.string().optional(),
  sha: z.string(),
  userId: z.string(),
  sentences: z.array(SentenceDto),

  averageSubMoveConfidence: z.number().optional(),
  averageMoveConfidence: z.number().optional(),
});

export const introductionsArrayDto = z.array(IntroductionDto);

export const UpdateSentenceDto = SentenceDto.partial();

export const SentenceFindParamsDto = z.object({
  sentenceId: z.string(),
  introductionId: z.string(),
});

export type SentenceFindParamsDtoType = z.infer<typeof SentenceFindParamsDto>;
export type IntroductionsArrayDtoType = z.infer<typeof introductionsArrayDto>;

export type IntroductionDtoType = z.infer<typeof IntroductionDto>;
export type SentenceDtoType = z.infer<typeof SentenceDto>;

export type UpdateSentenceDtoType = z.infer<typeof UpdateSentenceDto>;
