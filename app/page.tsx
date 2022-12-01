import { getUserCompanies } from "@/lib/api/whop-api";
import { getUser } from "@/lib/server/get-user";
import { blurDataURL } from "@/lib/util";
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getUser();
  const companies = await getUserCompanies(user.whopAccessToken);

  if (companies.length === 1) {
    return redirect(`/${companies[0].route}`);
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen max-w-lg w-full mx-auto">
      <h1 className="text-4xl font-semibold">Whop Courses</h1>
      <div className="flex flex-col gap-4 w-full">
        {companies.map((company) => (
          <Link href={`/${company.route}`} key={company.id}>
            <div className="p-4 bg-slate-200 hover:shadow-lg hover:bg-emerald-200 transition-all rounded-lg flex gap-4 items-center group">
              <Image
                placeholder="blur"
                blurDataURL={blurDataURL}
                src={company.image_url}
                alt="Company Image Title"
                width={40}
                height={40}
                className="rounded-full"
              />
              <h1 className="flex-1 text-2xl font-bold">{company.title}</h1>
              <FontAwesomeIcon
                icon={faArrowCircleRight}
                size="2x"
                className="text-slate-400 group-hover:text-emerald-500 transition-all"
              />
            </div>
          </Link>
        ))}
      </div>{" "}
    </div>
  );
}
