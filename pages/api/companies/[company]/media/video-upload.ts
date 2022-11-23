import { API, APIType } from "@/lib/api/api";
import { companyAdminUserContext } from "@/lib/api/context-functions";
import { db } from "@/lib/db";
import { MuxAPI } from "@/lib/mux-api";

const handler = API.withContext(companyAdminUserContext).get(
  async (req, res, ctx) => {
    const dbVid = await db.muxVideo.create({
      data: {
        status: "WAITING",
      },
    });

    const vid = await MuxAPI.Video.Uploads.create({
      cors_origin: "http://localhost:4300",
      new_asset_settings: {
        playback_policy: "public",
        passthrough: dbVid.id,
      },
    });

    return { dbId: dbVid.id, uploadUrl: vid.url };
  }
);

export default handler;
export type APIVideoUpload = APIType<typeof handler>;
