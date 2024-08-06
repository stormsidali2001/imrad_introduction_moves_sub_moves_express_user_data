import { z } from "zod";
export const RetrieverParamsDto = z.object({
  search: z.string().optional(),
  userId: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
});

