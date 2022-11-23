import { db } from "@/lib/db";
import { formattedDurationEstimate } from "@/lib/duration-estimator";
import { PageProps } from "@/lib/util";
import { Button } from "@/ui/Button";
import {
  faArrowCircleLeft,
  faArrowCircleRight,
  faCheckCircle,
  faClock,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { VideoPlayer } from "./VideoPlayer";

export default async function LessonPage({ params }: PageProps) {
  const lessonId = params!.lesson!;
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { mainVideo: true, userInteractions: true },
  });
  if (!lesson) throw Error("404 - Lesson not found");

  const [w, h] = lesson.mainVideo?.aspectRatio
    ?.split(":")
    .map((n) => Number(n)) || [16, 9];
  const aspectRatio = w / h;

  return (
    <div className="p-8 flex flex-col gap-4 h-screen max-w-6xl m-auto">
      <div className="flex-1 flex flex-col gap-4 overflow-auto">
        {lesson.mainVideo && lesson.mainVideo.playbackId ? (
          <div
            className="w-full rounded-2xl overflow-hidden bg-black self-center shrink-0"
            style={{ aspectRatio }}
          >
            <VideoPlayer playbackId={lesson.mainVideo.playbackId} />
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
          <p className=" whitespace-pre-line">{lesson.description}</p>
        </div>
        <div className="flex justify-end gap-2 p-2">
          <Button variant="outline" color="success" iconLeft={faCheckCircle}>
            Marked as Completed
          </Button>
          <Button variant="outline" color="accent" iconLeft={faStar}>
            Marked as Favourite
          </Button>
        </div>
      </div>
      <div className="bg-neutral-100 rounded-lg p-4 flex gap-3 items-center shadow-lg">
        <div className="w-48 flex flex-col gap-1">
          <span className="font-bold text">70% Completed</span>
          <div className="rounded-full h-2 bg-neutral-400 w-full">
            <div className="h-full w-32 bg-emerald-500 rounded-full"></div>
          </div>
        </div>
        <div className="flex-1 text-right">
          <span className="font-semibold">
            <span className="text-neutral-600">Next Lesson: </span>
            Pellentesque scelerisque consequat
          </span>
        </div>
        <Button iconLeft={faArrowCircleLeft}>Back</Button>
        <Button variant="filled" color="accent" iconRight={faArrowCircleRight}>
          Next
        </Button>
      </div>
    </div>
  );
}
