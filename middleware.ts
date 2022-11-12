import { RequestCookie } from "next/dist/server/web/spec-extension/cookies";
import { NextRequest, NextResponse } from "next/server";
import { UserSession } from "./lib/api/session";
import { unsealData } from "./lib/api/token";

async function getUser(cookie?: RequestCookie) {
  if (!cookie) return null;
  try {
    const user = await unsealData<UserSession>(cookie.value);
    return user;
  } catch (error) {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const user = await getUser(req.cookies.get("c_token"));
  const company = req.nextUrl.pathname.split("/")[1];

  console.log("User:", user);
  console.log("Company:", company);

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
