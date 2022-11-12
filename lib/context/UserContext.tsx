"use client";

import { fetcher } from "@/lib/api/util";
import { createContext, ReactNode, useContext } from "react";
import useSWR from "swr";
import { MeResponse } from "../../pages/api/me";
import { ApiResponse } from "../api/handler";

type UserContextType = {
  user: MeResponse | null;
  loading: boolean;
};

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
});

export function UserContextProvider({ children }: { children: ReactNode }) {
  const user = useSWR<ApiResponse<MeResponse>>("/api/me", fetcher);

  return (
    <UserContext.Provider
      value={{
        user: user.data?.status === "success" ? user.data?.data : null,
        loading: user.isValidating,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
