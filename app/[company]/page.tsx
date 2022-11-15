import { PageProps } from "@/lib/util";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default async function CompanyPage({}: PageProps) {
  return (
    <div className="p-4 border-2 border-slate-200 rounded-lg">
      <h1 className="text-2xl text-center font-bold">List of courses here</h1>

      <div className="flex justify-center gap-4 p-4">
        <FontAwesomeIcon
          className="text-4xl p-4 bg-emerald-100 hover:bg-emerald-600 hover:text-slate-900 rounded-full transition-all"
          icon={faRocket}
        />
        <FontAwesomeIcon
          className="text-4xl p-4 bg-amber-100 hover:bg-amber-600 hover:text-slate-900 rounded-full transition-all"
          icon={faRocket}
        />
        <FontAwesomeIcon
          className="text-4xl p-4 bg-red-100 hover:bg-red-600 hover:text-slate-900 rounded-full transition-all"
          icon={faRocket}
        />
      </div>
    </div>
  );
}

export const dynamic = "force-static",
  dynamicParams = true,
  revalidate = 300;
