import { getCompanyByRoute } from "@/lib/api/whop-api";
import { LayoutProps } from "@/lib/util";
import Image from "next/image";
import Link from "next/link";
import { UserChip } from "./UserChip";

export default async function CompanyLayout({ children, params }: LayoutProps) {
  const company = await getCompanyByRoute(params!.company);
  return (
    <>
      <nav className="py-3 px-6 border-b-2 border-b-slate-800 flex flex-row flex-nowrap justify-between items-center">
        <div className="flex flex-row flex-nowrap items-center gap-4">
          <Image
            src={company.image_url}
            alt="Company Image Title"
            width={32}
            height={32}
            className="rounded"
          />
          <Link href={`/${company.route}`}>
            <h1 className="font-semibold text-xl hover:text-slate-400 hover:underline transition-all select-none cursor-pointer">
              {company.title}
            </h1>
          </Link>
        </div>
        <UserChip />
      </nav>
      <div className="p-4 max-w-6xl mx-auto">{children}</div>
    </>
  );
}

export const dynamic = "force-static",
  dynamicParams = true,
  revalidate = 300;
