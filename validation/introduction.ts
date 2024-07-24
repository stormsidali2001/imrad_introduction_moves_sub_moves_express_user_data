import {z } from 'zod';

export const SentenceDto = z.object({
        move: z.number(),
        subMove: z.number(),
        text: z.string(),
        order: z.number(),
        moveConfidence: z.number(),
        subMoveConfidence: z.number(),
    });

export const IntroductionDto = z.object({
    content: z.string(),
    userId:z.string(),
    sentences: z.array(SentenceDto)
})

export const introductionsArrayDto = z.array(IntroductionDto);

export const UpdateSentenceDto = SentenceDto.partial();


export type IntroductionDtoType = z.infer<typeof IntroductionDto>;
export type SentenceDtoType = z.infer<typeof SentenceDto>;
export type IntroductionsArrayDtoType = z.infer<typeof introductionsArrayDto>;

export type UpdateSentenceDtoType = z.infer<typeof UpdateSentenceDto>;