"use client";

import { apiDelete, apiPost } from "@/lib/api/api-request";
import { useSave } from "@/lib/hooks/use-save";
import type { TGetCourse } from "@/lib/server/get-course";
import { Button } from "@/ui/Button";
import {
  faArrowUpRightFromSquare,
  faHandPointLeft,
  faHandPointRight,
  faPlus,
  faSave,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import { useRouter } from "next/navigation";
import { FC, useCallback, useState } from "react";
import { APICourse } from "../../../../pages/api/companies/[company]/courses/[course]";
import { APIChapter } from "../../../../pages/api/companies/[company]/courses/[course]/chapters";
import { APILessons } from "../../../../pages/api/companies/[company]/courses/[course]/lessons";
import { CourseEditForm } from "./CourseDetailsEditForm";
import {
  CourseLessonOrganizer,
  CourseStructure,
} from "./CourseLessonOrganizer";

function editorStateToString(editorState: EditorState): string {
  return JSON.stringify(convertToRaw(editorState.getCurrentContent()));
}
function stringToEditorState(str?: string | null | undefined): EditorState {
  if (!str || str.length === 0) return EditorState.createEmpty();
  try {
    const obj = JSON.parse(str);
    return EditorState.createWithContent(convertFromRaw(obj));
  } catch (error) {
    return EditorState.createEmpty();
  }
}

export const CourseEditPage: FC<{
  companyId: string;
  courseId: string;
  companyRoute: string;
  course: TGetCourse;
}> = ({ companyId, courseId, course, companyRoute }) => {
  const router = useRouter();

  const [structure, setStructure] = useState<CourseStructure>(
    course.chapters.map((c) => ({
      id: c.id,
      title: c.title,
      lessons: c.lessons.map((l) => ({
        id: l.id,
        title: l.title,
      })),
    }))
  );

  const [onboardingStage, setOnboardingStage] = useState<
    null | "details" | "content"
  >(isNewCourse(course) ? "details" : null);

  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingNewChapter, setLoadingNewChapter] = useState(false);
  const [image, setImage] = useState<string | null>(course.coverImage);
  const [title, setTitle] = useState(course.title);
  console.log(course);
  const [description, setDescription] = useState(() =>
    stringToEditorState(course.description)
  );
  const [visibility, setVisibility] = useState(course.status);
  const [loadingChapterId, setLoadingChapterId] = useState<string | null>(null);

  const descriptionTxt = editorStateToString(description);

  console.log(descriptionTxt);

  const saved =
    image === course.coverImage &&
    title === course.title &&
    descriptionTxt === course.description &&
    visibility === course.status &&
    structureSaved(course, structure);

  const save = useCallback(async () => {
    setLoading(true);
    try {
      await apiPost<APICourse>(`/companies/${companyId}/courses/${courseId}`, {
        description:
          course.description === descriptionTxt ? undefined : descriptionTxt,
        image: course.coverImage === image ? undefined : image,
        title: course.title === title ? undefined : title,
        structure: structureSaved(course, structure) ? undefined : structure,
        visibility: course.status === visibility ? undefined : visibility,
      });
      router.refresh();
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [
    title,
    image,
    descriptionTxt,
    structure,
    router,
    companyId,
    courseId,
    visibility,
    course,
  ]);

  useSave(save);

  async function createChapter() {
    setLoadingNewChapter(true);
    const res = await apiPost<APIChapter>(
      `/companies/${companyId}/courses/${courseId}/chapters`,
      undefined
    );
    router.refresh();
    setLoadingNewChapter(false);
    setStructure((s) => [...s, { id: res.id, title: res.title, lessons: [] }]);
  }

  async function createLesson(chapterId: string) {
    try {
      setLoadingChapterId(chapterId);
      const lesson = await apiPost<APILessons>(
        `/companies/${companyId}/courses/${courseId}/lessons`,
        { chapterId }
      );
      setLoadingChapterId(null);
      router.refresh();
      router.push(`/${companyRoute}/admin/${courseId}/${lesson.id}`);
    } catch (error) {
      setLoadingChapterId(null);
      alert((error as Error).message);
    }
  }

  async function deleteCourse() {
    if (
      !confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    )
      return;
    setLoadingDelete(true);
    await apiDelete(`/companies/${companyId}/courses/${courseId}`);
    setLoadingDelete(false);
    router.refresh();
    router.push(`/${companyRoute}/admin`);
  }

  return (
    <>
      <div className="flex items-stretch flex-1 overflow-hidden">
        <div className="relative flex-1 border-r-2 border-neutral-200 overflow-auto shrink-0 flex flex-col pr-4 gap-4">
          <h1 className="font-bold text-2xl">Course Details</h1>
          <p className="text-neutral-700">
            This information will be displayed to users who view this course.
          </p>
          <CourseEditForm
            companyId={companyId}
            description={description}
            image={image}
            title={title}
            setDescription={setDescription}
            setImage={setImage}
            setTitle={setTitle}
            visibility={visibility}
            setVisibility={setVisibility}
          />
          {onboardingStage === "content" && (
            <div className="bg-white absolute top-0 left-0 right-0 bottom-0 p-6 flex flex-col gap-4 items-end">
              <div>
                <FontAwesomeIcon
                  icon={faHandPointRight}
                  size="3x"
                  className="text-neutral-400"
                />
              </div>
              <h3 className="text-xl font-bold">Step 2 - Course Content</h3>
              <p className="text-right">
                We’ve prepared a few chapters filled with lessons for you to
                start off with. Feel free to edit these to suit your needs.
              </p>
              <Button
                color="accent"
                variant={"filled"}
                extraClasses="self-end"
                onClick={() => setOnboardingStage(null)}
              >
                Done
              </Button>
            </div>
          )}
        </div>
        <div className="relative flex-1 overflow-auto shrink-0 pl-4 gap-4 flex flex-col">
          <div className="flex items-center">
            <div className="flex-1">
              <h3 className="font-bold text-2xl">Course Content</h3>
              <p className="text-neutral-700 mt-4">
                Organize your course into chapters/lessons for your users.
              </p>
            </div>
            <div className="p-2">
              <Button
                loading={loadingNewChapter}
                variant="filled"
                iconLeft={faPlus}
                onClick={() => createChapter()}
              >
                New Chapter
              </Button>
            </div>
          </div>
          <CourseLessonOrganizer
            structure={structure}
            setStructure={setStructure}
            companyRoute={companyRoute}
            courseId={courseId}
            createLesson={createLesson}
            loadingAddChapter={loadingChapterId}
          />
          {onboardingStage === "details" && (
            <div className="bg-white absolute top-0 left-0 right-0 bottom-0 p-6 flex flex-col gap-4">
              <div>
                <FontAwesomeIcon
                  icon={faHandPointLeft}
                  size="3x"
                  className="text-neutral-400"
                />
              </div>
              <h3 className="text-xl font-bold">Step 1 - Course Details</h3>
              <p>Begin by filling out the general details for your course.</p>
              <Button
                color="accent"
                variant={"filled"}
                onClick={() => setOnboardingStage("content")}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="bg-neutral-100 rounded-lg p-4 flex gap-3 items-center shadow-lg">
        <Button
          color="danger"
          iconLeft={faTrashCan}
          onClick={deleteCourse}
          loading={loadingDelete}
        >
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

function structureSaved(
  course: TGetCourse,
  structure: CourseStructure
): boolean {
  if (course.chapters.length !== structure.length) return false;
  for (let i = 0; i < course.chapters.length; i++) {
    const chapter = course.chapters[i];
    const newChapter = structure[i];
    if (chapter.id !== newChapter.id) return false;
    if (chapter.title !== newChapter.title) return false;
    if (chapter.lessons.length !== newChapter.lessons.length) return false;
    for (let j = 0; j < chapter.lessons.length; j++) {
      const lesson = chapter.lessons[j];
      const newLesson = newChapter.lessons[j];
      if (lesson.id !== newLesson.id) return false;
      if (lesson.title !== newLesson.title) return false;
    }
  }
  return true;
}

function isNewCourse(course: TGetCourse): boolean {
  return course.title === "";
}
