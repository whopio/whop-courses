import { Button } from "@/ui/Button";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

export default async function CourseIndexPage() {
  return (
    <div className="p-8 flex flex-col gap-6 h-screen m-auto max-w-6xl">
      <div className="flex flex-col gap-6 flex-1 overflow-auto">
        <Image
          className="rounded-lg w-full max-h-80 object-cover"
          src={
            "https://images.unsplash.com/photo-1657700099548-ae6572ec6d13?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDIxfDZzTVZqVExTa2VRfHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
          }
          alt="Course Header Image"
          width={1280}
          height={384}
        />
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-3xl">
            Pellentesque ultricies iaculis augue rutrum
          </h1>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faClock} className="text-neutral-500" />
            <span className="ml-2 text-neutral-500">250 Minutes</span>
          </div>
        </div>
        <div className="text-neutral-800 flex-1">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut quam
          ultrices, rutrum elit et, vestibulum quam. Nulla eget lobortis nisi.
          Aliquam a mattis odio, a tincidunt magna, proin quis vestibulum purus,
          sed porttitor nulla. Duis eget magna at risus vestibulum pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas. Integer convallis eu metus in pretium. Pellentesque
          posuere ullamcorper mi, ac ullamcorper justo dictum et.
        </div>
      </div>
      <div className="bg-neutral-100 rounded-lg p-4 flex gap-3 items-center shadow-lg">
        <div className="w-48 flex flex-col gap-1">
          <span className="font-bold text">0% Completed</span>
          <div className="rounded-full h-2 bg-neutral-400 w-full">
            <div className="h-full w-0 bg-emerald-500 rounded-full"></div>
          </div>
        </div>
        <div className="flex-1 text-right">
          <span className="font-semibold">
            <span className="text-neutral-600">
              Estimated course duration 250 minutes (4+ hours)
            </span>
          </span>
        </div>
        <Button variant="filled" color="accent">
          Begin Course
        </Button>
      </div>
    </div>
  );
}
