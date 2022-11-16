import { UserSessionSchema } from "./session";

export function parseUserSession(session: any) {
  try {
    const user = UserSessionSchema.parse(session);
    return user;
  } catch (error) {
    return null;
  }
}
