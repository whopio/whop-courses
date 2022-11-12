import { createTokenCookie } from "@/lib/api/cookie";
import invariant from "tiny-invariant";
import { handler } from "../../../lib/api/handler";
import { UserSession } from "../../../lib/api/session";
import { codeToAccessToken, getMe } from "../../../lib/api/whop-oauth";

export default handler(async (req, res) => {
  const { code } = req.query;
  invariant(typeof code === "string", "Invalid code");
  const tokens = await codeToAccessToken(code);
  const me = await getMe(tokens.access_token);

  const session: UserSession = {
    userId: me.id,
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
