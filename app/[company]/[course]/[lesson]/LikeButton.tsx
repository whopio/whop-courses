"use client";

import { apiPost } from "@/lib/api/api-request";
import { Button } from "@/ui/Button";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { APIInteract } from "../../../../pages/api/companies/[company]/courses/[course]/lessons/[lesson]/interact";

export const LikeButton: FC<{
  initialValue: boolean;
  companyId: string;
  courseId: string;
  lessonId: string;
}> = ({ companyId, courseId, initialValue, lessonId }) => {
  const router = useRouter();
  const [liked, setLiked] = useState(initialValue);

  async function toggleCompletion() {
    setLiked(!liked);
    await apiPost<APIInteract>(
      `/companies/${companyId}/courses/${courseId}/lessons/${lessonId}/interact`,
      {
        liked: !liked,
      }
    );
    router.refresh();
  }

  useEffect(() => {
    setLiked(initialValue);
  }, [initialValue]);

  return (
    <Button
      variant={liked ? "filled" : "outline"}
      color="accent"
      iconLeft={faCheckCircle}
      onClick={toggleCompletion}
    >
      {liked ? "Marked as Favorite" : "Mark as Favorite"}
    </Button>
  );
};
