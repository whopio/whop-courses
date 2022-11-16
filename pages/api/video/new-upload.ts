import { API } from "@/lib/api/api";
import Mux from "@mux/mux-node";
const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
);

export default API.noContext().post(async (req, res, ctx) => {
  await Video.Uploads.create({
    cors_origin: "http://localhost:4300",
    new_asset_settings: {
      playback_policy: "public",
    },
  });
});
