import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import "server-only";
import { getSessionFromCookie } from "../api/session";
import { db } from "../db";

export const getUser = cache(async () => {
  console.time("getUser()");
  const token = cookies().get("c_token");
  const session = await getSessionFromCookie(token);
  if (!session) return redirect("/login");
  const user = await db.user.findUnique({
    where: { id: session.userId },
  });
  if (!user) return redirect("/login");
  console.timeEnd("getUser()");
  return user;
});
