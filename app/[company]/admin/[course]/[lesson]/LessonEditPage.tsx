"use client";

import { apiPost } from "@/lib/api/api-request";
import type { TGetCourse } from "@/lib/server/get-course";
import { Button } from "@/ui/Button";
import { TextArea, TextInput } from "@/ui/TextInput";
import {
  faArrowUpRightFromSquare,
  faSave,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { APILesson } from "../../../../../pages/api/companies/[company]/courses/[course]/lessons/[lesson]";

export const LessonEditPage: FC<{
  companyId: string;
  courseId: string;
  lessonId: string;
  companyRoute: string;
  lesson: TGetCourse["chapters"][number]["lessons"][number];
}> = ({ companyId, courseId, lesson, companyRoute, lessonId }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(lesson.title);
  const [description, setDescription] = useState(lesson.description || "");

  const saved = title === lesson.title && description === lesson.description;

  async function save() {
    if (saved) return;
    setLoading(true);
    await apiPost<APILesson>(
      `/companies/${companyId}/courses/${courseId}/lessons/${lessonId}`,
      { description, title }
    );
    router.refresh();
    setLoading(false);
  }

  return (
    <>
      <div className="flex items-stretch flex-1 overflow-hidden">
        <div className="flex-1 border-r-2 border-neutral-200 overflow-auto shrink-0 flex flex-col pr-4 gap-4">
          <h1 className="font-bold text-2xl">Edit Lesson</h1>
          <p className="text-neutral-700">
            This information will be displayed to users who view this course.{" "}
          </p>
          {/* <VideoDropzone /> */}

          <TextInput
            label="Lesson Title"
            placeholder="Enter Lesson Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg"
          />
          <TextArea
            label="Lesson Description"
            placeholder="Type out your lesson here..."
            rows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-auto shrink-0 pl-4 gap-4 flex flex-col">
          <div className="aspect-video rounded-lg w-full overflow-hidden">
            <div className="flex items-center justify-center bg-neutral-100 p-4 rounded-lg border-2 border-neutral-200 w-full h-full">
              <span className="text-neutral-400 text-lg">
                Media content will display here
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold">
            {title || (
              <span className="text-neutral-400">Enter lesson title</span>
            )}
          </h1>
          <p className="">
            {description || (
              <span className="text-neutral-400 whitespace-pre-line">
                Type out your lesson...
              </span>
            )}
          </p>
        </div>
      </div>
      <div className="bg-neutral-100 rounded-lg p-4 flex gap-3 items-center shadow-lg">
        <Button color="danger" iconLeft={faTrashCan}>
          Delete
        </Button>
        <div className="flex-1"></div>
        <Button iconLeft={faArrowUpRightFromSquare}>Preview</Button>
        <Button
          variant="filled"
          color="success"
          disabled={saved && !loading}
          iconLeft={faSave}
          loading={loading}
          onClick={save}
        >
          {saved ? "Saved" : "Save"}
        </Button>
      </div>
    </>
  );
};
