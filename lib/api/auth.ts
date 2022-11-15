import { API } from "./api";
import { parseTokenCookie } from "./cookie";
import { UserSession, UserSessionSchema } from "./session";

export function parseUserSession(session: any) {
  try {
    const user = UserSessionSchema.parse(session);
    return user;
  } catch (error) {
    return null;
  }
}

export const AuthedAPI = new API((req, res) => {
  const token = parseTokenCookie<UserSession>(req.headers.cookie, "c_token");
  if (!token) {
    res.status(401);
    throw Error("Not authenticated and authentication is required");
  }
  const session = parseUserSession(token);
  if (!session) {
    res.status(401);
    throw Error("Not authenticated and authentication is required");
  }
  return session;
});

export const OptionalAuthedAPI = new API((req, res) => {
  const token = parseTokenCookie<UserSession>(req.headers.cookie, "c_token");
  if (!token) return null;
  const session = parseUserSession(token);
  return session;
});
