import { z } from "zod";

export const MessagePropsSchema = z.object({
  fileId: z.string(),
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(),
});
