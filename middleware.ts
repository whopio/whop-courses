import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "./lib/api/session";

export async function middleware(req: NextRequest) {
  const user = await getSessionFromCookie(req.cookies.get("c_token"));

  if (!user) {
    const from = encodeURIComponent(req.nextUrl.pathname);
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", from);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|site.webmanifest|error).*)"],
};
