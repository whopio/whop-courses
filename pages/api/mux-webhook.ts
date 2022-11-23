import { API } from "@/lib/api/api";
import { db } from "@/lib/db";
import Mux from "@mux/mux-node";
import getRawBody from "raw-body";
import invariant from "tiny-invariant";

const muxWebhookContext = API.contextFunction(async (req, res, ctx) => {
  const secret = process.env.MUX_WEBHOOK_SIGNING_SECRET!;
  const header = req.headers["mux-signature"];
  const body = (await getRawBody(req)).toString("utf-8");

  console.log("MUX WEBHOOK", header, body);
  invariant(typeof header === "string", "Invalid mux signature header");
  invariant(typeof body === "string", "Invalid body - must be json string");
  const isValid = Mux.Webhooks.verifyHeader(body, header, secret);
  invariant(isValid, "Invalid mux signature");
  const muxData = JSON.parse(body);
  return { muxData };
});

export default API.withContext(muxWebhookContext).post(
  async (req, res, ctx) => {
    const { type, data } = ctx.muxData;
    switch (type) {
      case "video.asset.ready": {
        const { aspect_ratio, duration, id, passthrough, playback_ids } = data;

        const dbVid = await db.muxVideo.update({
          where: { id: passthrough },
          data: {
            playbackId: playback_ids[0].id,
            status: "READY",
            aspectRatio: aspect_ratio,
            duration: Number(duration),
            assetId: id,
          },
        });
        console.log("Mux Video Ready", dbVid);
        break;
      }
      case "video.asset.deleted": {
        const { passthrough } = data;
        await db.muxVideo.delete({
          where: { id: passthrough },
        });
        console.log("Deleted mux video", passthrough);
        break;
      }
      default:
        console.log("Unhandled Mux Webhook", type, data);
        break;
    }
  }
);

export const config = {
  api: {
    bodyParser: false,
  },
};
