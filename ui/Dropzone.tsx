"use client";

import { apiGet } from "@/lib/api/api-request";
import { faImages, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { APIImageUpload } from "../pages/api/companies/[company]/media/image-upload";
import { IconButton } from "./IconButton";

async function getUploadUrl(
  companyId: string
): Promise<{ url: string; id: string }> {
  return apiGet<APIImageUpload>(`/companies/${companyId}/media/image-upload`);
}

type DropzoneProps = {
  aspectRatio?: number;
  isUploading?: boolean;
  uploadProgress: number | "indeterminate";
  acceptedFilesText: string;
  error?: string | null;
  acceptedMimeTypes: string[];
  previewImage: string | null;
  removeFile: () => void;
  loadingMessage?: string;
} & (
  | { multiple?: false; onDrop: (file: File) => void }
  | { multiple: true; onDrop: (files: File[]) => void }
);

export const Dropzone: FC<DropzoneProps> = ({
  aspectRatio,
  isUploading,
  uploadProgress,
  acceptedFilesText,
  error,
  acceptedMimeTypes,
  onDrop,
  multiple,
  previewImage,
  removeFile,
  loadingMessage,
}) => {
  const onDropCallback = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      if (multiple) {
        onDrop(acceptedFiles);
      } else {
        onDrop(acceptedFiles[0]);
      }
    },
    [onDrop, multiple]
  );

  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject,
    acceptedFiles,
    isDragActive,
    fileRejections,
  } = useDropzone({
    onDrop: onDropCallback,
    accept: acceptedMimeTypes.reduce(
      (acc, mimeType) => ({ ...acc, [mimeType]: [] }),
      {}
    ),
    multiple: multiple ?? false,
  });

  if (isUploading) {
    return (
      <div
        className="rounded-lg border-dashed border-2 transition flex flex-col gap-4 items-center justify-center p-8 bg-neutral-100 border-neutral-300"
        style={{
          aspectRatio: aspectRatio || "16/9",
        }}
      >
        <div className="text-slate-500">{loadingMessage || "Uploading..."}</div>

        {uploadProgress === "indeterminate" ? (
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
        ) : (
          <div className="w-full h-2 bg-neutral-300 rounded-full">
            <div
              className="h-full bg-primary-600 rounded-full transition-all animate-pulse"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>
    );
  }

  const errors = fileRejections.length > 0 && (
    <div className="self-stretch p-2 rounded-lg bg-red-200 flex flex-col gap-1 m-2">
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
  );

  return (
    <div
      {...getRootProps({
        style: {
          aspectRatio: aspectRatio || "16/9",
          backgroundImage:
            previewImage && !isDragActive ? `url(${previewImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        },
        className:
          "rounded-lg border-2 transition hover:bg-neutral-100 " +
          (isDragAccept
            ? "border-emerald-500"
            : isDragReject
            ? "border-red-500"
            : previewImage && !isDragActive
            ? "border-none"
            : "border-neutral-300"),
      })}
    >
      <input {...getInputProps()} />

      {previewImage && !isDragActive ? (
        <div className="h-full flex flex-col justify-end">
          {errors}
          <div className="flex items-start justify-between p-3 backdrop-blur-sm backdrop-brightness-50 rounded-b-lg">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon
                icon={faImages}
                className="text-neutral-300 text-2xl"
              />
              <div>
                <div className="font-bold text-white">Media Uploaded!</div>
                <div className="text-neutral-300 text-sm">
                  Drag or click to upload another
                </div>
              </div>
            </div>
            <IconButton
              icon={faTrashCan}
              color="danger"
              variant="filled"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 items-center justify-center p-8 h-full">
          <FontAwesomeIcon
            icon={faImages}
            className="text-neutral-500"
            size="2x"
          />
          <span className="text-neutral-500">
            <span className="font-bold text-accent-600 transition hover:text-accent-700 cursor-pointer">
              Upload a file
            </span>{" "}
            or drag and drop
          </span>
          <span className="text-neutral-500 text-sm">{acceptedFilesText}</span>
          {errors}
        </div>
      )}
    </div>
  );
};
