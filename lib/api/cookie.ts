import * as Cookie from "cookie";
import { sealData, unsealData } from "./token";

type CookieOpts<T> = {
  data: T;
  name: string;
  ttl: number;
  httpOnly?: boolean;
};

export async function createTokenCookie<T>({
  data,
  name,
  ttl,
  httpOnly,
}: CookieOpts<T>) {
  const sealed = await sealData(data, ttl);
  const header = Cookie.serialize(name, sealed, {
    maxAge: ttl,
    sameSite: "lax",
    secure: process.env.NODE_ENV !== "development",
    priority: "high",
    path: "/",
    httpOnly: httpOnly ?? true,
  });
  return header;
}

export async function parseTokenCookie<T>(
  cookieStr: string | undefined,
  name: string
): Promise<T | null>;
export async function parseTokenCookie(
  cookieStr: string | undefined,
  cookies: string[]
): Promise<(any | null)[]>;
export async function parseTokenCookie<T>(
  cookieStr: string | undefined,
  names: string | string[]
): Promise<(any | null)[] | T | null> {
  if (!cookieStr) return null;
  const cookies = Cookie.parse(cookieStr);

  async function parseSingleCookie(name: string) {
    const sealed = cookies[name];
    if (!sealed) return null;
    try {
      const unsealed = await unsealData(sealed);
      return unsealed as any;
    } catch (error) {
      return null;
    }
  }

  if (typeof names === "string") {
    return parseSingleCookie(names);
  } else {
    return Promise.all(names.map(parseSingleCookie));
  }
}

export function clearCookie(name: string) {
  const header = Cookie.serialize(name, "", {
    expires: new Date(0),
    sameSite: "lax",
    secure: true,
    path: "/",
    priority: "high",
  });
  return header;
}
