import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CompanyLoading() {
  return (
    <div className="flex h-screen items-stretch flex-nowrap">
      <div className="bg-slate-100 h-screen overflow-auto w-96 p-6 flex flex-col items-stretch gap-8 shrink-0">
        <div className="h-10 w-2/3 rounded-lg animate-pulse bg-neutral-200"></div>
        <div className="flex flex-col gap-2">
          <div className="h-5 w-1/3 rounded-lg animate-pulse bg-neutral-200"></div>
          <div className="h-2 w-full rounded-lg animate-pulse bg-neutral-200"></div>
        </div>
        <div>
          <div className="mb-6 h-7 w-full rounded-lg animate-pulse bg-neutral-200"></div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faCirclePlay}
                className="text-slate-500 my-1"
              />
              <div className="h-5 flex-1 rounded-lg animate-pulse bg-neutral-200"></div>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faCirclePlay}
                className="text-slate-500 my-1"
              />
              <div className="h-5 flex-1 rounded-lg animate-pulse bg-neutral-200"></div>
            </div>
          </div>
        </div>
        <div>
          <div className="mb-6 h-7 w-full rounded-lg animate-pulse bg-neutral-200"></div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faCirclePlay}
                className="text-slate-500 my-1"
              />
              <div className="h-5 flex-1 rounded-lg animate-pulse bg-neutral-200"></div>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faCirclePlay}
                className="text-slate-500 my-1"
              />
              <div className="h-5 flex-1 rounded-lg animate-pulse bg-neutral-200"></div>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faCirclePlay}
                className="text-slate-500 my-1"
              />
              <div className="h-5 flex-1 rounded-lg animate-pulse bg-neutral-200"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 p-8 flex flex-col gap-6 m-auto max-w-6xl h-screen">
        <div className="flex-1 flex flex-col gap-6">
          <div className="rounded-lg w-full h-80 bg-neutral-200 animate-pulse" />
          <div className="flex gap-2 items-center justify-between">
            <div className="h-10 w-48 rounded-lg bg-neutral-200 animate-pulse" />
            <div className="h-5 w-24 rounded-lg bg-neutral-200 animate-pulse" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-5 w-full rounded-lg animate-pulse bg-neutral-200"></div>
            <div className="h-5 w-full rounded-lg animate-pulse bg-neutral-200"></div>
            <div className="h-5 w-full rounded-lg animate-pulse bg-neutral-200"></div>
            <div className="h-5 w-2/3 rounded-lg animate-pulse bg-neutral-200"></div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-5 w-full rounded-lg animate-pulse bg-neutral-200"></div>
            <div className="h-5 w-full rounded-lg animate-pulse bg-neutral-200"></div>
            <div className="h-5 w-full rounded-lg animate-pulse bg-neutral-200"></div>
            <div className="h-5 w-full rounded-lg animate-pulse bg-neutral-200"></div>
            <div className="h-5 w-full rounded-lg animate-pulse bg-neutral-200"></div>
            <div className="h-5 w-1/3 rounded-lg animate-pulse bg-neutral-200"></div>
          </div>
        </div>
        <div className="bg-neutral-100 rounded-lg p-4 flex gap-3 items-center shadow-lg">
          <div className="w-48 flex flex-col gap-1">
            <div className="flex">
              <div className="h-5 w-32 rounded-lg animate-pulse bg-neutral-200"></div>
            </div>
            <div className="rounded-full h-2 bg-neutral-200 w-full">
              <div className="h-full w-0 bg-emerald-500 rounded-full"></div>
            </div>
          </div>
          <div className="flex-1 flex justify-end">
            <div className="h-5 w-48 rounded-lg animate-pulse bg-neutral-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="w-80 flex flex-col gap-2 transition rounded-lg  group cursor-pointer">
      <div className="w-full aspect-video rounded-lg animate-pulse bg-neutral-200"></div>
      <div className="h-6 w-4/5 rounded-lg animate-pulse bg-neutral-200"></div>
      <div className="h-4 w-2/3 rounded-lg animate-pulse bg-neutral-200"></div>
    </div>
  );
}
