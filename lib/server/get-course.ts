import { cache } from "react";
import { db } from "../db";

export const getCourse = cache(async (courseId: string, userId: string) => {
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
            },
          },
        },
      },
    },
  });

  if (!course) throw Error("404 - Failed to find course. ");
  return course;
});
