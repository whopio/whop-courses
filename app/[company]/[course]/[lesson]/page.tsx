import { Button } from "@/ui/Button";
import {
  faArrowCircleLeft,
  faArrowCircleRight,
  faClock,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { VideoPlayer } from "./VideoPlayer";

export default async function LessonPage() {
  // const lesson = await db.lesson.findUnique({ where: { id: 1 } });

  return (
    <div className="p-8 flex flex-col gap-4 h-screen max-w-6xl m-auto">
      <div className="flex-1 flex flex-col gap-4 overflow-auto">
        <div className="w-full rounded-2xl overflow-hidden bg-black aspect-video self-center shrink-0">
          <VideoPlayer />
        </div>
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-2xl">
            Pellentesque ultricies iaculis augue rutrum
          </h1>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faClock} className="text-neutral-500" />
            <span className="ml-2 text-neutral-500">25 Minutes</span>
          </div>
        </div>
        <div className="text-neutral-900 flex-1 flex flex-col gap-3">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut
            quam ultrices, rutrum elit et, vestibulum quam. Nulla eget lobortis
            nisi. Aliquam a mattis odio, a tincidunt magna, proin quis
            vestibulum purus, sed porttitor nulla. Duis eget magna at risus
            vestibulum pellentesque habitant morbi tristique senectus et netus
            et malesuada fames ac turpis egestas. Integer convallis eu metus in
            pretium. Pellentesque posuere ullamcorper mi, ac ullamcorper justo
            dictum et.
          </p>{" "}
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut
            quam ultrices, rutrum elit et, vestibulum quam. Nulla eget lobortis
            nisi. Aliquam a mattis odio, a tincidunt magna, proin quis
            vestibulum purus, sed porttitor nulla. Duis eget magna at risus
            vestibulum pellentesque habitant morbi tristique senectus et netus
            et malesuada fames ac turpis egestas. Integer convallis eu metus in
            pretium. Pellentesque posuere ullamcorper mi, ac ullamcorper justo
            dictum et.
          </p>{" "}
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut
            quam ultrices, rutrum elit et, vestibulum quam. Nulla eget lobortis
            nisi. Aliquam a mattis odio, a tincidunt magna, proin quis
            vestibulum purus, sed porttitor nulla. Duis eget magna at risus
            vestibulum pellentesque habitant morbi tristique senectus et netus
            et malesuada fames ac turpis egestas. Integer convallis eu metus in
            pretium. Pellentesque posuere ullamcorper mi, ac ullamcorper justo
            dictum et.
          </p>{" "}
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut
            quam ultrices, rutrum elit et, vestibulum quam. Nulla eget lobortis
            nisi. Aliquam a mattis odio, a tincidunt magna, proin quis
            vestibulum purus, sed porttitor nulla. Duis eget magna at risus
            vestibulum pellentesque habitant morbi tristique senectus et netus
            et malesuada fames ac turpis egestas. Integer convallis eu metus in
            pretium. Pellentesque posuere ullamcorper mi, ac ullamcorper justo
            dictum et.
          </p>{" "}
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut
            quam ultrices, rutrum elit et, vestibulum quam. Nulla eget lobortis
            nisi. Aliquam a mattis odio, a tincidunt magna, proin quis
            vestibulum purus, sed porttitor nulla. Duis eget magna at risus
            vestibulum pellentesque habitant morbi tristique senectus et netus
            et malesuada fames ac turpis egestas. Integer convallis eu metus in
            pretium. Pellentesque posuere ullamcorper mi, ac ullamcorper justo
            dictum et.
          </p>
        </div>
        <div className="flex justify-end">
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
