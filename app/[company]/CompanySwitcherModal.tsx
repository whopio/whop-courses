"use client";

import { WhopUserCompanies } from "@/lib/api/whop-api-types";
import { blurDataURL } from "@/lib/util";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";

export const CompanySwitcherModal: FC<{
  companies: WhopUserCompanies;
  selectedRoute: string;
}> = ({ companies, selectedRoute }) => {
  const [open, setOpen] = useState(false);
  const selected = companies.find((c) => c.route === selectedRoute);
  if (!selected) return null;
  return (
    <div className="relative">
      <div className="group flex flex-row flex-nowrap items-center gap-2 bg-black rounded-lg p-3">
        <Image
          placeholder="blur"
          blurDataURL={blurDataURL}
          src={selected.image_url}
          alt="Company Image Title"
          width={32}
          height={32}
          className="rounded-full"
        />
        <Link className="flex-1" href={`/${selected.route}`}>
          <h1 className="font-semibold text-md text-white group-hover:text-slate-300 transition-all select-none cursor-pointer">
            {selected.title}
          </h1>
        </Link>
        <button
          className="text-slate-500 text-lg group-hover:bg-slate-900 w-8 h-8 rounded-full transition"
          onClick={() => setOpen(!open)}
        >
          <FontAwesomeIcon icon={open ? faCaretUp : faCaretDown} />
        </button>
      </div>
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 transition ${
          open ? "" : "pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      ></div>
      <Transition
        show={open}
        className="absolute w-full z-20"
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="mt-2 p-2 bg-black rounded-lg">
          {companies.map((company) => (
            <div
              key={company.id}
              className={`flex items-center flex-nowrap gap-2 rounded-lg p-2 ${
                company.route === selectedRoute ? "bg-slate-800" : "bg-black"
              } hover:bg-slate-900 transition-all`}
            >
              <Image
                placeholder="blur"
                blurDataURL={blurDataURL}
                src={company.image_url}
                alt="Company Image Title"
                width={28}
                height={28}
                className="rounded-full"
              />
              <Link
                className="flex-1"
                href={`/${company.route}`}
                onClick={() =>
                  company.route === selectedRoute ? setOpen(false) : undefined
                }
              >
                <h1 className="font-semibold text-md text-white group-hover:text-slate-300 transition-all select-none cursor-pointer">
                  {company.title}
                </h1>
              </Link>
            </div>
          ))}
        </div>
      </Transition>
    </div>
  );
};
