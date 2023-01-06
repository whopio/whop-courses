import { getCompany } from "@/lib/server/get-company";
import { getCourse } from "@/lib/server/get-course";
import { getUserSession } from "@/lib/server/get-user";
import { PageProps } from "@/lib/util";
import { Button } from "@/ui/Button";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { LessonEditPage } from "./LessonEditPage";

export default async function LessonIndexPage({ params }: PageProps) {
  console.time("admin.lesson.page");
  const courseId = params?.course;
  const companyId = params?.company;
  const lessonId = params?.lesson;
  const user = await getUserSession();
  const company = await getCompany(companyId!);
  const course = await getCourse(courseId!, user.userId, user.whopToken, false);
  const lesson = course.chapters
    .flatMap((chapter) => chapter.lessons)
    .find((lesson) => lesson.id === lessonId);

  if (!lesson) throw Error("404 - Lesson not found");
  console.timeEnd("admin.lesson.page");

  return (
    <div className="p-8 flex flex-col gap-6 h-screen">
      <div className="flex">
        <Button
          link
          href={`/${companyId}/admin/${courseId}`}
          iconLeft={faArrowLeft}
        >
          Back to Course Details
        </Button>
      </div>
      <LessonEditPage
        companyId={company.tag}
        companyRoute={company.route}
        courseId={course.id}
        lessonId={lesson.id}
        lesson={lesson}
      />
    </div>
  );
}
