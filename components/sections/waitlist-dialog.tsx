"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: "free" | "pro";
};

export function WaitlistDialog({ open, onOpenChange, plan }: Props) {
  const router = useRouter();
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-3xl">🌱</div>
        <h2 className="mt-4 text-xl font-bold">이음은 아직 베타 준비 중이에요</h2>
        <p className="mt-3 text-zinc-600">
          출시 알림을 신청하시면 정식 오픈 시 가장 먼저 안내드릴게요.
        </p>
        <Button
          size="lg"
          className="mt-6 w-full"
          onClick={() => router.push(`/checkout/success?plan=${plan}`)}
        >
          신청하러 가기
        </Button>
        <button
          className="mt-3 text-sm text-zinc-500 underline"
          onClick={() => onOpenChange(false)}
        >
          나중에 할게요
        </button>
      </div>
    </div>
  );
}
