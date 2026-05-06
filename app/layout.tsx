import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PostHogProvider } from "@/lib/posthog-provider";
import { Header } from "@/components/layout/header";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "이음 — 가족의 하루를 잇다",
    template: "%s | 이음",
  },
  description:
    "사진 한 장, 영상 한 컷이 부모님 TV로. 이음의 무료 사전 체험을 신청해보세요.",
  openGraph: {
    title: "이음 — 가족의 하루를 잇다",
    description:
      "사진 한 장, 영상 한 컷이 부모님 TV로. 이음의 무료 사전 체험을 신청해보세요.",
    locale: "ko_KR",
    type: "website",
    siteName: "이음",
  },
  twitter: {
    card: "summary_large_image",
    title: "이음 — 가족의 하루를 잇다",
    description:
      "사진 한 장, 영상 한 컷이 부모님 TV로. 이음의 무료 사전 체험을 신청해보세요.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* Pretendard 폰트 CDN과 미리 핸드셰이크 (LCP 단축) */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
      </head>
      <body>
        <PostHogProvider>
          <Header />
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
