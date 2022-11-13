import { AppProviders } from "@/lib/context/Providers";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./globals.css";
config.autoAddCss = false;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <AppProviders>
        <body className="bg-slate-900 text-slate-50">
          {children}
          <a
            href="/api/auth/logout"
            className="fixed flex items-center justify-center right-4 bottom-4 w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 transition-all "
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
          </a>
        </body>
      </AppProviders>
    </html>
  );
}

export const dynamic = "force-static",
  dynamicParams = true,
  revalidate = 300;
