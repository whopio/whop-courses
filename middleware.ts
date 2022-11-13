import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "./lib/api/session";

export async function middleware(req: NextRequest) {
  const user = await getSessionFromCookie(req.cookies.get("c_token"));
  const companyRoute = req.nextUrl.pathname.split("/")[1];

  if (!companyRoute) {
    const url = req.nextUrl.clone();
    url.searchParams.set("type", "noCompany");
    url.pathname = "/error";
    return NextResponse.redirect(url);
  }

  if (!user) {
    const url = req.nextUrl.clone();
    url.searchParams.set("route", companyRoute);
    url.searchParams.set("from", req.nextUrl.pathname);
    url.pathname = "/api/auth/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|site.webmanifest|error).*)"],
};
