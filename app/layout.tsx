import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Redem - 全栈开发者 & AI 研究者",
  description: "专注于构建高性能 Web 应用、AI Agent 系统和 GPU 计算优化",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
