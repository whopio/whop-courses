import { API } from "@/lib/api/api";
import { companyAdminUserContext } from "@/lib/api/context-functions";
import { db } from "@/lib/db";
import z from "zod";

const CreateCourseSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
});

export type TCreateCourseData = z.infer<typeof CreateCourseSchema>;

export default API.withContext(companyAdminUserContext).postSafe(
  CreateCourseSchema,
  async (data, ctx) => {
    console.log("create post", data, ctx);
    return await db.course.create({
      data: {
        coverImage: data.image,
        description: data.description,
        title: data.title,
        companyId: ctx.company.id,
      },
    });
  }
);
