type DurationLesson = {
  description?: string | null;
  mainVideo?: { duration?: number | null } | null;
};

type DurationChapter = {
  lessons: DurationLesson[];
};

type DurationCourse = {
  chapters: DurationChapter[];
};

export function estimateLessonDuration(lesson: DurationLesson) {
  return Math.ceil(
    estimateReadingTime(lesson.description) +
      (lesson.mainVideo?.duration || 0) / 60
  );
}

export function estimateReadingTime(text?: string | null) {
  if (!text) return 0;
  const wordsPerMinute = 250;
  const numberOfWords = text.split(/\s/g).length;
  return numberOfWords / wordsPerMinute;
}

export function estimateChapterDuration(chapter: DurationChapter) {
  return chapter.lessons.reduce(
    (total, lesson) => total + estimateLessonDuration(lesson),
    0
  );
}

export function estimateCourseDuration(course: DurationCourse) {
  return course.chapters.reduce(
    (total, chapter) => total + estimateChapterDuration(chapter),
    0
  );
}

export function durationEstimate(
  input: DurationLesson | DurationChapter | DurationCourse
) {
  if ("lessons" in input) {
    return estimateChapterDuration(input);
  } else if ("chapters" in input) {
    return estimateCourseDuration(input);
  } else {
    return estimateLessonDuration(input);
  }
}
export function formattedDurationEstimate(
  input: DurationLesson | DurationChapter | DurationCourse
) {
  const totalMinutes = durationEstimate(input);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const includeS = (v: number) => (v === 1 ? "" : "s");
  if (h > 0) {
    return `${h} hour${includeS(h)} ${m} minute${includeS(m)}`;
  }
  return `${m} minute${includeS(m)}`;
}
