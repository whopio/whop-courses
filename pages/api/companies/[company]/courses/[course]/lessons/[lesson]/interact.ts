import { API, APIType } from "@/lib/api/api";
import {
  courseContext,
  routeParam,
  sessionContext,
} from "@/lib/api/context-functions";
import { db } from "@/lib/db";
import { z } from "zod";

const handler = API.withContext(
  sessionContext.add(courseContext).add(routeParam("lesson"))
).zpost(
  z
    .object({
      completed: z.boolean(),
      liked: z.boolean(),
    })
    .partial(),
  async (data, ctx) => {
    return await db.userLessonInteraction.upsert({
      where: {
        userId_lessonId: {
          userId: ctx.session.userId,
          lessonId: ctx.lesson,
        },
      },
      create: {
        userId: ctx.session.userId,
        lessonId: ctx.lesson,
        status: data.completed ? "COMPLETED" : "NOT_STARTED",
        liked: data.liked || false,
      },
      update: {
        status:
          data.completed === undefined
            ? undefined
            : data.completed
            ? "COMPLETED"
            : "NOT_STARTED",
        liked: data.liked,
      },
    });
  }
);

export type APIInteract = APIType<typeof handler>;
export default handler;
