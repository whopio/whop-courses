import { getCompany } from "@/lib/server/get-company";
import { getCourse } from "@/lib/server/get-course";
import { getUser } from "@/lib/server/get-user";
import { PageProps } from "@/lib/util";
import { Button } from "@/ui/Button";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { CourseEditPage } from "./CourseEditPage";

export default async function AdminCourseIndexPage({ params }: PageProps) {
  console.time("admin.course.page");
  const courseId = params?.course;
  const companyId = params?.company;
  const company = await getCompany(companyId!);
  const user = await getUser();
  const course = await getCourse(courseId!, user.id);
  console.timeEnd("admin.course.page");
  return (
    <div className="p-8 flex flex-col gap-6 h-screen">
      <div className="flex">
        <Button link href={`/${companyId}/admin`} iconLeft={faArrowLeft}>
          Back to Courses
        </Button>
      </div>
      <CourseEditPage
        companyId={company.tag}
        companyRoute={company.route}
        courseId={course.id}
        course={course}
      />
    </div>
  );
}
