import { cache } from "react";
import "server-only";
import { getCompanyByRoute } from "../api/whop-api";

export const getCompany = cache(async (route: string) => {
  const company = await getCompanyByRoute(route);
  return company;
});
