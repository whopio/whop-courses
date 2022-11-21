import { RequestInit } from "next/dist/server/web/spec-extension/request";
import { ApiResponse } from "./api";

type APIRequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type APITypeDef = {
  RESPONSE: {
    GET: any;
    POST: any;
    PUT: any;
    PATCH: any;
    DELETE: any;
  };
  BODY: {
    GET: never;
    POST: any;
    PUT: any;
    PATCH: any;
    DELETE: never;
  };
};

async function apiRequest<
  Method extends APIRequestMethod,
  APIType extends APITypeDef
>(
  url: string,
  method: Method,
  opts: RequestInit,
  body: APIType["BODY"][Method]
): Promise<APIType["RESPONSE"][Method]> {
  const res = await fetch(`/api${url}`, {
    ...opts,
    method,
    body:
      opts.body ??
      (method === "GET" || method === "DELETE"
        ? undefined
        : JSON.stringify(body)),
    headers: {
      "Content-Type": "application/json",
      ...opts.headers,
    },
  });
  const data = (await res.json()) as ApiResponse<APIType["RESPONSE"][Method]>;
  if (data.status === "error") throw Error(data.message);
  return data.data;
}

export function apiGet<APIType extends APITypeDef>(
  url: string,
  opts: RequestInit = {}
) {
  return apiRequest<"GET", APIType>(url, "GET", opts, undefined as never);
}
export function apiDelete<APIType extends APITypeDef>(
  url: string,
  opts: RequestInit = {}
) {
  return apiRequest<"DELETE", APIType>(url, "DELETE", opts, undefined as never);
}
export function apiPost<APIType extends APITypeDef>(
  url: string,
  body: APIType["BODY"]["POST"],
  opts: RequestInit = {}
) {
  return apiRequest<"POST", APIType>(url, "POST", opts, body);
}
export function apiPut<APIType extends APITypeDef>(
  url: string,
  body: APIType["BODY"]["PUT"],
  opts: RequestInit = {}
) {
  return apiRequest<"PUT", APIType>(url, "PUT", opts, body);
}
export function apiPatch<APIType extends APITypeDef>(
  url: string,
  body: APIType["BODY"]["PATCH"],
  opts: RequestInit = {}
) {
  return apiRequest<"PATCH", APIType>(url, "PATCH", opts, body);
}
