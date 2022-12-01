"use client";

import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, ReactNode, useState } from "react";

export const Sidepanel: FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(true);
  return (
    <>
      <div
        className={` z-30 absolute top-0 flex flex-col items-stretch gap-8 p-4 w-80 transition-all overflow-auto h-full bg-neutral-900 ${
          open ? "left-0" : "-left-full"
        }`}
      >
        {children}
      </div>
      <div
        className={`relative transition-all shrink-0 ${open ? "w-80" : "w-0"}`}
      >
        <div
          className="absolute z-30 bottom-16 -right-10 w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-r-md"
          onClick={() => setOpen(!open)}
        >
          <FontAwesomeIcon icon={faAnglesLeft} />
        </div>
      </div>
    </>
  );
};
