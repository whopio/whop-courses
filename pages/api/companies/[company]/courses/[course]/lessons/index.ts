import { API, APIType } from "@/lib/api/api";
import {
  companyAdminUserContext,
  courseContext,
} from "@/lib/api/context-functions";
import { db } from "@/lib/db";
import { z } from "zod";

const CreateLessonSchema = z.object({
  chapterId: z.string(),
});

const handler = API.withContext(
  companyAdminUserContext.add(courseContext)
).zpost(CreateLessonSchema, async (data, ctx) => {
  const numLessons = await db.lesson.count({
    where: { chapterId: data.chapterId },
  });
  const lesson = await db.lesson.create({
    data: {
      order: numLessons,
      title: "",
      chapterId: data.chapterId,
      files: "",
      images: "",
    },
  });
  return lesson;
});

export type APILessons = APIType<typeof handler>;
export default handler;
