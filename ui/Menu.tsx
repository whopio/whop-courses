import { Menu as RMenu, Transition } from "@headlessui/react";
import { FC, Fragment } from "react";

export const Menu: FC<{}> = ({}) => {
  return (
    <RMenu as="div" className="relative">
      <RMenu.Button className="flex gap-3 items-center bg-red-600/20 rounded-full pl-4">
        <span className="text-red-600 font-bold">Error</span>
        <div className="h-10 w-10 animate-pulse bg-red-600 rounded-full" />
      </RMenu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <RMenu.Items className="absolute right-0 mt-2 min-w-[16rem] origin-top-right rounded-lg bg-slate-800 focus:outline-none">
          <RMenu.Item
            as="div"
            className="ui-active:bg-slate-700 py-3 px-5 transition-all rounded-lg"
          >
            <div onClick={() => (window.location.href = "/api/auth/logout")}>
              Logout
            </div>
          </RMenu.Item>
        </RMenu.Items>
      </Transition>
    </RMenu>
  );
};
