export default async function CompanyPage({
  params,
}: {
  params: { company: string };
}) {
  return (
    <div className="">
      <h1 className="text-2xl font-bold">List of courses here</h1>
    </div>
  );
}

export const dynamic = "force-static",
  dynamicParams = true,
  revalidate = 300;
