import {
  PaginatedResponse,
  WhopAuthorizedUserResponse,
  WhopCompanyByRouteResponse,
  WhopCompanyResponse,
  WhopExperienceResponse,
  WhopMeResponse,
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
    const body = await res.json().catch((e) => ({
      message:
        "[METAERROR] Could not get further details about whop-api error.",
    }));
    throw Error(
      `Whop API request failed with: ${res.status} - ${
        res.statusText
      }. Request path: '${opts.path}. Body: ${JSON.stringify(body, null, 2)}'`
    );
  }
  const data = res.json() as T;
  console.timeEnd(`[whop-api] ${opts.method || "GET"} ${opts.path}`);
  return data;
}

export async function whopApiPaginatedAll<T>(opts: WhopApiOptions) {
  const basePath = opts.path.includes("?")
    ? opts.path + "&per=20"
    : opts.path + "?per=20";
  const res = await whopApi<PaginatedResponse<T>>({
    ...opts,
    path: basePath,
  });
  let extra: T[] = [];
  if (res.pagination.current_page < res.pagination.total_page) {
    const pages = await Promise.all(
      Array(res.pagination.total_page - 1)
        .fill(0)
        .map((_, i) =>
          whopApi<PaginatedResponse<T>>({
            ...opts,
            path: `${basePath}&page=${i + 2}`,
          })
        )
    );
    extra = pages.flatMap((p) => p.data);
  }
  return res.data.concat(extra);
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
  const res = await whopApiPaginatedAll<WhopCompanyResponse>({
    path: "/v2/me/companies",
    accessToken,
  });
  return res;
}

export async function getAuthorizedUsers(accessToken: string) {
  const res = await whopApiPaginatedAll<WhopAuthorizedUserResponse>({
    path: "/v2/me/authorized_users",
    accessToken,
  });
  console.log(`getAuthorizedUsers(${accessToken}) ==>`, res);
  return res;
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
  description: string | undefined | null,
  accessPasses?: string[] | undefined | null
) {
  // const formData = new URLSearchParams();
  // formData.append("name", name);
  // if (accessPasses) {
  //   formData.append("access_pass_ids", accessPasses.join(","));
  // }
  // if (description) formData.append("description", description);
  const res = await whopApi<WhopExperienceResponse>({
    path: "/v2/experiences",
    method: "POST",
    body: {
      name,
      access_pass_ids: accessPasses,
    },
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

export async function getExperience(companyId: string, experienceId: string) {
  const res = await whopApi<WhopExperienceResponse>({
    path: "/v2/experiences/" + experienceId,
    apiKey: true,
    whopCompany: companyId,
  });
  return res;
}

export async function deleteExperience(
  companyId: string,
  experienceId: string,
  name: string
) {
  await whopApi({
    path: "/v2/experiences/" + experienceId + "?name=" + name,
    method: "DELETE",
    apiKey: true,
    whopCompany: companyId,
  });
}
