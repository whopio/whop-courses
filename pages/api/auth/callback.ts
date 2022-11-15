import { BaseAPI } from "@/lib/api/api";
import { createTokenCookie } from "@/lib/api/cookie";
import { getMe } from "@/lib/api/whop-api";
import { db } from "@/lib/db";
import invariant from "tiny-invariant";
import { UserSession } from "../../../lib/api/session";
import { codeToAccessToken } from "../../../lib/api/whop-oauth";

export default BaseAPI.get(async (req, res) => {
  const { code, state } = req.query;
  invariant(typeof code === "string", "Invalid code");
  const tokens = await codeToAccessToken(code);
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

  const session: UserSession = {
    userId: user.id,
  };

  const cookie = await createTokenCookie({
    data: session,
    httpOnly: true,
    name: "c_token",
    ttl: 60 * 60 * 24 * 180,
  });

  res.setHeader("Set-Cookie", cookie);

  res.redirect(typeof state === "string" ? decodeURIComponent(state) : "/");
});
