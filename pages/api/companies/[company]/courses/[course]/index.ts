import { API, APIType } from "@/lib/api/api";
import {
  companyAdminUserContext,
  courseContext,
} from "@/lib/api/context-functions";
import { db } from "@/lib/db";
import { MuxAPI } from "@/lib/mux-api";
import { notEmpty } from "@/lib/util";
import { Chapter, Lesson } from "@prisma/client";
import z from "zod";

const EditCourseSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    image: z.string().nullable(),
    visibility: z.enum(["DRAFT", "PUBLISHED"]),
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
    const course = await db.course.delete({
      where: {
        id: ctx.courseId,
      },
      include: {
        chapters: {
          include: {
            lessons: {
              where: {
                mainVideoId: {
                  not: null,
                },
              },
              include: {
                mainVideo: true,
              },
            },
          },
        },
      },
    });
    const videosToDelete = course.chapters
      .flatMap((c) => c.lessons)
      .map((l) => l.mainVideo?.assetId)
      .filter((v) => notEmpty(v));

    for (const assetId in videosToDelete) {
      await MuxAPI.Video.Assets.del(assetId);
    }

    return {
      ...course,
      chapters: undefined,
    };
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
        status: data.visibility,
      },
    });

    const { structure } = data;
    if (structure) {
      const chapters = await db.chapter.findMany({
        where: { courseId: ctx.courseId },
      });
      const lessons = await db.lesson.findMany({
        where: { chapter: { courseId: ctx.courseId } },
        include: { mainVideo: true },
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

      for (const lesson of lessonsToDelete) {
        if (lesson.mainVideo && lesson.mainVideo.assetId) {
          await MuxAPI.Video.Assets.del(lesson.mainVideo.assetId);
        }
      }

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
