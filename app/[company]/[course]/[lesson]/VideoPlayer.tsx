"use client";

import { apiPost } from "@/lib/api/api-request";
import MuxPlayer from "@mux/mux-player-react";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { APIInteract } from "../../../../pages/api/companies/[company]/courses/[course]/lessons/[lesson]/interact";

export const VideoPlayer: FC<
  {
    playbackId: string;
  } & (
    | {
        lessonId: string;
        companyId: string;
        courseId: string;
        completeOnFinish: true;
      }
    | { completeOnFinish: false }
  )
> = ({ playbackId, ...props }) => {
  const router = useRouter();

  async function complete() {
    if (props.completeOnFinish) {
      await apiPost<APIInteract>(
        `/companies/${props.companyId}/courses/${props.courseId}/lessons/${props.lessonId}/interact`,
        {
          completed: true,
        }
      );
      router.refresh();
    }
  }

  return (
    <MuxPlayer
      streamType="on-demand"
      playbackId={playbackId}
      onEnded={complete}
    />
  );
};
