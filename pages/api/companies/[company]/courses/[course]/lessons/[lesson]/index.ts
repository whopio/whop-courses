import { API, APIType } from "@/lib/api/api";
import {
  companyAdminUserContext,
  courseContext,
} from "@/lib/api/context-functions";
import { db } from "@/lib/db";
import invariant from "tiny-invariant";
import { z } from "zod";

const lessonContext = API.contextFunction((req) => {
  const lessonId = req.query.lesson;
  invariant(typeof lessonId === "string", "Invalid company route");
  return { lessonId };
});

const EditLessonSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    videoId: z.string().nullable(),
  })
  .partial();

const handler = API.withContext(
  companyAdminUserContext.add(courseContext).add(lessonContext)
).zpost(EditLessonSchema, async (data, ctx) => {
  return await db.lesson.update({
    where: { id: ctx.lessonId },
    data: {
      title: data.title,
      description: data.description,
      mainVideoId: data.videoId,
    },
  });
});

export type APILesson = APIType<typeof handler>;
export default handler;
