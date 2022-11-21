import { API, APIType } from "@/lib/api/api";
import {
  companyAdminUserContext,
  courseContext,
} from "@/lib/api/context-functions";
import { db } from "@/lib/db";

const handler = API.withContext(
  companyAdminUserContext.add(courseContext)
).post(async (req, res, ctx) => {
  const numChapters = await db.chapter.count({
    where: {
      courseId: ctx.courseId,
    },
  });
  const chapter = await db.chapter.create({
    data: {
      description: "",
      title: "",
      order: numChapters,
      status: "VISIBLE",
      courseId: ctx.courseId,
    },
  });
  return chapter;
});

export default handler;

export type APIChapter = APIType<typeof handler>;
