import { API, APIType } from "@/lib/api/api";
import {
  companyAdminUserContext,
  courseContext,
  routeParam,
} from "@/lib/api/context-functions";
import { db } from "@/lib/db";
import { z } from "zod";

const EditLessonSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    videoId: z.string().nullable(),
  })
  .partial();

const handler = API.withContext(
  companyAdminUserContext.add(courseContext).add(routeParam("lesson"))
).zpost(EditLessonSchema, async (data, ctx) => {
  return await db.lesson.update({
    where: { id: ctx.lesson },
    data: {
      title: data.title,
      description: data.description,
      mainVideoId: data.videoId,
    },
  });
});

export type APILesson = APIType<typeof handler>;
export default handler;
