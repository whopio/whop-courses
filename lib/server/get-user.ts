import { cookies } from "next/headers";
import { cache } from "react";
import "server-only";
import { getSessionFromCookie } from "../api/session";
import { db } from "../db";

export const getUser = cache(async () => {
  const token = cookies().get("c_token");
  const session = await getSessionFromCookie(token);
  if (!session) throw Error("Not logged in");
  const user = await db.user.findUnique({
    where: { id: session.userId },
  });
  if (!user) throw Error("Not logged in");
  return user;
});
