import { getCompany } from "@/lib/api/whop-oauth";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { UserChip } from "./UserChip";

export default async function CompanyLayout({
  children,
  params,
}: {
  params: { company: string };
  children: ReactNode;
}) {
  const company = await getCompany(params.company);

  return (
    <div>
      <nav className="p-4 border-b-2 border-b-slate-800 flex flex-row flex-nowrap justify-between items-center">
        <div className="flex flex-row flex-nowrap items-center gap-4">
          <Image
            src={company.image_url}
            alt="Company Image Title"
            width={32}
            height={32}
            className="rounded"
          />
          <Link href={`/${company.id}`}>
            <h1 className="font-semibold text-xl hover:text-slate-400 hover:underline transition-all select-none cursor-pointer">
              {company.title}
            </h1>
          </Link>
        </div>
        <UserChip />
      </nav>
      <div className="p-4 max-w-6xl mx-auto bg-slate-800 m-4 rounded-2xl">
        {children}
      </div>
    </div>
  );
}
