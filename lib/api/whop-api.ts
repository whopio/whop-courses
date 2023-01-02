import {
  WhopAuthorizedUserResponse,
  WhopCompanyByRouteResponse,
  WhopCompanyResponse,
  WhopExperienceResponse,
  WhopMeResponse,
  WhopUserCompanies,
  WhopUserMembershipResponse,
} from "./whop-api-types";

export type WhopApiOptions = {
  path: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: object | URLSearchParams;
  accessToken?: string;
  apiKey?: boolean;
  whopCompany?: string;
};

export async function whopApi<T = any>(opts: WhopApiOptions) {
  console.time(`[whop-api] ${opts.method || "GET"} ${opts.path}`);

  const headers: any = {};
  headers["Accept"] = "application/json";
  if (opts.whopCompany) headers["Whop-Company"] = opts.whopCompany;
  if (opts.apiKey)
    headers["Authorization"] = `Bearer ${process.env.WHOP_API_KEY}`;
  if (opts.accessToken) headers["Authorization"] = `Bearer ${opts.accessToken}`;

  let body = undefined;
  if (opts.body) {
    if (opts.body instanceof URLSearchParams) {
      body = opts.body;
      headers["Content-Type"] = "application/x-www-form-urlencoded";
    } else {
      body = JSON.stringify(opts.body);
      headers["Content-Type"] = "application/json";
    }
  }

  const res = await fetch(`${process.env.WHOP_API_URL}${opts.path}`, {
    body,
    method: opts.method || "GET",
    headers,
  });
  if (!res.ok) {
    throw Error(
      `Whop API request failed with: ${res.status} - ${res.statusText}. Request path: '${opts.path}'`
    );
  }
  const data = res.json() as T;
  console.timeEnd(`[whop-api] ${opts.method || "GET"} ${opts.path}`);
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
    path: `/v3/companies/${route}/jordan`,
  });
}

export async function getUserCompanies(accessToken: string) {
  const res = await whopApi({
    path: "/v2/me/companies",
    accessToken,
  });
  console.log(res);
  return res.data as WhopUserCompanies;
}

export async function getAuthorizedUsers(accessToken: string) {
  const res = await whopApi({
    path: "/v2/me/authorized_users",
    accessToken,
  });
  console.log(`getAuthorizedUsers(${accessToken}) ==>`, res);
  return res.data as WhopAuthorizedUserResponse;
}

export async function isUserAdmin(accessToken: string, companyId: string) {
  // TODO use sharkeys better endpoint
  const companies = await getAuthorizedUsers(accessToken);
  const perms = companies.find((c) => c.company === companyId);
  console.log(
    `Is User Admin? (cid: ${companyId}, accessToken: ${accessToken}) =>`,
    perms
  );
  const isCompanyAdmin = perms && perms.permission_level <= 1;
  return !!isCompanyAdmin;
}

export async function getUserMemberships(accessToken: string) {
  const res = await whopApi({
    path: "/v2/me/memberships",
    accessToken,
  });
  return res.data as WhopUserMembershipResponse;
}

export async function hasAccess(accessToken: string, resource: string) {
  const res = await whopApi<{ valid: boolean }>({
    path: `/v2/me/has_access/${resource}`,
    accessToken,
  });
  return res.valid;
}

export async function createExperience(
  companyId: string,
  name: string,
  description: string | undefined | null
) {
  const formData = new URLSearchParams();
  formData.append("name", name);
  if (description) formData.append("description", description);
  const res = await whopApi<WhopExperienceResponse>({
    path: "/v2/experiences",
    method: "POST",
    body: formData,
    apiKey: true,
    whopCompany: companyId,
  });

  return res;
}

export async function updateExperience(
  companyId: string,
  experienceId: string,
  name: string,
  description: string | undefined | null
) {
  const formData = new URLSearchParams();
  formData.append("name", name);
  if (description) formData.append("description", description);
  const res = await whopApi<WhopExperienceResponse>({
    path: "/v2/experiences/" + experienceId,
    method: "POST",
    body: formData,
    apiKey: true,
    whopCompany: companyId,
  });

  return res;
}

export async function deleteExperience(
  companyId: string,
  experienceId: string
) {
  await whopApi({
    path: "/v2/experiences/" + experienceId,
    method: "DELETE",
    apiKey: true,
    whopCompany: companyId,
  });
}
