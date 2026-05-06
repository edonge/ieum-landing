"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { InterviewFlow } from "@/components/sections/interview-flow";

function SuccessInner() {
  const searchParams = useSearchParams();
  const plan = (searchParams.get("plan") as "free" | "pro") || "pro";

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-zinc-200 p-8 text-center">
          <div className="text-3xl">🌱</div>
          <h1 className="mt-4 text-2xl font-bold">이음은 아직 베타 준비 중이에요</h1>
          <p className="mt-3 text-zinc-600">
            지금 신청하시면 정식 출시 때 가장 먼저 알려드릴게요.<br />
            짧은 인터뷰에 응해주시면 <strong>Pro 3개월 무료 이용권</strong>을 드립니다.
          </p>
        </div>

        <div className="mt-8">
          <InterviewFlow plan={plan} />
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessInner />
    </Suspense>
  );
}
