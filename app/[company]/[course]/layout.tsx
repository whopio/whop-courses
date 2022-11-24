import {
  durationEstimate,
  estimateLessonDuration,
  formattedDurationEstimate,
} from "@/lib/duration-estimator";
import { getCourse } from "@/lib/server/get-course";
import { getUser } from "@/lib/server/get-user";
import { LayoutProps } from "@/lib/util";
import {
  faCircleCheck,
  faCirclePlay,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default async function Layout({ children, params }: LayoutProps) {
  const courseId = params?.course;
  const companyId = params?.company;
  const user = await getUser();
  const course = await getCourse(courseId!, user.id);

  const completedLessons = course.chapters
    .flatMap((c) => c.lessons)
    .filter((l) =>
      l.userInteractions.find(
        (i) => i.status === "COMPLETED" && i.userId === user.id
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

  return (
    <div className="flex h-screen items-stretch flex-nowrap">
      <div className="bg-slate-100 h-full overflow-auto w-96 p-2 flex flex-col items-stretch gap-6 shrink-0">
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
              <Link
                key={lesson.id}
                href={`/${companyId}/${courseId}/${lesson.id}`}
              >
                <div className="p-2 transition hover:bg-slate-200 rounded-lg cursor-pointer flex items-start text-slate-600 justify-between gap-2">
                  {lesson.userInteractions[0]?.status === "COMPLETED" ? (
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
                    <FontAwesomeIcon
                      icon={faStar}
                      className="text-amber-500 my-1"
                    />
                  )}
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
