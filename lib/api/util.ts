import { ReactNode } from "react";

export const fetcher = (...args: any[]) =>
  // @ts-ignore
  fetch(...args).then((res) => {
    if (res.ok) {
      return res.json().then((data) => {
        console.log("fetched:", data);
        return data;
      });
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
