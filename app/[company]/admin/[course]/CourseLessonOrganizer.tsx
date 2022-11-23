import { Button } from "@/ui/Button";
import { IconButton } from "@/ui/IconButton";
import {
  faGripVertical,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Dispatch, FC, SetStateAction } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

export type CourseStructure = {
  id: string;
  title: string;
  lessons: {
    id: string;
    title: string;
  }[];
}[];

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export const CourseLessonOrganizer: FC<{
  structure: CourseStructure;
  setStructure: Dispatch<SetStateAction<CourseStructure>>;
  companyRoute: string;
  courseId: string;
  createLesson: (chapterId: string) => any;
}> = ({ structure, setStructure, companyRoute, courseId, createLesson }) => {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.type === "CHAPTER") {
      setStructure((s) =>
        reorder(s, result.source.index, result.destination!.index)
      );
    }
    if (result.type === "LESSON") {
      setStructure((s) => {
        const src = s.find((c) => c.id === result.source.droppableId)!;
        const dest = s.find((c) => c.id === result.destination!.droppableId)!;
        const [removed] = src.lessons.splice(result.source.index, 1);
        dest.lessons.splice(result.destination!.index, 0, removed);
        return [...s];
      });
    }
  };

  const updateChapterTitle = (id: string, title: string) => {
    setStructure((s) => {
      const chapter = s.find((c) => c.id === id)!;
      chapter.title = title;
      return [...s];
    });
  };

  function removeChapter(id: string) {
    if (
      !confirm(
        "Are you sure you want to delete this chapter? This cannot be undone."
      )
    )
      return;
    setStructure((s) => s.filter((c) => c.id !== id));
  }
  function removeLesson(chid: string, id: string) {
    if (
      !confirm(
        "Are you sure you want to delete this lesson? This cannot be undone."
      )
    )
      return;
    setStructure((s) =>
      s.map((c) =>
        c.id === chid
          ? { ...c, lessons: c.lessons.filter((l) => l.id !== id) }
          : c
      )
    );
  }

  if (structure.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 rounded-lg border-2 border-neutral-200">
        <div className="text-2xl font-semibold text-neutral-500">
          No chapters yet
        </div>
        <div className="text-sm text-neutral-400">
          Add a chapter to get started
        </div>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="course-drop" type="CHAPTER">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-col"
          >
            {structure.map((chapter, index) => (
              <Draggable
                key={`chapter_${chapter.id}`}
                draggableId={`chapter_${chapter.id}`}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`flex flex-col rounded-lg border border-neutral-200 my-2 ${
                      snapshot.isDragging ? "bg-neutral-200" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 py-2 px-4 border-b border-neutral-200">
                      <div {...provided.dragHandleProps}>
                        <FontAwesomeIcon
                          icon={faGripVertical}
                          className="text-neutral-400"
                        />
                      </div>
                      <input
                        placeholder="Enter Chapter Title"
                        className="text-lg flex-1 font-bold px-1 outline-none border-2 border-white hover:border-neutral-200 focus:border-accent-500 rounded transition"
                        value={chapter.title}
                        onChange={(e) =>
                          updateChapterTitle(chapter.id, e.target.value)
                        }
                      />
                      <Button
                        size="sm"
                        iconLeft={faPlus}
                        onClick={() => createLesson(chapter.id)}
                      >
                        Add Lesson
                      </Button>
                      <IconButton
                        size="sm"
                        icon={faXmark}
                        onClick={() => removeChapter(chapter.id)}
                      />
                    </div>
                    <Droppable droppableId={chapter.id} type="LESSON">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="flex flex-col"
                        >
                          {chapter.lessons.map((lesson, index) => (
                            <Draggable
                              key={`lesson_${lesson.id}`}
                              draggableId={`lesson_${lesson.id}`}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`flex gap-2 py-2 px-4 items-center rounded-lg ${
                                    snapshot.isDragging ? "bg-neutral-200" : ""
                                  }`}
                                >
                                  <div {...provided.dragHandleProps}>
                                    <FontAwesomeIcon
                                      icon={faGripVertical}
                                      className="text-neutral-400"
                                    />
                                  </div>
                                  <Link
                                    href={`/${companyRoute}/admin/${courseId}/${lesson.id}`}
                                    className="flex-1 text-neutral-700 px-2 hover:underline hover:bg-slate-100 self-stretch rounded-lg transition flex items-center"
                                  >
                                    <span>{lesson.title}</span>
                                  </Link>
                                  <IconButton
                                    size="sm"
                                    icon={faXmark}
                                    onClick={() =>
                                      removeLesson(chapter.id, lesson.id)
                                    }
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          {chapter.lessons.length === 0 && (
                            <span className="italic text-neutral-500 text-center p-4">
                              No Lessons for this chapter
                            </span>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
