import { db } from "@/lib/db";
import { getCompany } from "@/lib/server/get-company";
import { getUser } from "@/lib/server/get-user";
import { LayoutProps } from "@/lib/util";
import { Button } from "@/ui/Button";
import { IconButton } from "@/ui/IconButton";
import {
  faArrowRightFromBracket,
  faCaretDown,
  faLockOpen,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

export default async function CompanyLayout({ children, params }: LayoutProps) {
  const company = await getCompany(params!.company);
  const courses = await db.course.findMany({
    where: {
      companyId: company.tag,
    },
  });
  const user = await getUser();

  return (
    <div className="flex h-screen flex-nowrap items-stretch justify-start">
      <nav className="bg-neutral-900 flex flex-col gap-8 p-4 items-stretch w-80 shrink-0 overflow-auto">
        <div className="group flex flex-row flex-nowrap items-center gap-2 bg-black rounded-lg p-3">
          <Image
            src={company.image_url}
            alt="Company Image Title"
            width={32}
            height={32}
            className="rounded-full"
          />
          <Link className="flex-1" href={`/${company.route}`}>
            <h1 className="font-semibold text-md text-white group-hover:text-slate-300 transition-all select-none cursor-pointer">
              {company.title}
            </h1>
          </Link>
          <button className="text-slate-500 text-lg group-hover:bg-slate-900 w-8 h-8 rounded-full transition">
            <FontAwesomeIcon icon={faCaretDown} />
          </button>
        </div>

        <div className="flex gap-2 items-center">
          {user.profilePicUrl ? (
            <Image
              alt="Your profile picture"
              src={user.profilePicUrl}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="rounded-full w-12 h-12 bg-slate-800 flex items-center justify-center text-white">
              <FontAwesomeIcon icon={faPerson} />
            </div>
          )}
          <div className="flex-1 flex flex-col">
            <h3 className="text-md font-semibold text-white">
              {user.username}
            </h3>
            <span className="text-xs text-slate-400">Tier 2 Access Pass</span>
          </div>

          <IconButton
            href="/api/auth/logout"
            variant="outline"
            color="danger"
            size="sm"
            icon={faArrowRightFromBracket}
          />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <Link
            href={`/${params!.company}/${"course-0"}`}
            className=" bg-slate-800 hover:bg-slate-700 p-4 rounded-lg flex items-center text-slate-50 transition"
          >
            <FontAwesomeIcon icon={faLockOpen} className="w-10" />
            <span>Course 1</span>
          </Link>

          <Link
            href={`/${params!.company}/${"course-1"}`}
            className="hover:bg-slate-800 p-4 rounded-lg flex items-center text-slate-400 transition"
          >
            <FontAwesomeIcon icon={faLockOpen} className="w-10" />
            <span>Course 2</span>
          </Link>
          <Link
            href={`/${params!.company}/${"course-2"}`}
            className=" bg-slate-800 hover:bg-slate-700 p-4 rounded-lg flex items-center text-slate-50 transition"
          >
            <FontAwesomeIcon icon={faLockOpen} className="w-10" />
            <span>Course 3</span>
          </Link>

          <Link
            href={`/${params!.company}/${"course-3"}`}
            className="hover:bg-slate-800 p-4 rounded-lg flex items-center text-slate-400 transition"
          >
            <FontAwesomeIcon icon={faLockOpen} className="w-10" />
            <span>Course 4</span>
          </Link>
        </div>
        <Button
          fullWidth
          variant="filled"
          color="neutral"
          href="https://whop.com"
          iconLeft={faArrowRightFromBracket}
        >
          Back to Whop
        </Button>
      </nav>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
