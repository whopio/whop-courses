import {
  estimateChapterDuration,
  estimateLessonDuration,
  formattedDurationEstimate,
} from "@/lib/duration-estimator";
import { getCompany } from "@/lib/server/get-company";
import { getCourse } from "@/lib/server/get-course";
import { getUserSession } from "@/lib/server/get-user";
import { PageProps } from "@/lib/util";
import { Button } from "@/ui/Button";
import { RichtextRenderer } from "@/ui/RenderRichtext";
import {
  faArrowCircleLeft,
  faArrowCircleRight,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import invariant from "tiny-invariant";
import { CompletionButton } from "./CompletionButton";
import { LikeButton } from "./LikeButton";
import { VideoPlayer } from "./VideoPlayer";

export default async function LessonPage({ params }: PageProps) {
  console.time("lesson.page");
  const lessonId = params!.lesson!;
  const user = await getUserSession();
  const company = await getCompany(params!.company!);
  const course = await getCourse(
    params!.course,
    user.userId,
    user.whopToken,
    true
  );

  let lesson, chapter, prevLesson, nextLesson;
  for (let i = 0; i < course.chapters.length; i++) {
    const c = course.chapters[i];
    for (let j = 0; j < c.lessons.length; j++) {
      const l = c.lessons[j];
      if (l.id === lessonId) {
        lesson = l;
        chapter = c;
        prevLesson =
          c.lessons[j - 1] || course.chapters[i - 1]?.lessons.slice(-1)[0];
        nextLesson = c.lessons[j + 1] || course.chapters[i + 1]?.lessons[0];
      }
    }
  }

  invariant(lesson, "404 - Lesson not found");
  invariant(chapter, "404 - Lesson not found");

  const chapterDuration = estimateChapterDuration(chapter);
  const completedChapterDuration = chapter.lessons.reduce(
    (duration, l) =>
      l.userInteractions.find(
        (i) => i.status === "COMPLETED" && i.userId === user.userId
      )
        ? estimateLessonDuration(l) + duration
        : duration,
    0
  );

  const percentComplete = Math.round(
    (completedChapterDuration / chapterDuration) * 100
  );

  const interaction = lesson.userInteractions.find(
    (i) => i.userId === user.userId
  );

  const [w, h] = lesson.mainVideo?.aspectRatio
    ?.split(":")
    .map((n) => Number(n)) || [16, 9];
  const aspectRatio = w / h;
  console.timeEnd("lesson.page");

  return (
    <div className="p-8 flex flex-col gap-4 h-screen max-w-6xl m-auto">
      <div className="flex-1 flex flex-col gap-4 overflow-auto">
        {lesson.mainVideo && lesson.mainVideo.playbackId ? (
          <div
            className="w-full rounded-2xl overflow-hidden bg-black self-center shrink-0"
            style={{ aspectRatio }}
          >
            <VideoPlayer
              playbackId={lesson.mainVideo.playbackId}
              completeOnFinish
              companyId={company.tag}
              courseId={course.id}
              lessonId={lesson.id}
            />
          </div>
        ) : null}
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-2xl">{lesson.title}</h1>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faClock} className="text-neutral-500" />
            <span className="ml-2 text-neutral-500">
              {formattedDurationEstimate(lesson)}
            </span>
          </div>
        </div>
        <div className="text-neutral-900 flex-1 flex flex-col gap-3">
          <RichtextRenderer content={lesson.description} />
        </div>
        <div className="flex justify-end gap-2 p-2">
          <CompletionButton
            companyId={company.tag}
            courseId={course.id}
            lessonId={lesson.id}
            initialValue={interaction?.status === "COMPLETED"}
          />
          <LikeButton
            companyId={company.tag}
            courseId={course.id}
            lessonId={lesson.id}
            initialValue={interaction?.liked ?? false}
          />
        </div>
      </div>
      <div className="bg-neutral-100 rounded-lg p-4 flex gap-3 items-center shadow-lg">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="inline-block rounded bg-neutral-200 px-1.5 py-0.5 text-sm font-semibold">
              {chapter.title}
            </div>
            <div className="font-semibold text-sm">
              {percentComplete}% Completed
            </div>
          </div>
          <div className="rounded-full h-2 bg-neutral-300 w-48">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${percentComplete}%` }}
            ></div>
          </div>
        </div>
        <div className="flex-1 text-right">
          {nextLesson ? (
            <span className="font-semibold">
              <span className="text-neutral-600">Next Lesson: </span>
              {nextLesson.title}
            </span>
          ) : null}
        </div>
        {prevLesson ? (
          <Button
            iconLeft={faArrowCircleLeft}
            link
            href={`/${company.route}/${course.id}/${prevLesson.id}`}
          >
            Back
          </Button>
        ) : null}{" "}
        {nextLesson ? (
          <Button
            variant="filled"
            color="accent"
            iconRight={faArrowCircleRight}
            link
            href={`/${company.route}/${course.id}/${nextLesson.id}`}
          >
            Next
          </Button>
        ) : null}
      </div>
    </div>
  );
}
