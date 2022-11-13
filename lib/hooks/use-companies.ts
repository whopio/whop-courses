import useSWR from "swr";
import { ApiResponse } from "../api/handler";
import { WhopUserCompanies } from "../api/whop-api-types";
import { fetcher } from "../util";

export function useCompanies() {
  const companies = useSWR<ApiResponse<WhopUserCompanies>>(
    "/api/companies",
    fetcher
  );
  const data =
    companies.data && companies.data.status === "success"
      ? companies.data.data
      : null;
  return {
    data,
    loading: companies.isValidating && !data,
    error: companies.data?.status === "error" ? companies.data.message : null,
  };
}
