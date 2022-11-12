import { PageProps } from "@/lib/util";

export default async function CompanyPage({}: PageProps) {
  return (
    <div className="p-4 border-2 border-slate-800 rounded-lg">
      <h1 className="text-2xl font-bold">List of courses here</h1>
    </div>
  );
}

export const dynamic = "force-static",
  dynamicParams = true,
  revalidate = 300;
