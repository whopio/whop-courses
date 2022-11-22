"use client";

import { apiGet } from "@/lib/api/api-request";
import { Dispatch, FC, SetStateAction, useCallback, useState } from "react";
import { APIImageUpload } from "../pages/api/companies/[company]/media/image-upload";
import { Dropzone } from "./Dropzone";

async function getUploadUrl(
  companyId: string
): Promise<{ url: string; id: string }> {
  return apiGet<APIImageUpload>(`/companies/${companyId}/media/image-upload`);
}

export const ImageDropzone: FC<{
  image: string | null;
  setImage: Dispatch<SetStateAction<string | null>>;
  aspectRatio?: number;
  companyId: string;
}> = ({ image, setImage, aspectRatio, companyId }) => {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (file: File) => {
      try {
        setIsUploading(true);
        const uploadUrl = await getUploadUrl(companyId);

        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(uploadUrl.url, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) throw Error("Failed to upload image");

        const data = await response.json();
        console.log(data);
        if (!data.success) throw Error("Failed to upload image");
        const variants: string[] = data.result.variants;
        const targetVariant = variants.find((v) => v.endsWith("full"));
        if (!targetVariant) throw Error("Failed to upload image");
        setImage(targetVariant);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setIsUploading(false);
      }
    },
    [setImage, companyId]
  );
  return (
    <Dropzone
      acceptedFilesText="PNG, JPG, GIF up to 10MB"
      acceptedMimeTypes={["image/png", "image/jpeg", "image/gif"]}
      aspectRatio={aspectRatio}
      onDrop={onDrop}
      error={error}
      isUploading={isUploading}
      uploadProgress={"indeterminate"}
      previewImage={image}
      removeFile={() => setImage(null)}
      multiple={false}
    />
  );
};
