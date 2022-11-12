import { requireAuth } from "@/lib/api/auth";
import { handler } from "@/lib/api/handler";
import { db } from "@/lib/db";
import invariant from "tiny-invariant";

export type MeResponse = {
  id: string;
  email: string;
  username: string;
  profilePicUrl: string;
};

export default handler(requireAuth, async (req, res, ctx) => {
  invariant(ctx.user);
  const user = await db.user.findUniqueOrThrow({
    where: { id: ctx.user.userId },
    select: {
      id: true,
      username: true,
      email: true,
      profilePicUrl: true,
    },
  });
  return user;
});
