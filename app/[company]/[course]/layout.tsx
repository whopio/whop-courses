import {
  durationEstimate,
  estimateLessonDuration,
  formattedDurationEstimate,
} from "@/lib/duration-estimator";
import { getCourse } from "@/lib/server/get-course";
import { getUserSession } from "@/lib/server/get-user";
import { LayoutProps } from "@/lib/util";
import Link from "next/link";
import { CourseOutlineSidepanel } from "./CourseOutlineSidepanel";
import { LessonSidebarButton } from "./LessonSidebarButton";

export default async function Layout({ children, params }: LayoutProps) {
  console.time("course.layout");
  const courseId = params!.course;
  const companyId = params!.company;
  const user = await getUserSession();
  const course = await getCourse(courseId!, user.userId, user.whopToken, true);

  const completedLessons = course.chapters
    .flatMap((c) => c.lessons)
    .filter((l) =>
      l.userInteractions.find(
        (i) => i.status === "COMPLETED" && i.userId === user.userId
      )
    );
  const completedDuration = completedLessons.reduce(
    (duration, l) => duration + estimateLessonDuration(l),
    0
  );
  const totalDuration = durationEstimate(course);
  const percentageComplete = Math.round(
    (completedDuration / totalDuration) * 100
  );

  console.timeEnd("course.layout");
  return (
    <div className="relative flex h-screen items-stretch flex-nowrap">
      <CourseOutlineSidepanel>
        <Link href={`/${companyId}/${courseId}`}>
          <h1 className="font-bold text-2xl m-2 hover:underline">
            {course.title}
          </h1>
        </Link>
        <div className="px-2">
          <span>{percentageComplete}% total completion</span>
          <div className="mt-2 h-2 bg-neutral-200 rounded-full">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${percentageComplete}%` }}
            ></div>
          </div>
        </div>
        {course.chapters.map((chapter) => (
          <div key={chapter.id} className="flex flex-col gap-1">
            <div className="flex items-center justify-between p-2">
              <span className="font-semibold text-lg">{chapter.title}</span>
              <span className="text-slate-500">
                {formattedDurationEstimate(chapter)}
              </span>
            </div>
            {chapter.lessons.map((lesson) => (
              <LessonSidebarButton
                key={lesson.id}
                courseId={courseId}
                companyId={companyId}
                lesson={lesson}
              />
            ))}
          </div>
        ))}
      </CourseOutlineSidepanel>
      <div className="flex-1">{children}</div>
    </div>
  );
}
