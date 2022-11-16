import { getCourse } from "@/lib/server/get-course";
import { getUser } from "@/lib/server/get-user";
import { LayoutProps } from "@/lib/util";
import {
  faCircleCheck,
  faCirclePlay,
  faSpinner,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default async function Layout({ children, params }: LayoutProps) {
  const courseId = params?.course;
  const companyId = params?.company;
  const user = await getUser();
  const course = await getCourse(courseId!, user.id);

  return (
    <div className="flex h-screen items-stretch flex-nowrap">
      <div className="bg-slate-100 h-full overflow-auto w-96 p-2 flex flex-col items-stretch gap-8 shrink-0">
        <Link href={`/${companyId}/${courseId}`}>
          <h1 className="font-bold text-2xl m-2 hover:underline">
            {course.title}
          </h1>
        </Link>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between p-2">
            <span className="font-semibold text-lg">Chapter 1</span>
            <span className="text-slate-500">25 Minutes</span>
          </div>
          <Link href={`/${companyId}/${courseId}/lesson-1`}>
            <div className="p-2 transition hover:bg-slate-200 rounded-lg cursor-pointer flex items-start text-slate-600 justify-between gap-2">
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="text-emerald-500 my-1"
              />
              <span className="flex-1">Sed ut sollicitudin nisl</span>
              <FontAwesomeIcon icon={faStar} className="text-amber-500 my-1" />
            </div>
          </Link>
          <Link href={`/${companyId}/${courseId}/lesson-1`}>
            <div className="p-2 transition group hover:bg-slate-200 rounded-lg cursor-pointer flex items-start text-slate-600 justify-between gap-2">
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="text-emerald-500 my-1"
              />
              <span className="flex-1">
                Nullam aliquet sit amet risus vehicu
              </span>
              <FontAwesomeIcon
                icon={faStar}
                className="opacity-0 my-1 group-hover:opacity-100 transition hover:text-amber-500 text-slate-400"
              />
            </div>
          </Link>
          <Link href={`/${companyId}/${courseId}/lesson-1`}>
            <div className="p-2 transition hover:bg-slate-300 rounded-lg cursor-pointer flex items-start text-black font-semibold bg-slate-200 justify-between gap-2 group">
              <FontAwesomeIcon
                icon={faSpinner}
                className="text-slate-700 my-1 animate-spin"
              />
              <span className="flex-1">
                Pellentesque ultricies iaculis augue rutrum
              </span>
              <FontAwesomeIcon
                icon={faStar}
                className="opacity-0 my-1 group-hover:opacity-100 transition hover:text-amber-500 text-slate-400"
              />
            </div>
          </Link>
          <Link href={`/${companyId}/${courseId}/lesson-1`}>
            <div className="p-2 transition hover:bg-slate-200 rounded-lg cursor-pointer flex items-start text-slate-600 justify-between gap-2 group">
              <FontAwesomeIcon
                icon={faCirclePlay}
                className="text-slate-500 my-1"
              />
              <span className="flex-1">
                Phasellus ut ipsum ac eros porta hendrerit
              </span>
              <FontAwesomeIcon
                icon={faStar}
                className="opacity-0 my-1 group-hover:opacity-100 transition hover:text-amber-500 text-slate-400"
              />
            </div>
          </Link>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
