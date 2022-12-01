import { LayoutProps } from "@/lib/util";
import { faDisplay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AdminLayout({ children }: LayoutProps) {
  return (
    <>
      <div className="fixed top-0 bottom-0 left-0 right-0 z-50 bg-white flex items-center justify-center md:hidden">
        <div className="p-4 flex flex-col items-center gap-2">
          <FontAwesomeIcon
            icon={faDisplay}
            size="3x"
            className="text-neutral-400"
          />
          <h3 className="font-bold size-lg">Switch to Desktop</h3>
          <p className="text-center">
            The admin panel is optimized for desktop viewing. Please open this
            page on a desktop.
          </p>
        </div>
      </div>
      {children}
    </>
  );
}
