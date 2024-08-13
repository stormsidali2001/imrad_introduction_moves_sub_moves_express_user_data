import { z } from "zod";

export const IntroductionParamsDto = z.object({
  userId: z.string().optional().nullable(),
  id: z.string(),
});

