import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./globals.css";
config.autoAddCss = false;

import { LayoutProps } from "@/lib/util";
import { Open_Sans } from "@next/font/google";

const font = Open_Sans({});

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html>
      <body className={`bg-white text-black ${font.className}`}>
        {children}
      </body>
    </html>
  );
}
