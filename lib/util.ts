import { ReactNode } from "react";

export const fetcher = (...args: any[]) =>
  // @ts-ignore
  fetch(...args).then(async (res) => {
    if (res.ok) {
      return res.json();
    }
    throw new Error(res.statusText);
  });

export type PageProps = {
  params?: Record<string, string>;
  searchParams?: Record<string, string>;
};
export type LayoutProps = PageProps & {
  children: ReactNode;
};
