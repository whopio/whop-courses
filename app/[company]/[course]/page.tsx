import {
  durationEstimate,
  estimateLessonDuration,
  formattedDurationEstimate,
} from "@/lib/duration-estimator";
import { getCourse } from "@/lib/server/get-course";
import { getUserSession } from "@/lib/server/get-user";
import { blurDataURL, PageProps } from "@/lib/util";
import { Button } from "@/ui/Button";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

export default async function CourseIndexPage({ params }: PageProps) {
  console.time("course.page");
  const courseId = params?.course;
  const companyId = params?.company;
  const user = await getUserSession();
  const course = await getCourse(courseId!, user.userId);
  const firstLesson = course.chapters[0].lessons[0];
  const uncompletedLessons = course.chapters
    .flatMap((c) => c.lessons)
    .filter(
      (l) =>
        !l.userInteractions.find(
          (i) => i.userId === user.userId && i.status === "COMPLETED"
        )
    );
  const nextLesson =
    uncompletedLessons.length === 0 ? firstLesson : uncompletedLessons[0];

  const isBeginCourse = firstLesson?.id === nextLesson?.id;

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
  console.timeEnd("course.page");

  return (
    <div className="p-8 flex flex-col gap-6 h-screen m-auto max-w-6xl">
      <div className="flex flex-col gap-6 flex-1 overflow-auto">
        <Image
          placeholder="blur"
          blurDataURL={blurDataURL}
          className="rounded-lg w-full max-h-80 object-cover"
          src={course.coverImage || "/images/placeholder.png"}
          alt="Course Header Image"
          width={1280}
          height={384}
        />
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-3xl">{course.title}</h1>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faClock} className="text-neutral-500" />
            <span className="ml-2 text-neutral-500">
              {formattedDurationEstimate(course)}
            </span>
          </div>
        </div>
        <div className="text-neutral-800 flex-1 whitespace-pre-line">
          {course.description}
        </div>
      </div>
      <div className="bg-neutral-100 rounded-lg p-4 flex gap-3 items-center shadow-lg">
        <div className="w-48 flex flex-col gap-1">
          <span className="font-bold text">
            {percentageComplete}% Completed
          </span>
          <div className="rounded-full h-2 bg-neutral-300 w-full">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${percentageComplete}%` }}
            ></div>
          </div>
        </div>
        <div className="flex-1 text-right">
          <span className="font-semibold">
            <span className="text-neutral-600">
              Estimated course duration: {formattedDurationEstimate(course)}
            </span>
          </span>
        </div>
        <Button
          variant="filled"
          color="accent"
          link
          href={`/${companyId}/${course.id}/${nextLesson.id}`}
        >
          {isBeginCourse ? "Begin Course" : "Continue Course"}
        </Button>
      </div>
    </div>
  );
}
