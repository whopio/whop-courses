"use client";

import { fetcher } from "@/lib/util";
import { createContext, ReactNode, useContext } from "react";
import useSWR from "swr";
import { MeResponse } from "../../pages/api/me";
import { ApiResponse } from "../api/handler";

type UserContextType = {
  user: MeResponse | null;
  loadingInitial: boolean;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loadingInitial: true,
});

export function UserContextProvider({ children }: { children: ReactNode }) {
  const user = useSWR<ApiResponse<MeResponse>>("/api/me", fetcher);

  return (
    <UserContext.Provider
      value={{
        user: user.data?.status === "success" ? user.data?.data : null,
        loadingInitial: user.isValidating && !user.data,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
