"use client";

import { apiPost } from "@/lib/api/api-request";
import { Button } from "@/ui/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { APICourses } from "../../../pages/api/companies/[company]/courses";

export const CreateCourseButton: FC<{
  companyId: string;
  companyRoute: string;
}> = ({ companyId, companyRoute }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function createCourse() {
    setLoading(true);
    const course = await apiPost<APICourses>(
      `/companies/${companyId}/courses`,
      undefined
    );
    setLoading(false);
    router.refresh();
    router.push(`/${companyRoute}/admin/${course.id}`);
  }

  return (
    <Button
      color="accent"
      variant="filled"
      iconLeft={faPlus}
      onClick={createCourse}
      loading={loading}
    >
      New
    </Button>
  );
};
