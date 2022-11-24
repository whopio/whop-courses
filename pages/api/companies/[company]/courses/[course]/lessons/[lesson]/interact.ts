import { API, APIType } from "@/lib/api/api";
import {
  courseContext,
  routeParam,
  userContext,
} from "@/lib/api/context-functions";
import { db } from "@/lib/db";
import { z } from "zod";

const handler = API.withContext(
  userContext.add(courseContext).add(routeParam("lesson"))
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
          userId: ctx.user.id,
          lessonId: ctx.lesson,
        },
      },
      create: {
        userId: ctx.user.id,
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
