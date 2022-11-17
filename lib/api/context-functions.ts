import invariant from "tiny-invariant";
import { db } from "../db";
import { API } from "./api";
import { parseUserSession } from "./auth";
import { parseTokenCookie } from "./cookie";
import { UserSession } from "./session";
import { getCompany } from "./whop-api";

export const companyContext = API.contextFunction(async (req, res) => {
  const route = req.query.company;
  invariant(typeof route === "string", "Invalid company route");
  const company = await getCompany(route);
  return { company };
});

export const courseContext = API.contextFunction(async (req, res) => {
  const courseId = req.query.course;
  invariant(typeof courseId === "string", "Invalid company route");
  return { courseId };
});

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

export const companyAdminUserContext = userContext.add(companyContext).add(
  API.contextFunction(async (req, res, ctx) => {
    // TODO wite this
    const isCompanyAdmin = true;

    if (!isCompanyAdmin) {
      res.status(403);
      throw Error("Not authorized");
    }

    return {};
  })
);
