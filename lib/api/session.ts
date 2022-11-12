import z from "zod";

export const UserSessionSchema = z.object({
  userId: z.string(),
});

export type UserSession = z.infer<typeof UserSessionSchema>;
