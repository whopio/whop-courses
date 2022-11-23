"use client";

import { apiDelete, apiGet } from "@/lib/api/api-request";
import { sleep } from "@/lib/util";
import * as UpChunk from "@mux/upchunk";
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { APIVideoUpload } from "../pages/api/companies/[company]/media/video-upload";
import { APIVideo } from "../pages/api/companies/[company]/media/video/[id]";
import { Dropzone } from "./Dropzone";

const getUploadUrl = async (companyId: string) => {
  return apiGet<APIVideoUpload>(`/companies/${companyId}/media/video-upload`);
};

const getVideo = (companyId: string, videoId: string) => {
  return apiGet<APIVideo>(`/companies/${companyId}/media/video/${videoId}`);
};

const deleteVideo = (companyId: string, videoId: string) => {
  return apiDelete<APIVideo>(`/companies/${companyId}/media/video/${videoId}`);
};

const pollTillVideoReady = async (companyId: string, videoId: string) => {
  while (true) {
    const video = await getVideo(companyId, videoId);
    if (video.status === "READY") return video;
    await sleep(1000);
  }
};

type TVideoData = Awaited<ReturnType<typeof pollTillVideoReady>>;
const videoDataCache = new Map<string, Promise<TVideoData>>();
export async function getVideoPromise(
  companyId: string,
  videoId: string | null
) {
  if (!videoId) return;
  const key = `${companyId}:${videoId}`;
  if (videoDataCache.has(key)) return videoDataCache.get(key);
  const promise = pollTillVideoReady(companyId, videoId);
  videoDataCache.set(key, promise);
  return promise;
}

export function usePromise<T>(promise: Promise<T>) {
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    promise
      .then(setValue)
      .catch((e) => setError((e as Error).message || (e as string)));
  }, [promise]);

  return [value, error] as const;
}

export const VideoDropzone: FC<{
  companyId: string;
  videoId: string | null;
  setVideoId: Dispatch<SetStateAction<string | null>>;
}> = ({ companyId, setVideoId, videoId }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const [videoData, videoDataError] = usePromise(
    getVideoPromise(companyId, videoId)
  );

  const onDrop = useCallback(
    async (file: File) => {
      setUploadProgress(0);
      setIsUploading(true);
      if (videoId) await deleteVideo(companyId, videoId);

      const uploadUrl = await getUploadUrl(companyId);
      setVideoId(uploadUrl.dbId);

      const upload = UpChunk.createUpload({
        endpoint: uploadUrl.uploadUrl,
        file,
      });

      upload.on("error", (error) => {
        setError(error.detail);
        setIsUploading(false);
      });

      upload.on("progress", (progress) => {
        setUploadProgress(progress.detail);
      });

      upload.on("success", async () => {
        setIsProcessing(true);
        try {
          await getVideoPromise(companyId, uploadUrl.dbId);
        } catch (error) {
          setError((error as Error).message);
        }
        setIsProcessing(false);
        setIsUploading(false);
      });
    },
    [companyId, setVideoId, videoId]
  );

  async function removeVideo() {
    if (!videoId) return;
    await deleteVideo(companyId, videoId);
    setVideoId(null);
  }
  const [w, h] = videoData?.aspectRatio.split(":").map((n) => Number(n)) ?? [
    16, 9,
  ];
  return (
    <Dropzone
      acceptedFilesText="MP4, MOV, WEBM, MKV, M4V up to 500MB"
      acceptedMimeTypes={[
        "video/mp4",
        "video/quicktime",
        "video/webm",
        "video/x-matroska",
        "video/x-m4v",
      ]}
      multiple={false}
      onDrop={onDrop}
      loadingMessage={
        isProcessing ? "Processing video..." : "Uploading video..."
      }
      uploadProgress={isProcessing ? "indeterminate" : uploadProgress}
      aspectRatio={w / h}
      error={error || videoDataError}
      isUploading={isUploading}
      previewImage={
        videoData
          ? `https://image.mux.com/${videoData.playbackId}/thumbnail.jpg`
          : null
      }
      removeFile={removeVideo}
    />
  );
};
