import { API, APIType } from "@/lib/api/api";
import { companyAdminUserContext } from "@/lib/api/context-functions";
import { db } from "@/lib/db";

const handler = API.withContext(companyAdminUserContext).post(
  async (req, res, ctx) => {
    return await db.course.create({
      data: {
        coverImage: null,
        description: "",
        title: "",
        companyId: ctx.company.id,
      },
    });
  }
);

export default handler;
export type APICourses = APIType<typeof handler>;
