import { API, APIType } from "@/lib/api/api";
import { companyAdminUserContext } from "@/lib/api/context-functions";
import { createExperience } from "@/lib/api/whop-api";
import { db } from "@/lib/db";

const introLessons: { title: string; description?: string }[][] = [
  [
    { title: "Things to prepare before you begin" },
    { title: "All ready? Let’s go!" },
  ],
  [{ title: "Lesson 1" }, { title: "Lesson 2" }, { title: "Lesson 3" }],
];

const handler = API.withContext(companyAdminUserContext).post(
  async (req, res, ctx) => {
    const experience = await createExperience(
      ctx.company.id,
      "New Course",
      undefined
    );
    const course = await db.course.create({
      data: {
        coverImage: null,
        description: "",
        title: "",
        companyId: ctx.company.id,
        experienceId: experience.id,
        chapters: {
          createMany: {
            data: [
              {
                title: "Intro",
                description: "",
                order: 0,
                status: "VISIBLE",
              },
              {
                title: "Chapter 1",
                description: "",
                order: 1,
                status: "VISIBLE",
              },
            ],
          },
        },
      },
      include: {
        chapters: true,
      },
    });

    await Promise.all(
      course.chapters.map(async (c) => {
        return db.lesson.createMany({
          data:
            introLessons[c.order]?.map((l, i) => ({
              chapterId: c.id,
              title: l.title,
              description: l.description || "",
              files: "",
              images: "",
              order: i,
            })) || [],
        });
      })
    );

    return course;
  }
);

export default handler;
export type APICourses = APIType<typeof handler>;
