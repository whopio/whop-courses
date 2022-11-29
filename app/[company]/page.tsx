import { db } from "@/lib/db";
import { formattedDurationEstimate } from "@/lib/duration-estimator";
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
      status: "PUBLISHED",
    },
    include: {
      chapters: {
        include: {
          lessons: {
            include: {
              userInteractions: {
                where: {
                  userId: user.id,
                },
              },
              mainVideo: true,
            },
          },
        },
      },
    },
  });

  const isStarted = (course: typeof courses[number]) =>
    course.chapters.some((chapter) =>
      chapter.lessons.some(
        (lesson) =>
          lesson.userInteractions.length > 0 &&
          lesson.userInteractions[0].status === "COMPLETED"
      )
    );

  const isCompleted = (course: typeof courses[number]) =>
    course.chapters.every((chapter) =>
      chapter.lessons.every(
        (lesson) =>
          lesson.userInteractions.length > 0 &&
          lesson.userInteractions[0].status === "COMPLETED"
      )
    );

  const startedCourses = courses
    .filter(isStarted)
    .filter((c) => !isCompleted(c));
  const completedCourses = courses.filter(isCompleted);
  const notStartedCourses = courses.filter((c) => !isStarted(c));

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
                subtitle={formattedDurationEstimate(course)}
              />
            ))}
          </div>
        </>
      )}
      {notStartedCourses.length > 0 && (
        <>
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
                subtitle={formattedDurationEstimate(course)}
              />
            ))}
          </div>
        </>
      )}
      {completedCourses.length > 0 && (
        <>
          <h3 className="text-xl font-bold">Your Completed Courses</h3>
          <div className="flex flex-wrap gap-4">
            {completedCourses.map((course) => (
              <CourseCard
                key={course.id}
                companyId={company.route}
                courseId={course.id}
                image={course.coverImage || "/images/placeholder.png"}
                title={course.title}
                subtitle={formattedDurationEstimate(course)}
              />
            ))}
          </div>
        </>
      )}
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
