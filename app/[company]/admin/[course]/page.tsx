import { getCompany } from "@/lib/server/get-company";
import { getCourse } from "@/lib/server/get-course";
import { getUser } from "@/lib/server/get-user";
import { PageProps } from "@/lib/util";
import { Button } from "@/ui/Button";
import {
  faArrowLeft,
  faArrowUpRightFromSquare,
  faSave,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { CourseEditForm } from "./CourseEditForm";

export default async function CourseIndexPage({ params }: PageProps) {
  const courseId = params?.course;
  const companyId = params?.company;
  const company = await getCompany(companyId!);
  const user = await getUser();
  const course = await getCourse(courseId!, user.id);
  return (
    <div className="p-8 flex flex-col gap-6 h-screen">
      <div className="flex">
        <Button link href={`/${companyId}/admin`} iconLeft={faArrowLeft}>
          Back to Courses
        </Button>
      </div>
      <div className="flex items-stretch flex-1">
        <div className="flex-1 border-r-2 border-neutral-200 overflow-auto shrink-0 flex flex-col pr-4 gap-4">
          <h1 className="font-bold text-2xl">Course Details</h1>
          <p>
            This information will be displayed to users who view this course.
          </p>
          <CourseEditForm companyId={company.tag} />
        </div>
        <div className="flex-1 overflow-auto shrink-0 pl-4"></div>
      </div>
      <div className="bg-neutral-100 rounded-lg p-4 flex gap-3 items-center shadow-lg">
        <Button color="danger" iconLeft={faTrashCan}>
          Delete
        </Button>
        <div className="flex-1"></div>
        <Button iconLeft={faArrowUpRightFromSquare}>Preview</Button>
        <Button variant="filled" color="success" iconLeft={faSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
