"use client";

import { ImageDropzone } from "@/ui/ImageDropzone";
import { TextArea, TextInput } from "@/ui/TextInput";
import { Dispatch, FC, SetStateAction } from "react";

export const CourseEditForm: FC<{
  companyId: string;
  image: string | null;
  setImage: Dispatch<SetStateAction<string | null>>;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
}> = ({
  companyId,
  description,
  image,
  title,
  setDescription,
  setImage,
  setTitle,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <ImageDropzone
        companyId={companyId}
        image={image}
        setImage={setImage}
        aspectRatio={3}
      />
      <TextInput
        label="Course Title"
        placeholder="Enter Course Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="font-bold text-2xl"
      />
      <TextArea
        label="Course Description"
        placeholder="Enter Course Description"
        rows={8}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
  );
};
