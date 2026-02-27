import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Redem714233 - 个人主页",
  description: "项目展示与技术博客",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
