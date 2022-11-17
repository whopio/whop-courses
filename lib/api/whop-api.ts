import {
  WhopCompanyByRouteResponse,
  WhopCompanyResponse,
  WhopMeResponse,
  WhopUserCompanies,
} from "./whop-api-types";

export type WhopApiOptions = {
  path: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: object;
  accessToken?: string;
  apiKey?: boolean;
  whopCompany?: string;
};

export async function whopApi<T = any>(opts: WhopApiOptions) {
  const headers: any = {};
  headers["Accept"] = "application/json";
  if (opts.whopCompany) headers["Whop-Company"] = opts.whopCompany;
  if (opts.apiKey)
    headers["Authorization"] = `Bearer ${process.env.WHOP_API_KEY}`;
  if (opts.accessToken) headers["Authorization"] = `Bearer ${opts.accessToken}`;

  const res = await fetch(`${process.env.WHOP_API_URL}${opts.path}`, {
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    method: opts.method || "GET",
    headers,
  });
  if (!res.ok) {
    throw Error(
      `Whop API request failed with: ${res.status} - ${res.statusText}. Request path: '${opts.path}'`
    );
  }
  const data = res.json() as T;
  return data;
}

export async function getMe(accessToken: string) {
  return whopApi<WhopMeResponse>({ path: "/v2/me", accessToken });
}

export async function getCompany(id: string) {
  return whopApi<WhopCompanyResponse>({
    path: "/v2/company",
    whopCompany: id,
    apiKey: true,
  });
}

export async function getCompanyByRoute(
  route: string
): Promise<WhopCompanyByRouteResponse> {
  return whopApi<WhopCompanyByRouteResponse>({
    path: `/v3/companies/${route}`,
  });
}

export async function getUserCompanies(accessToken: string) {
  const res = await whopApi({
    path: "/v2/me/companies",
    accessToken,
  });
  return res.data as WhopUserCompanies;
}
