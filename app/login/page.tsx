import { PageProps } from "@/lib/util";
import { Button } from "@/ui/Button";

export default function LoginPage({ searchParams }: PageProps) {
  const state = encodeURIComponent(searchParams?.from || "/"); // TODO get current url
  const redirectUrl = `https://whop.com/oauth?client_id=${process.env.WHOP_CLIENT_ID}&redirect_uri=${process.env.WHOP_REDIRECT_URI}&scope=biz_rQWEMQ0yIrtNuR&state=${state}`;
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow max-w-md w-full items-center">
        <h1 className="text-2xl font-semibold">Please Login To Continue</h1>
        <Button variant={"green"} fullWidth href={redirectUrl}>
          Login with Whop
        </Button>
      </div>
    </div>
  );
}
