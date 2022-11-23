"use client";

import MuxPlayer from "@mux/mux-player-react";
import { FC } from "react";

export const VideoPlayer: FC<{
  playbackId: string;
  onFinishedWatching?: () => void;
}> = ({ playbackId, onFinishedWatching }) => {
  return (
    <MuxPlayer
      streamType="on-demand"
      playbackId={playbackId}
      onEnded={onFinishedWatching}
    />
  );
};
