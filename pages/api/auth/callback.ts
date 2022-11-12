import { createTokenCookie } from "@/lib/api/cookie";
import { db } from "@/lib/db";
import invariant from "tiny-invariant";
import { handler } from "../../../lib/api/handler";
import { UserSession } from "../../../lib/api/session";
import { codeToAccessToken, getMe } from "../../../lib/api/whop-oauth";

export default handler(async (req, res) => {
  const { code } = req.query;
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
      companies: {
        connectOrCreate: {
          where: {
            companyId_userId: {
              companyId: tokens.scope,
              userId: me.id,
            },
          },
          create: {
            company: {
              connectOrCreate: {
                where: { id: tokens.scope },
                create: {
                  id: tokens.scope,
                  route: tokens.scope,
                },
              },
            },
          },
        },
      },
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

  res.redirect(`/${tokens.scope}`);
});
