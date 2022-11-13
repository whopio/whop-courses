"use client";

import { faBug } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center h-screen overflow-hidden">
      <div className="rounded-lg bg-red-500/25 p-8 flex items-center flex-col gap-4">
        <FontAwesomeIcon icon={faBug} className="text-red-500" size="3x" />
        <h1 className="font-bold text-3xl">Aw Snap</h1>
        <span className="text-slate-300">{error.message}</span>
        {/* <Link
          href={"/"}
          className="rounded-lg bg-red-600 hover:bg-red-500 transition-all px-4 py-2 text-center self-stretch"
        >
          <FontAwesomeIcon icon={faHome} className="mr-2" />
          Go Back Home
        </Link> */}
      </div>
    </div>
  );
}
