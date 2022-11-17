"use client";

import { blurDataURL } from "@/lib/util";
import { Button } from "@/ui/Button";
import { faImages } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { Dispatch, FC, SetStateAction, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

async function getUploadUrl(
  companyId: string
): Promise<{ url: string; id: string }> {
  const res = await fetch(`/api/companies/${companyId}/media/image-upload`);
  if (!res.ok) throw Error("Failed to get upload url");
  const data = await res.json();
  return data.data;
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
    async (acceptedFiles: File[]) => {
      try {
        const file = acceptedFiles[0];

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
  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject,
    acceptedFiles,
    fileRejections,
  } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [] },
    multiple: false,
  });

  if (image) {
    return (
      <div className="relative">
        <Image
          placeholder="blur"
          blurDataURL={blurDataURL}
          width={1280 * (aspectRatio || 16 / 9)}
          height={1280}
          src={image}
          style={{
            aspectRatio: aspectRatio || "16/9",
          }}
          alt="Uploaded Image"
          className="rounded-lg object-cover"
        />
        <div className="rounded-lg absolute top-0 left-0 w-full h-full opacity-0 transition hover:opacity-100 flex items-center flex-col justify-center bg-black/50 gap-2">
          <p className="font-bold text-white">Upload a new image</p>
          <div>
            <Button onClick={() => setImage(null)}>Upload Another</Button>
          </div>
        </div>
      </div>
    );
  }

  if (isUploading) {
    return (
      <div
        className="rounded-lg border-dashed border-2 transition flex flex-col gap-4 items-center justify-center p-8 bg-neutral-100 border-neutral-300"
        style={{
          aspectRatio: aspectRatio || "16/9",
        }}
      >
        <div className="text-slate-500">Uploading...</div>
        <div className="flex gap-4">
          <div className="animate-ping w-4 h-4 rounded-full bg-neutral-500"></div>
          <div
            className="animate-ping w-4 h-4 rounded-full bg-neutral-500"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="animate-ping w-4 h-4 rounded-full bg-neutral-500"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps({
        style: {
          aspectRatio: aspectRatio || "16/9",
        },
        className:
          "rounded-lg border-dashed border-2 transition flex flex-col gap-4 items-center justify-center p-8 hover:bg-neutral-100 " +
          (isDragAccept
            ? "border-emerald-500"
            : isDragReject
            ? "border-red-500"
            : "border-neutral-300"),
      })}
    >
      <input {...getInputProps()} />
      <FontAwesomeIcon icon={faImages} className="text-neutral-500" size="2x" />
      <span className="text-neutral-500">
        <span className="font-bold text-accent-600 transition hover:text-accent-700 cursor-pointer">
          Upload a file
        </span>{" "}
        or drag and drop
      </span>
      <span className="text-neutral-500 text-sm">PNG, JPG, GIF up to 10MB</span>
      {fileRejections.length > 0 && (
        <div className="self-stretch p-2 rounded-lg bg-red-200 flex flex-col gap-1">
          <p className="font-bold">Errors:</p>
          {fileRejections.map((fileRejection, i) => {
            const err = fileRejection.errors[0];
            return (
              <div key={i} className="text-sm">
                <span className="font-mono inline-block bg-red-300 rounded px-2 py-0.5">
                  {fileRejection.file.name}
                </span>{" "}
                {err.message}
              </div>
            );
          })}
          {error && <div className="text-sm">{error}</div>}
        </div>
      )}
    </div>
  );
};
