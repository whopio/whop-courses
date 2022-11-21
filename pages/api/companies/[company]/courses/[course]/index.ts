import { API, APIType } from "@/lib/api/api";
import {
  companyAdminUserContext,
  courseContext,
} from "@/lib/api/context-functions";
import { db } from "@/lib/db";
import { Chapter, Lesson } from "@prisma/client";
import z from "zod";

const EditCourseSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    image: z.string().nullable(),
    structure: z
      .object({
        id: z.string(),
        title: z.string(),
        lessons: z
          .object({
            id: z.string(),
            title: z.string(),
          })
          .array(),
      })
      .array(),
  })
  .partial();

export type TEditCourseData = z.infer<typeof EditCourseSchema>;

const handler = API.withContext(companyAdminUserContext.add(courseContext))
  .delete(async (req, res, ctx) => {
    return await db.course.delete({
      where: {
        id: ctx.courseId,
      },
    });
  })
  .zpost(EditCourseSchema, async (data, ctx) => {
    const course = await db.course.update({
      where: {
        id: ctx.courseId,
      },
      data: {
        coverImage: data.image,
        description: data.description,
        title: data.title,
      },
    });

    const { structure } = data;
    if (structure) {
      const chapters = await db.chapter.findMany({
        where: { courseId: ctx.courseId },
      });
      const lessons = await db.lesson.findMany({
        where: { chapter: { courseId: ctx.courseId } },
      });

      const chapterMap = new Map<string, Chapter>();
      for (const chapter of chapters) {
        chapterMap.set(chapter.id, chapter);
      }
      const lessonMap = new Map<string, Lesson>();
      for (const lesson of lessons) {
        lessonMap.set(lesson.id, lesson);
      }

      // Delete Removed Chapters and lessons
      const chapterIds = new Set(structure.map((c) => c.id));
      const lessonIds = new Set(
        structure.flatMap((c) => c.lessons.map((l) => l.id))
      );

      const chaptersToDelete = chapters.filter((c) => !chapterIds.has(c.id));
      const lessonsToDelete = lessons.filter((l) => !lessonIds.has(l.id));

      await db.chapter.deleteMany({
        where: {
          id: {
            in: chaptersToDelete.map((c) => c.id),
          },
        },
      });
      await db.lesson.deleteMany({
        where: {
          id: {
            in: lessonsToDelete.map((l) => l.id),
          },
        },
      });

      for (let i = 0; i < structure.length; i++) {
        const chapter = structure[i];
        const dbChapter = chapterMap.get(chapter.id);
        if (!dbChapter) continue;
        if (chapter.title !== dbChapter.title || dbChapter.order !== i) {
          await db.chapter.update({
            where: {
              id: chapter.id,
            },
            data: {
              title: chapter.title,
              order: i,
            },
          });
        }
        for (let j = 0; j < chapter.lessons.length; j++) {
          const lesson = chapter.lessons[j];
          const dbLesson = lessonMap.get(lesson.id);
          if (!dbLesson) continue;
          if (dbLesson.order !== j || dbLesson.chapterId !== chapter.id) {
            await db.lesson.update({
              where: {
                id: lesson.id,
              },
              data: {
                order: j,
                chapterId: chapter.id,
              },
            });
          }
        }
      }
    }

    return course;
  });

export default handler;
export type APICourse = APIType<typeof handler>;
