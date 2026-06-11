import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { FAB } from "@/components/layout/FAB";
import { MusicPlayer } from "@/components/music/MusicPlayerLoader";

/* Noto Serif SC — self-hosted subset woff2 (eliminates Google Fonts CDN) */
const notoSerifSC = localFont({
  variable: "--font-serif",
  src: [
    {
      path: "../../public/fonts/NotoSerifSC-Regular.subset.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/NotoSerifSC-Bold.subset.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://loongblog.fun"),
  title: {
    default: "Loong·Blog | ThriveX",
    template: "%s | Loong·Blog",
  },
  description:
    "Loong·Blog — 业余前端的技术博客与生活记录",
  keywords: ["个人博客", "设计", "技术", "前端", "Next.js"],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "Loong·Blog",
    images: ["/og-default.png"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      data-theme="dark"
      className={`${notoSerifSC.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Inline script to prevent FOUC: read theme before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('thrivex-theme');
                  if (!t) t = window.matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark';
                  document.documentElement.setAttribute('data-theme', t);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <Providers>
          <Header />
          {children}
          <FAB />
          <MusicPlayer />
        </Providers>
      </body>
    </html>
  );
}
