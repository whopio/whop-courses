import { cache } from "react";
import { db } from "../db";

export const getCourse = cache(async (courseId: string, userId: string) => {
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
  console.timeEnd(`getCourse(${courseId}, ${userId})`);
  return course;
});

export type TGetCourse = Awaited<ReturnType<typeof getCourse>>;
