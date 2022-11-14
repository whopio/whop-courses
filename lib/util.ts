import { ReactNode } from "react";

export type PageProps = {
  params?: Record<string, string>;
  searchParams?: Record<string, string>;
};
export type LayoutProps = PageProps & {
  children: ReactNode;
};
