import { API } from "@/lib/api/api";
import {
  companyContext,
  courseContext,
  userContext,
} from "@/lib/api/context-functions";
import { db } from "@/lib/db";
import z from "zod";

const EditCourseSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
  })
  .partial();

export type TEditCourseData = z.infer<typeof EditCourseSchema>;

export default API.withContext(
  userContext.add(companyContext).add(courseContext)
)
  .postSafe(EditCourseSchema, async (data, ctx) => {
    return await db.course.update({
      where: {
        id: ctx.courseId,
      },
      data: {
        coverImage: data.image,
        description: data.description,
        title: data.title,
      },
    });
  })
  .delete(async (req, res, ctx) => {
    return await db.course.delete({
      where: {
        id: ctx.courseId,
      },
    });
  });
