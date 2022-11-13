import MyCompaniesList from "./MyCompaniesList";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen max-w-lg w-full mx-auto">
      <h1 className="text-4xl font-semibold">Whop Courses</h1>
      <MyCompaniesList />
    </div>
  );
}

export const dynamic = "force-static",
  dynamicParams = true,
  revalidate = 300;
