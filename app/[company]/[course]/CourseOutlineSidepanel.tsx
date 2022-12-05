"use client";

import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, ReactNode, useState } from "react";

export const CourseOutlineSidepanel: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(true);
  return (
    <>
      <div
        className={`z-20 absolute top-0 flex flex-col items-stretch gap-6 p-2 w-96 transition-all overflow-auto h-full bg-slate-100 ${
          open ? "left-0" : "-left-full"
        }`}
      >
        {children}
      </div>
      <div
        className={`relative transition-all shrink-0 ${open ? "w-96" : "w-0"}`}
      >
        <div
          className="absolute bottom-32 -right-10 w-10 h-10 flex items-center justify-center bg-slate-100 rounded-r-md"
          onClick={() => setOpen(!open)}
        >
          <FontAwesomeIcon icon={faAnglesLeft} />
        </div>
      </div>
    </>
  );
};
