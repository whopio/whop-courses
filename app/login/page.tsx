import { PageProps } from "@/lib/util";
import Link from "next/link";

export default function LoginPage({ searchParams }: PageProps) {
  const state = encodeURIComponent(searchParams?.from || "/"); // TODO get current url
  const redirectUrl = `https://whop.com/oauth?client_id=${process.env.WHOP_CLIENT_ID}&redirect_uri=${process.env.WHOP_REDIRECT_URI}&scope=biz_rQWEMQ0yIrtNuR&state=${state}`;
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-4 p-4 rounded-lg bg-slate-800 max-w-md w-full items-center">
        <h1 className="text-2xl font-semibold">Please Login To Continue</h1>
        <Link
          className="text-center rounded-lg px-5 py-3 w-full bg-emerald-600 hover:bg-emerald-500 transition-all hover:rounded-2xl"
          href={redirectUrl}
        >
          Login with Whop
        </Link>
      </div>
    </div>
  );
}
