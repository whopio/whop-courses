import { RequestCookie } from "next/dist/server/web/spec-extension/cookies";
import z from "zod";
import { unsealData } from "./token";

export const UserSessionSchema = z.object({
  userId: z.string(),
  whopToken: z.string(),
});

export type UserSession = z.infer<typeof UserSessionSchema>;

export async function getSessionFromCookie(cookie?: RequestCookie) {
  if (!cookie) return null;
  try {
    const user = await unsealData<UserSession>(cookie.value);
    return user;
  } catch (error) {
    return null;
  }
}
