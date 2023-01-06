import { cache } from "react";
import { hasAccess } from "../api/whop-api";
import { db } from "../db";

export const getCourse = cache(
  async (
    courseId: string,
    userId: string,
    whopToken: string,
    accessCheck: boolean
  ) => {
    console.time(`getCourse(${courseId}, ${userId})`);
    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        chapters: {
          orderBy: {
            order: "asc",
          },
          include: {
            lessons: {
              orderBy: {
                order: "asc",
              },
              include: {
                userInteractions: {
                  where: {
                    userId,
                  },
                },
                mainVideo: true,
              },
            },
          },
        },
      },
    });

    if (!course) throw Error("404 - Failed to find course. ");

    if (accessCheck) {
      if (!course.experienceId)
        throw Error("403 - Cannot access course (Not published");
      const hasAccessToCourse = await hasAccess(whopToken, course.experienceId);
      if (!hasAccessToCourse)
        throw Error(
          "403 - Cannot access course (Please purchase an access pass)"
        );
    }

    console.timeEnd(`getCourse(${courseId}, ${userId})`);
    return course;
  }
);

export async function filterCoursesByAccess<
  T extends { experienceId: string | null }
>(courses: T[], whopToken: string, isAdmin: boolean) {
  if (isAdmin) return courses;
  return (
    await Promise.all(
      courses.map(async (c) => {
        const hasAccessToCourse = c.experienceId
          ? await hasAccess(whopToken, c.experienceId)
          : false;
        return {
          access: hasAccessToCourse,
          c,
        };
      })
    )
  )
    .filter((a) => a.access)
    .map((a) => a.c);
}

export type TGetCourse = Awaited<ReturnType<typeof getCourse>>;
