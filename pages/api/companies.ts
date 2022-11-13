import { requireAuth } from "@/lib/api/auth";
import { handler } from "@/lib/api/handler";
import { getUserCompanies } from "@/lib/api/whop-api";
import { db } from "@/lib/db";
import invariant from "tiny-invariant";

export default handler(requireAuth, async (req, res, ctx) => {
  invariant(ctx.user);
  const user = await db.user.findUniqueOrThrow({
    where: { id: ctx.user.userId },
  });
  const companies = await getUserCompanies(user.whopAccessToken);
  return companies;
});
