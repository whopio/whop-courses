"use client";

import { apiPost } from "@/lib/api/api-request";
import { Button } from "@/ui/Button";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { APIInteract } from "../../../../pages/api/companies/[company]/courses/[course]/lessons/[lesson]/interact";

export const CompletionButton: FC<{
  initialValue: boolean;
  companyId: string;
  courseId: string;
  lessonId: string;
}> = ({ companyId, courseId, initialValue, lessonId }) => {
  const router = useRouter();
  const [completed, setCompleted] = useState(initialValue);

  async function toggleCompletion() {
    setCompleted(!completed);
    await apiPost<APIInteract>(
      `/companies/${companyId}/courses/${courseId}/lessons/${lessonId}/interact`,
      {
        completed: !completed,
      }
    );
    router.refresh();
  }

  useEffect(() => {
    setCompleted(initialValue);
  }, [initialValue]);

  return (
    <Button
      variant={completed ? "filled" : "outline"}
      color="success"
      iconLeft={faCheckCircle}
      onClick={toggleCompletion}
    >
      {completed ? "Marked as Completed" : "Mark as completed"}
    </Button>
  );
};
