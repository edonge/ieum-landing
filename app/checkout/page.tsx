"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

function CheckoutInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "pro";

  useEffect(() => {
    track("checkout_viewed", { plan_name: plan });
  }, [plan]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    track("checkout_submitted", { plan_name: plan });
    router.push(`/checkout/success?plan=${plan}`);
  };

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-bold">결제</h1>
        <p className="mt-2 text-zinc-600">Pro 플랜 — ₩5,900 / 월</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          {/* 약한 페이크도어: 카드 입력란 없음, 결제하기 버튼만 */}
          <div className="rounded-2xl border border-zinc-200 p-6">
            <div className="text-sm text-zinc-500">결제 수단</div>
            <div className="mt-2 text-zinc-800">간편결제 / 카드 결제</div>
          </div>

          <div className="rounded-2xl border border-zinc-200 p-6">
            <div className="flex justify-between">
              <span>월 구독료</span>
              <span className="font-semibold">₩5,900</span>
            </div>
            <div className="mt-2 flex justify-between text-zinc-500">
              <span>부가세</span>
              <span>포함</span>
            </div>
            <div className="mt-4 border-t border-zinc-200 pt-4 flex justify-between text-lg font-bold">
              <span>총 결제 금액</span>
              <span>₩5,900</span>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full">
            ₩5,900 결제하기
          </Button>

          <p className="text-center text-xs text-zinc-500">
            결제 진행 시{" "}
            <a href="/legal/terms" className="underline">이용약관</a> 및{" "}
            <a href="/legal/privacy" className="underline">개인정보처리방침</a>에 동의하게 됩니다.
          </p>
        </form>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutInner />
    </Suspense>
  );
}
