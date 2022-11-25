"use client";

import { TGetCourse } from "@/lib/server/get-course";
import {
  faCircleCheck,
  faCirclePlay,
  faSpinner,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

export const LessonSidebarButton: FC<{
  companyId: string;
  courseId: string;
  lesson: TGetCourse["chapters"][number]["lessons"][number];
}> = ({ companyId, courseId, lesson }) => {
  const pathname = usePathname();
  const parts = pathname?.split("/") || [];
  const isActive = parts[3] === lesson.id;
  return (
    <Link href={`/${companyId}/${courseId}/${lesson.id}`}>
      <div
        className={`p-2 transition rounded-lg cursor-pointer flex items-start justify-between gap-2 ${
          isActive
            ? "text-black bg-neutral-200 hover:bg-slate-300 font-bold"
            : "hover:bg-slate-200 text-slate-600 "
        }`}
      >
        {isActive ? (
          <FontAwesomeIcon icon={faSpinner} className="text-black my-1" />
        ) : lesson.userInteractions[0]?.status === "COMPLETED" ? (
          <FontAwesomeIcon
            icon={faCircleCheck}
            className="text-emerald-500 my-1"
          />
        ) : (
          <FontAwesomeIcon
            icon={faCirclePlay}
            className="text-slate-500 my-1"
          />
        )}
        <span className="flex-1">{lesson.title}</span>
        {lesson.userInteractions[0]?.liked && (
          <FontAwesomeIcon icon={faStar} className="text-amber-500 my-1" />
        )}
      </div>
    </Link>
  );
};
