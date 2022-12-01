import { getUserCompanies, isUserAdmin } from "@/lib/api/whop-api";
import { db } from "@/lib/db";
import { getCompany } from "@/lib/server/get-company";
import { getUser } from "@/lib/server/get-user";
import { blurDataURL, LayoutProps } from "@/lib/util";
import { Button } from "@/ui/Button";
import {
  faArrowRightFromBracket,
  faGear,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { CompanySwitcherModal } from "./CompanySwitcherModal";
import { CourseSidebarButton } from "./CourseSidebarButton";
import { Sidepanel } from "./SidePanel";

export default async function CompanyLayout({ children, params }: LayoutProps) {
  console.time("company.layout");
  const company = await getCompany(params!.company);
  // Todo, figure out if the current user has access to these courses
  const user = await getUser();
  const companies = await getUserCompanies(user.whopAccessToken);
  const isAllowed = companies.some((c) => c.id === company.tag);
  if (!isAllowed) throw Error("You do not have permission to be on this page.");
  const courses = await db.course.findMany({
    where: {
      companyId: company.tag,
      status: "PUBLISHED",
    },
  });
  const isAdmin = await isUserAdmin(user.whopAccessToken, company.tag);
  console.timeEnd("company.layout");

  return (
    <div className="flex h-screen flex-nowrap items-stretch justify-start">
      <Sidepanel>
        <CompanySwitcherModal
          companies={companies}
          selectedRoute={params!.company}
        />

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
            {/* <span className="text-xs text-slate-400">Tier 2 Access Pass</span> */}
          </div>

          {/* <IconButton
            link
            href="/api/auth/logout"
            variant="outline"
            color="danger"
            size="sm"
            icon={faArrowRightFromBracket}
          /> */}
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
        {isAdmin && (
          <div className="flex flex-col gap-2">
            <div className="font-bold text-white">Admin</div>
            <CourseSidebarButton
              route="admin"
              companyRoute={params!.company}
              text="Manage Courses"
              icon={faGear}
            />
          </div>
        )}
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
      </Sidepanel>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
