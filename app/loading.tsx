import { Button } from "@/ui/Button";
import {
  faArrowRightFromBracket,
  faCaretDown,
  faLockOpen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CompanyLoading() {
  return (
    <div className="flex h-screen flex-nowrap items-stretch justify-start">
      <nav className="bg-neutral-900 flex flex-col gap-8 p-4 items-stretch w-80 shrink-0 overflow-auto">
        <div className="group flex flex-row flex-nowrap items-center gap-2 bg-black rounded-lg p-3">
          <div className="w-8 h-8 rounded-full bg-neutral-700 animate-pulse"></div>
          <div className="h-6 flex-1 rounded-lg bg-neutral-700 animate-pulse"></div>
          <button className="text-slate-500 text-lg group-hover:bg-slate-900 w-8 h-8 rounded-full transition">
            <FontAwesomeIcon icon={faCaretDown} />
          </button>
        </div>
        <div className="flex gap-2 items-center">
          <div className="rounded-full w-12 h-12 bg-slate-700 animate-pulse"></div>
          <div className="h-6 flex-1 rounded-lg bg-neutral-700 animate-pulse"></div>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <div className=" bg-slate-800 hover:bg-slate-700 p-4 rounded-lg flex items-center text-slate-50 transition">
            <FontAwesomeIcon icon={faLockOpen} className="w-10" />
            <div className="h-6 flex-1 rounded-lg bg-neutral-700 animate-pulse"></div>
          </div>
          <div className=" bg-slate-800 hover:bg-slate-700 p-4 rounded-lg flex items-center text-slate-50 transition">
            <FontAwesomeIcon icon={faLockOpen} className="w-10" />
            <div className="h-6 flex-1 rounded-lg bg-neutral-700 animate-pulse"></div>
          </div>
          <div className=" bg-slate-800 hover:bg-slate-700 p-4 rounded-lg flex items-center text-slate-50 transition">
            <FontAwesomeIcon icon={faLockOpen} className="w-10" />
            <div className="h-6 flex-1 rounded-lg bg-neutral-700 animate-pulse"></div>
          </div>
          <div className=" bg-slate-800 hover:bg-slate-700 p-4 rounded-lg flex items-center text-slate-50 transition">
            <FontAwesomeIcon icon={faLockOpen} className="w-10" />
            <div className="h-6 flex-1 rounded-lg bg-neutral-700 animate-pulse"></div>
          </div>
        </div>
        <Button
          fullWidth
          variant="filled"
          color="neutral"
          link
          href="https://whop.com"
          iconLeft={faArrowRightFromBracket}
        >
          Back to Whop
        </Button>
      </nav>

      <div className="flex-1 overflow-auto">
        <div className="p-8 flex flex-col gap-6 m-auto max-w-7xl">
          <div className="rounded-lg w-full h-80 bg-neutral-400 animate-pulse" />
          <div className="flex gap-2 items-center">
            <h1 className="text-3xl font-bold">Welcome to</h1>
            <div className="h-10 w-48 rounded-lg bg-neutral-400 animate-pulse" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-5 w-full rounded-lg animate-pulse bg-neutral-400"></div>
            <div className="h-5 w-full rounded-lg animate-pulse bg-neutral-400"></div>
            <div className="h-5 w-full rounded-lg animate-pulse bg-neutral-400"></div>
            <div className="h-5 w-full rounded-lg animate-pulse bg-neutral-400"></div>
            <div className="h-5 w-full rounded-lg animate-pulse bg-neutral-400"></div>
            <div className="h-5 w-2/3 rounded-lg animate-pulse bg-neutral-400"></div>
          </div>
          <h3 className="text-xl font-bold">Your on-going courses</h3>
          <div className="flex flex-wrap gap-4">
            <CourseCardSkeleton />
            <CourseCardSkeleton />
          </div>
          <h3 className="text-xl font-bold">Other Courses</h3>
          <div className="flex flex-wrap gap-4">
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseCardSkeleton() {
  return (
    <div className="w-80 flex flex-col gap-2 transition rounded-lg  group cursor-pointer">
      <div className="w-full aspect-video rounded-lg animate-pulse bg-neutral-400"></div>
      <div className="h-6 w-4/5 rounded-lg animate-pulse bg-neutral-400"></div>
      <div className="h-4 w-2/3 rounded-lg animate-pulse bg-neutral-400"></div>
    </div>
  );
}
