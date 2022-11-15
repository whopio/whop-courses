import { getCompany } from "@/lib/server/get-company";
import { LayoutProps } from "@/lib/util";
import { IconButton } from "@/ui/IconButton";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";
import { UserChip } from "./UserChip";

export default async function CompanyLayout({ children, params }: LayoutProps) {
  const company = await getCompany(params!.company);
  return (
    <>
      <nav className="py-3 px-6 shadow flex flex-row flex-nowrap justify-between items-center">
        <div className="flex flex-row flex-nowrap items-center gap-4">
          <Image
            src={company.image_url}
            alt="Company Image Title"
            width={40}
            height={40}
            className="rounded"
          />
          <Link href={`/${company.route}`}>
            <h1 className="font-semibold text-xl hover:text-slate-700 hover:underline transition-all select-none cursor-pointer">
              {company.title}
            </h1>
          </Link>
        </div>
        <div className="flex gap-2">
          {/* @ts-expect-error Server Component */}
          <UserChip />
          <IconButton
            href="/api/auth/logout"
            variant="light"
            color="danger"
            icon={faArrowRightFromBracket}
          />
        </div>
      </nav>
      <div className="p-4 max-w-6xl mx-auto">{children}</div>
    </>
  );
}
