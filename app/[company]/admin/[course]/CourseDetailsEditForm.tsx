"use client";

import { ChipSelector } from "@/ui/ChipSelector";
import { ImageDropzone } from "@/ui/ImageDropzone";
import RichtextEditor from "@/ui/RichtextEditor";
import { TextInput } from "@/ui/TextInput";
import { EditorState } from "draft-js";

import { Dispatch, FC, SetStateAction } from "react";

export const CourseEditForm: FC<{
  companyId: string;
  image: string | null;
  setImage: Dispatch<SetStateAction<string | null>>;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  description: EditorState;
  setDescription: Dispatch<SetStateAction<EditorState>>;
  visibility: "DRAFT" | "PUBLISHED";
  setVisibility: Dispatch<SetStateAction<"DRAFT" | "PUBLISHED">>;
}> = ({
  companyId,
  description,
  image,
  title,
  setDescription,
  setImage,
  setTitle,
  setVisibility,
  visibility,
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
      <div>
        <span className="block text-sm mb-1 font-bold">Visibility</span>
        <ChipSelector
          options={[
            { value: "DRAFT", label: "Draft" },
            { value: "PUBLISHED", label: "Published" },
          ]}
          selected={visibility}
          onSelect={(v) => setVisibility(v as "DRAFT" | "PUBLISHED")}
        />
      </div>
      {/* <TextArea
        label="Course Description"
        placeholder="Enter Course Description"
        rows={8}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        autogrow
      /> */}
      <RichtextEditor
        label="Course Description"
        value={description}
        onChange={setDescription}
      />
    </div>
  );
};
