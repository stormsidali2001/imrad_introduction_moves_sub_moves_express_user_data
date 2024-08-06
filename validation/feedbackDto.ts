import { z } from "zod";
export const FeedbackDto = z.object({
  correctMove: z.number().optional(),
  correctSubMove: z.number().optional(),
  liked: z.boolean(),
  reason: z.string().optional(),
  username: z.string().optional(),
  image: z.string().optional().nullable(),
});

export const CreateSentenceFeedbackDto = z.object({
  introductionId: z.string(),
  sentenceId: z.string(),
  feedback: FeedbackDto,
  userId: z.string(),
});

export const SentenceFeedbackDto = z.object({
  feedback: FeedbackDto,
  sentenceText: z.string(),
  sentenceId: z.string(),
  move: z.number().optional(),
  subMove: z.number().optional(),
});

export type SentenceFeedbackDtoType = z.infer<typeof SentenceFeedbackDto>;
export type FeedbackDto = z.infer<typeof FeedbackDto>;
export type CreateSentenceFeedbackDto = z.infer<
  typeof CreateSentenceFeedbackDto
>;
