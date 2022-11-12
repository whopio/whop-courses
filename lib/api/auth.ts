import { parseTokenCookie } from "./cookie";
import { MiddlewareFunction } from "./handler";
import { UserSession, UserSessionSchema } from "./session";

export function parseUserSession(session: any) {
  try {
    const user = UserSessionSchema.parse(session);
    return user;
  } catch (error) {
    return null;
  }
}

export const requireAuth: MiddlewareFunction = async (req, res, ctx, next) => {
  const user =
    ctx.user ||
    (await parseTokenCookie<UserSession>(req.headers.cookie, "token"));

  if (!user) {
    throw Error("Not authenticated");
  }

  return next({ ...ctx, user });
};

export const withUser: MiddlewareFunction = async (req, res, ctx, next) => {
  const user =
    ctx.user ||
    (await parseTokenCookie<UserSession>(req.headers.cookie, "token"));

  return next({ ...ctx, user });
};
