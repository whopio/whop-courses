import { PageProps } from "@/lib/util";

const message: Record<string, string> = {
  noCompany: "No company found",
};

import { faBug } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Error({ searchParams }: PageProps) {
  return (
    <div className="flex items-center justify-center h-screen overflow-hidden">
      <div className="rounded-lg bg-red-500/25 p-8 flex items-center flex-col gap-4">
        <FontAwesomeIcon icon={faBug} className="text-red-500" size="3x" />
        <h1 className="font-bold text-3xl">Aw Snap</h1>
        <span className="text-slate-300">
          {searchParams ? message[searchParams.type] : "Unknown Error"}
        </span>
      </div>
    </div>
  );
}
