import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import ThemeCustomizer from "@/components/ThemeCustomizer";

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
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        <Header />
        {children}
        <ThemeCustomizer />
      </body>
    </html>
  );
}
