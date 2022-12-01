import invariant from "tiny-invariant";
import { db } from "../db";
import { API } from "./api";
import { parseUserSession } from "./auth";
import { parseTokenCookie } from "./cookie";
import { UserSession } from "./session";
import { getCompany, isUserAdmin } from "./whop-api";

export function routeParam<Param extends string>(param: Param, name?: string) {
  return API.contextFunction(async (req, res) => {
    const key = name || param;
    const p = req.query[key];
    invariant(typeof p === "string", `Invalid value for url param :${key}`);
    const ctx = {
      [param]: p,
    };
    return ctx as { [K in Param]: string };
  });
}

export const companyContext = API.contextFunction(async (req, res) => {
  const route = req.query.company;
  invariant(typeof route === "string", "Invalid company route");
  const company = await getCompany(route);
  return { company };
});

export const courseContext = routeParam("courseId", "course");

export const sessionContext = API.contextFunction(async (req, res) => {
  const token = await parseTokenCookie<UserSession>(
    req.headers.cookie,
    "c_token"
  );
  if (!token) {
    res.status(401);
    throw Error("Not authenticated and authentication is required");
  }
  const session = parseUserSession(token);
  if (!session) {
    res.status(401);
    throw Error("Not authenticated and authentication is required");
  }
  return { session };
});

export const optionalSessionContext = API.contextFunction((req, res) => {
  const token = parseTokenCookie<UserSession>(req.headers.cookie, "c_token");
  if (!token) return { session: null };
  const session = parseUserSession(token);
  return { session };
});

export const userContext = sessionContext.add(
  API.contextFunction(async (req, res, ctx) => {
    const user = await db.user.findUniqueOrThrow({
      where: { id: ctx.session.userId },
    });
    return { user };
  })
);

export const companyAdminUserContext = sessionContext.add(companyContext).add(
  API.contextFunction(async (req, res, ctx) => {
    const isAdmin = await isUserAdmin(ctx.session.whopToken, ctx.company.id);
    if (!isAdmin) {
      res.status(403);
      throw Error("Not authorized");
    }

    return {};
  })
);
