import type { Metadata } from "next";
import "./globals.css";
import { PostHogProvider } from "@/lib/posthog-provider";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "이음 - 사람과 사람을 잇다",
  description: "이음의 베타 출시를 가장 먼저 만나보세요.",
  openGraph: {
    title: "이음",
    description: "이음의 베타 출시를 가장 먼저 만나보세요.",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <PostHogProvider>
          <Header />
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
