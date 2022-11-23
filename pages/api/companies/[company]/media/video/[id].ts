import { API, APIType } from "@/lib/api/api";
import {
  companyAdminUserContext,
  routeParam,
} from "@/lib/api/context-functions";
import { db } from "@/lib/db";
import { MuxAPI } from "@/lib/mux-api";
import { WithoutNullableKeys } from "@/lib/util";
import { MuxVideo, MuxVideoStatus } from "@prisma/client";

const handler = API.withContext(companyAdminUserContext.add(routeParam("id")))
  .get((req, res, ctx) => {
    return getVideo(ctx.id);
  })
  .delete(async (req, res, ctx) => {
    const video = await getVideo(ctx.id);
    if (video.status === "WAITING") throw Error("Video is still uploading");
    MuxAPI.Video.Assets.del(video.assetId);
  });

type TMuxVideo =
  | (WithoutNullableKeys<Omit<MuxVideo, "status">> & {
      status: Extract<MuxVideoStatus, "READY">;
    })
  | (Omit<MuxVideo, "status"> & { status: Exclude<MuxVideoStatus, "READY"> });

function getVideo(id: string) {
  return db.muxVideo.findUniqueOrThrow({ where: { id } }) as Promise<TMuxVideo>;
}

export default handler;

export type APIVideo = APIType<typeof handler>;
