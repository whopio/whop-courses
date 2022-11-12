import { PageProps } from "@/lib/api/util";

const message: Record<string, string> = {
  noCompany: "No company found",
};

export default function Error({ searchParams }: PageProps) {
  return (
    <p>
      An error has occurred:{" "}
      {searchParams ? message[searchParams?.type] : "Unknown Error"}
    </p>
  );
}
