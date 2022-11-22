"use client";

import { apiGet } from "@/lib/api/api-request";
import { Dispatch, FC, SetStateAction, useCallback } from "react";
import { Dropzone } from "./Dropzone";

const getUploadUrl = async (companyId: string) => {
  const data = await apiGet(`/companies/${companyId}/media/video-upload`);
};

export const VideoDropzone: FC<{
  companyId: string;
  videoId: string | null;
  setVideoId: Dispatch<SetStateAction<string | null>>;
}> = ({ companyId, setVideoId, videoId }) => {
  const onDrop = useCallback(async (file: File) => {}, []);

  return (
    <Dropzone
      acceptedFilesText="MOV, AVI, MP4, MPEG4 up to 500MB"
      acceptedMimeTypes={[
        "video/mp4",
        "video/avi",
        "video/mov",
        "video/mpeg4",
        "video/x-matroska",
      ]}
      multiple={false}
      onDrop={onDrop}
      uploadProgress={0}
      aspectRatio={16 / 9}
      error={null}
      isUploading={false}
      previewImage={
        "https://images.unsplash.com/photo-1668875760901-ab0b06880bfc"
      }
      removeFile={() => console.log("remove")}
    />
  );
};
