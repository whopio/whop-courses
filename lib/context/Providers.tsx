"use client";

import { FC, ReactNode } from "react";
import { UserContextProvider } from "./UserContext";

export const AppProviders: FC<{ children: ReactNode }> = ({ children }) => {
  return <UserContextProvider>{children}</UserContextProvider>;
};
