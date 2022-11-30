import { cache } from "react";
import "server-only";
import { getCompanyByRoute } from "../api/whop-api";

export const getCompany = cache(async (route: string) => {
  console.time(`getCompany(${route})`);
  const company = await getCompanyByRoute(route);
  console.timeEnd(`getCompany(${route})`);
  return company;
});
