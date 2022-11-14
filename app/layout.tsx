import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./globals.css";
config.autoAddCss = false;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="bg-slate-900 text-slate-50">{children}</body>
    </html>
  );
}

export const dynamic = "force-static",
  dynamicParams = true,
  revalidate = 300;
