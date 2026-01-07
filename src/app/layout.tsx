import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "허서린의 크리에이터 생활",
  description: "크리에이터로서의 허서린의 ",
  keywords: ["인플루언서 개인사이트", "suhrinhuh", "허서린"],
  icons: {
    icon: "./favicon.ico", // 기본
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <div>{children}</div>
      </body>
    </html>
  );
}
