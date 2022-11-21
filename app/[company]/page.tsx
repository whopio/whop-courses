import { db } from "@/lib/db";
import { getCompany } from "@/lib/server/get-company";
import { getUser } from "@/lib/server/get-user";
import { blurDataURL, PageProps } from "@/lib/util";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

export default async function CompanyPage({ params }: PageProps) {
  const company = await getCompany(params!.company);
  const user = await getUser();
  const courses = await db.course.findMany({
    where: {
      companyId: company.tag,
    },
    include: {
      chapters: {
        include: {
          lessons: {
            where: {
              userInteractions: {
                some: {
                  status: "COMPLETED",
                  userId: user.id,
                },
              },
            },
          },
        },
      },
    },
  });

  const startedCourses = courses.filter((course) =>
    course.chapters.some((chapter) => chapter.lessons.length > 0)
  );
  const notStartedCourses = courses.filter(
    (course) => !course.chapters.some((chapter) => chapter.lessons.length > 0)
  );

  return (
    <div className="p-8 flex flex-col gap-6 m-auto max-w-7xl">
      <Image
        placeholder="blur"
        blurDataURL={blurDataURL}
        className="rounded-lg w-full max-h-80 object-cover"
        src={company.header_image_url}
        alt="Company Header Image"
        width={1280}
        height={384}
      />
      <h1 className="text-3xl font-bold">Welcome to {company.title}</h1>
      <p className="text-neutral-800">
        {company.description || company.shortened_description}
      </p>
      {startedCourses.length > 0 && (
        <>
          <h3 className="text-xl font-bold">Your on-going courses</h3>
          <div className="flex flex-wrap gap-4">
            {startedCourses.map((course) => (
              <CourseCard
                key={course.id}
                companyId={company.route}
                courseId={course.id}
                image={course.coverImage || "/images/placeholder.png"}
                title={course.title}
                subtitle={"Todo, workout text"}
              />
            ))}
          </div>
        </>
      )}
      <h3 className="text-xl font-bold">
        {startedCourses.length > 0 ? "Other Courses" : "Courses"}
      </h3>
      <div className="flex flex-wrap gap-4">
        {notStartedCourses.map((course) => (
          <CourseCard
            key={course.id}
            companyId={company.route}
            courseId={course.id}
            image={course.coverImage || "/images/placeholder.png"}
            title={course.title}
            subtitle={"xxx Minutes"}
          />
        ))}
      </div>
    </div>
  );
}

const CourseCard: FC<{
  image: string;
  title: string;
  subtitle: string;
  courseId: string;
  companyId: string;
}> = ({ image, title, subtitle, companyId, courseId }) => {
  return (
    <Link href={`/${companyId}/${courseId}`}>
      <div className="w-80 flex flex-col gap-2 transition rounded-lg  group cursor-pointer">
        <Image
          placeholder="blur"
          blurDataURL={blurDataURL}
          width={320}
          height={180}
          src={image}
          alt="Course Image"
          className="rounded-lg aspect-video object-cover group-hover:shadow-xl group-hover:scale-105 group-hover:-rotate-1 transition"
        />
        <h4 className="font-bold text-lg  group-hover:underline">{title}</h4>
        <span className="text-neutral-600 overflow-hidden text-ellipsis group-hover:underline">
          {subtitle}
        </span>
      </div>
    </Link>
  );
};
