import { getUserCompanies } from "@/lib/api/whop-api";
import { getUser } from "@/lib/server/get-user";
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

export default async function MyCompaniesList() {
  const user = await getUser();
  const companies = await getUserCompanies(user.whopAccessToken);
  return (
    <div className="flex flex-col gap-4 w-full">
      {companies.map((company) => (
        <Link href={`/${company.route}`} key={company.id}>
          <div className="p-4 border-2 border-slate-800 hover:border-emerald-500 transition-all rounded-lg flex gap-4 items-center group">
            <Image
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
              className="text-slate-300 group-hover:text-emerald-500 transition-all"
            />
          </div>
        </Link>
      ))}
    </div>
  );
}

const CompanySelectorSkeleton = () => (
  <div className="p-4 border-2 border-slate-800 rounded-lg flex gap-4 items-center">
    <div className="w-10 h-10 rounded-full animate-pulse bg-slate-700"></div>
    <div className="flex-1 h-6 rounded-full animate-pulse bg-slate-700"></div>
    <FontAwesomeIcon
      icon={faArrowCircleRight}
      size="2x"
      className="text-slate-700 animate-pulse "
    />
  </div>
);
