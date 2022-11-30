export default function CompanyLoading() {
  return (
    <div className="p-8 flex flex-col gap-6 m-auto max-w-7xl">
      <div className="rounded-lg w-full h-80 bg-neutral-200 animate-pulse" />
      <div className="flex gap-2 items-center">
        <h1 className="text-3xl font-bold">Welcome to</h1>
        <div className="h-10 w-48 rounded-lg bg-neutral-200 animate-pulse" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="h-5 w-full rounded-lg animate-pulse bg-neutral-200"></div>
        <div className="h-5 w-full rounded-lg animate-pulse bg-neutral-200"></div>
        <div className="h-5 w-full rounded-lg animate-pulse bg-neutral-200"></div>
        <div className="h-5 w-full rounded-lg animate-pulse bg-neutral-200"></div>
        <div className="h-5 w-2/3 rounded-lg animate-pulse bg-neutral-200"></div>
      </div>
      <h3 className="text-xl font-bold">Other Courses</h3>
      <div className="flex flex-wrap gap-4">
        <CourseCardSkeleton />
        <CourseCardSkeleton />
        <CourseCardSkeleton />
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
