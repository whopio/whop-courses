import "./globals.css";

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
