import { Button } from "@/ui/Button";

export default function CompanyLoading() {
  return (
    <div className="p-8 flex flex-col gap-6 m-auto max-w-6xl h-screen">
      <div className="flex-1 flex flex-col gap-6">
        <div className="rounded-lg w-full h-80 bg-neutral-400 animate-pulse" />
        <div className="flex gap-2 items-center justify-between">
          <div className="h-10 w-48 rounded-lg bg-neutral-400 animate-pulse" />
          <div className="h-5 w-24 rounded-lg bg-neutral-400 animate-pulse" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-5 w-full rounded-lg animate-pulse bg-neutral-400"></div>
          <div className="h-5 w-full rounded-lg animate-pulse bg-neutral-400"></div>
          <div className="h-5 w-full rounded-lg animate-pulse bg-neutral-400"></div>
          <div className="h-5 w-2/3 rounded-lg animate-pulse bg-neutral-400"></div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-5 w-full rounded-lg animate-pulse bg-neutral-400"></div>
          <div className="h-5 w-full rounded-lg animate-pulse bg-neutral-400"></div>
          <div className="h-5 w-full rounded-lg animate-pulse bg-neutral-400"></div>
          <div className="h-5 w-full rounded-lg animate-pulse bg-neutral-400"></div>
          <div className="h-5 w-full rounded-lg animate-pulse bg-neutral-400"></div>
          <div className="h-5 w-1/3 rounded-lg animate-pulse bg-neutral-400"></div>
        </div>
      </div>
      <div className="bg-neutral-100 rounded-lg p-4 flex gap-3 items-center shadow-lg">
        <div className="w-48 flex flex-col gap-1">
          <div className="flex">
            <div className="h-5 w-32 rounded-lg animate-pulse bg-neutral-400"></div>
          </div>
          <div className="rounded-full h-2 bg-neutral-400 w-full">
            <div className="h-full w-0 bg-emerald-500 rounded-full"></div>
          </div>
        </div>
        <div className="flex-1 flex justify-end">
          <div className="h-5 w-48 rounded-lg animate-pulse bg-neutral-400"></div>
        </div>
        <Button variant="filled" color="accent">
          Begin Course
        </Button>
      </div>
    </div>
  );
}
