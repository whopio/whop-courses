const message: Record<string, string> = {
  noCompany: "No company found",
};

export default function Error({
  searchParams,
}: {
  searchParams: { type: string };
}) {
  return <p>An error has occurred: {message[searchParams.type]}</p>;
}
