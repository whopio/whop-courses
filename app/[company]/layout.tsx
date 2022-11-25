import { db } from "@/lib/db";
import { getCompany } from "@/lib/server/get-company";
import { getUser } from "@/lib/server/get-user";
import { blurDataURL, LayoutProps } from "@/lib/util";
import { Button } from "@/ui/Button";
import { IconButton } from "@/ui/IconButton";
import {
  faArrowRightFromBracket,
  faCaretDown,
  faGear,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { CourseSidebarButton } from "./CourseSidebarButton";

export default async function CompanyLayout({ children, params }: LayoutProps) {
  const company = await getCompany(params!.company);
  // Todo, figure out if the current user has access to these courses
  const user = await getUser();
  const courses = await db.course.findMany({
    where: {
      companyId: company.tag,
      status: "PUBLISHED",
    },
  });

  return (
    <div className="flex h-screen flex-nowrap items-stretch justify-start">
      <nav className="bg-neutral-900 flex flex-col gap-8 p-4 items-stretch w-80 shrink-0 overflow-auto">
        <div className="group flex flex-row flex-nowrap items-center gap-2 bg-black rounded-lg p-3">
          <Image
            placeholder="blur"
            blurDataURL={blurDataURL}
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
              placeholder="blur"
              blurDataURL={blurDataURL}
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
            link
            href="/api/auth/logout"
            variant="outline"
            color="danger"
            size="sm"
            icon={faArrowRightFromBracket}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-bold text-white">Courses</div>
          {courses.map((course) => (
            <CourseSidebarButton
              key={course.id}
              companyRoute={params!.company}
              text={course.title}
              route={course.id}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-bold text-white">Admin</div>
          <CourseSidebarButton
            route="admin"
            companyRoute={params!.company}
            text="Manage Courses"
            icon={faGear}
          />
        </div>
        <div className="flex-1"></div>
        <Button
          link
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
