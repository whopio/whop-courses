"use client";

import MuxPlayer from "@mux/mux-player-react";
import { FC } from "react";

export const VideoPlayer: FC<{ src?: string }> = ({ src }) => {
  return (
    <MuxPlayer
      streamType="on-demand"
      playbackId="EcHgOK9coz5K4rjSwOkoE7Y7O01201YMIC200RI6lNxnhs"
      metadata={{
        video_id: "video-id-54321",
        video_title: "Test video title",
        viewer_user_id: "user-id-007",
      }}
    />
  );
};
