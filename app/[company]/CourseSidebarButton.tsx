"use client";

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faLinesLeaning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { FC } from "react";

export const CourseSidebarButton: FC<{
  text: string;
  route: string;
  icon?: IconProp;
  companyRoute: string;
}> = ({ text, route, companyRoute, icon }) => {
  const segment = useSelectedLayoutSegment();
  const isActive = segment === route;
  return (
    <Link
      href={`/${companyRoute}/${route}`}
      className={
        "  p-4 rounded-lg flex items-center text-slate-300 transition" +
        (isActive
          ? " bg-slate-800 hover:bg-slate-700 text-white font-bold"
          : " hover:bg-slate-800")
      }
    >
      <FontAwesomeIcon icon={icon ?? faLinesLeaning} className="w-10" />
      <span>{text}</span>
    </Link>
  );
};
