"use client";

import { FC, useState } from "react";
import { ImageDropzone } from "./ImageDropzone";

export const CourseEditForm: FC<{ companyId: string }> = ({ companyId }) => {
  const [image, setImage] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <ImageDropzone
        companyId={companyId}
        image={image}
        setImage={setImage}
        aspectRatio={3}
      />
    </div>
  );
};
