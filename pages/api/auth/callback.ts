import { API } from "@/lib/api/api";
import { createTokenCookie } from "@/lib/api/cookie";
import {
  getMe,
  getUserCompanies,
  getUserMemberships,
} from "@/lib/api/whop-api";
import { db } from "@/lib/db";
import invariant from "tiny-invariant";
import { UserSession } from "../../../lib/api/session";
import { codeToAccessToken } from "../../../lib/api/whop-oauth";

export default API.noContext().get(async (req, res) => {
  const { code, state } = req.query;
  invariant(typeof code === "string", "Invalid code");
  const tokens = await codeToAccessToken(code);

  const memberships = await getUserMemberships(tokens.access_token);
  invariant(
    memberships.some((m) => m.valid),
    "You don't have a valid membership"
  );

  const me = await getMe(tokens.access_token);

  const user = await db.user.upsert({
    where: { id: me.id },
    create: {
      id: me.id,
      email: me.email,
      profilePicUrl: me.profile_pic_url,
      username: me.username,
      whopAccessToken: tokens.access_token,
      whopRefreshToken: tokens.refresh_token,
      whopTokenExpiry: new Date(
        tokens.expires_in * 1000 + new Date().getTime()
      ),
    },
    update: {
      email: me.email,
      profilePicUrl: me.profile_pic_url,
      username: me.username,
      whopAccessToken: tokens.access_token,
      whopRefreshToken: tokens.refresh_token,
      whopTokenExpiry: new Date(
        tokens.expires_in * 1000 + new Date().getTime()
      ),
    },
  });

  const userCompanies = await getUserCompanies(tokens.access_token);
  const existingCompanies = await db.company.findMany({
    where: {
      id: {
        in: userCompanies.map((c) => c.id),
      },
    },
  });
  const newCompanies = userCompanies.filter(
    (c) => !existingCompanies.find((ec) => ec.id === c.id)
  );
  await db.company.createMany({
    data: newCompanies.map((c) => ({
      id: c.id,
    })),
  });

  const session: UserSession = {
    userId: user.id,
    whopToken: user.whopAccessToken,
  };

  const cookie = await createTokenCookie({
    data: session,
    httpOnly: true,
    name: "c_token",
    ttl: 60 * 60 * 24 * 180,
  });

  res.setHeader("Set-Cookie", cookie);

  const redirect =
    typeof state === "string" ? prefix(decodeURIComponent(state), "/") : "/";

  res.redirect(redirect);
});

const prefix = (s: string, prefix: string) =>
  s.startsWith(prefix) ? s : prefix + s;
