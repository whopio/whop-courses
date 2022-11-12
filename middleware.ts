import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "./lib/api/session";

export async function middleware(req: NextRequest) {
  const user = await getSessionFromCookie(req.cookies.get("c_token"));
  const company = req.nextUrl.pathname.split("/")[1];

  if (!company || !company.startsWith("biz_")) {
    const url = req.nextUrl.clone();
    url.searchParams.set("type", "noCompany");
    url.pathname = "/error";
    return NextResponse.redirect(url);
  }

  if (!user) {
    return NextResponse.redirect(
      `https://whop.com/oauth?client_id=${process.env.WHOP_CLIENT_ID}&redirect_uri=${process.env.WHOP_REDIRECT_URI}&scope=${company}`
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|site.webmanifest|error).*)"],
};
