"use client";

import { apiPost } from "@/lib/api/api-request";
import { useSave } from "@/lib/hooks/use-save";
import type { TGetCourse } from "@/lib/server/get-course";
import { Button } from "@/ui/Button";
import { RichtextRenderer } from "@/ui/RenderRichtext";
import RichtextEditor from "@/ui/RichtextEditor";
import { TextInput } from "@/ui/TextInput";
import { getVideoPromise, usePromise, VideoDropzone } from "@/ui/VideoDropzone";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { FC, useCallback, useState } from "react";
import { APILesson } from "../../../../../pages/api/companies/[company]/courses/[course]/lessons/[lesson]";
import { VideoPlayer } from "../../../[course]/[lesson]/VideoPlayer";
import { editorStateToString, stringToEditorState } from "../CourseEditPage";

export const LessonEditPage: FC<{
  companyId: string;
  courseId: string;
  lessonId: string;
  companyRoute: string;
  lesson: TGetCourse["chapters"][number]["lessons"][number];
}> = ({ companyId, courseId, lesson, companyRoute, lessonId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(lesson.mainVideoId);
  const [title, setTitle] = useState(lesson.title);
  const [description, setDescription] = useState(() =>
    stringToEditorState(lesson.description)
  );
  const [videoData] = usePromise(getVideoPromise(companyId, videoId));

  const descriptionTxt = editorStateToString(description);

  const saved =
    title === lesson.title &&
    descriptionTxt === lesson.description &&
    videoId === lesson.mainVideoId;

  const save = useCallback(async () => {
    if (saved) return;
    setLoading(true);
    await apiPost<APILesson>(
      `/companies/${companyId}/courses/${courseId}/lessons/${lessonId}`,
      { description: descriptionTxt, title, videoId }
    );
    router.refresh();
    setLoading(false);
  }, [
    saved,
    router,
    companyId,
    courseId,
    lessonId,
    descriptionTxt,
    title,
    videoId,
  ]);

  useSave(save);

  const [w, h] = videoData?.aspectRatio.split(":").map((n) => Number(n)) || [
    16, 9,
  ];
  const aspectRatio = w / h;

  return (
    <>
      <div className="flex items-stretch flex-1 overflow-hidden">
        <div className="flex-1 border-r-2 border-neutral-200 overflow-auto shrink-0 flex flex-col pr-4 gap-4">
          <h1 className="font-bold text-2xl">Edit Lesson</h1>
          <p className="text-neutral-700">
            This information will be displayed to users who view this course.{" "}
          </p>
          <VideoDropzone
            companyId={companyId}
            videoId={videoId}
            setVideoId={setVideoId}
          />

          <TextInput
            label="Lesson Title"
            placeholder="Enter Lesson Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg"
          />
          <RichtextEditor
            label="Lesson Description"
            placeholder="Type out your lesson here..."
            value={description}
            onChange={setDescription}
          />
        </div>
        <div className="flex-1 overflow-auto shrink-0 pl-4 gap-4 flex flex-col rounded-xl border-2 border-accent-500 ml-4 py-4">
          <h3 className="font-bold text-xl">Preview</h3>
          <p className="text-neutral-700">
            This is how users will see your lesson.
          </p>
          <div
            className="rounded-lg w-full overflow-hidden shrink-0"
            style={{ aspectRatio }}
          >
            {videoData ? (
              <VideoPlayer
                playbackId={videoData.playbackId}
                completeOnFinish={false}
              />
            ) : (
              <div className="flex items-center justify-center bg-neutral-100 p-4 rounded-lg border-2 border-neutral-200 w-full h-full">
                <span className="text-neutral-400 text-lg">
                  Media content will display here
                </span>
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold">
            {title || (
              <span className="text-neutral-400">Enter lesson title</span>
            )}
          </h1>
          <RichtextRenderer content={descriptionTxt} />
        </div>
      </div>
      <div className="bg-neutral-100 rounded-lg p-4 flex gap-3 items-center shadow-lg">
        <div className="flex-1"></div>
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
