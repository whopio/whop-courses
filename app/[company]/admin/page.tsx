import { db } from "@/lib/db";
import { getCompany } from "@/lib/server/get-company";
import { blurDataURL, PageProps } from "@/lib/util";
import { Button } from "@/ui/Button";
import { faCircleCheck, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { CreateCourseButton } from "./CreateCourseButton";

export default async function AdminHome({ params, searchParams }: PageProps) {
  const company = await getCompany(params!.company);
  const filter =
    searchParams?.filter === "published"
      ? "PUBLISHED"
      : searchParams?.filter === "draft"
      ? "DRAFT"
      : undefined;

  const courses = await db.course.findMany({
    where: {
      companyId: company.tag,
      status: filter,
    },
    include: {
      _count: {
        select: {
          chapters: true,
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-4 p-4 m-auto max-w-6xl pt-6">
      <h1 className="text-2xl font-bold">Courses</h1>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span>Filter:</span>
          <Button
            link
            variant={filter === "PUBLISHED" ? "filled" : "light"}
            href={
              filter === "PUBLISHED"
                ? `/${company.route}/admin`
                : `/${company.route}/admin?filter=published`
            }
          >
            Published
          </Button>
          <Button
            link
            variant={filter === "DRAFT" ? "filled" : "light"}
            href={
              filter === "DRAFT"
                ? `/${company.route}/admin`
                : `/${company.route}/admin?filter=draft`
            }
          >
            Draft
          </Button>
        </div>
        <CreateCourseButton
          companyId={company.tag}
          companyRoute={company.route}
        />
      </div>
      <table className="border-collapse">
        <thead>
          <tr>
            <th>Course</th>
            <th>Requirements</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr
              key={course.id}
              className="border-t-2 border-neutral-200 text-center"
            >
              <td className="py-4">
                <Link href={`/${company.route}/admin/${course.id}`}>
                  <div className="flex items-center gap-3 group">
                    <Image
                      placeholder="blur"
                      blurDataURL={blurDataURL}
                      src={course.coverImage || "/images/placeholder.png"}
                      alt="Course Cover Image"
                      width={210}
                      height={118}
                      className="aspect-video rounded-lg object-cover group-hover:scale-105 group-hover:-rotate-1 transition"
                    />
                    <div className="text-left group-hover:underline">
                      <h2 className="font-bold">{course.title}</h2>
                      <p className="text-neutral-600">
                        {course._count.chapters} Chapters
                      </p>
                    </div>
                  </div>
                </Link>
              </td>
              <td className="py-4">
                <span className="inline-block py-1 px-2 bg-neutral-200 rounded text-sm font-semibold">
                  An Access Pass
                </span>
              </td>
              {course.status === "PUBLISHED" ? (
                <td className="py-4">
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="text-emerald-500"
                  />
                  <span> Published</span>
                </td>
              ) : (
                <td className="py-4">
                  <FontAwesomeIcon icon={faClock} className="text-accent-500" />
                  <span className="text-neutral-600"> Draft</span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
