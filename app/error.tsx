"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      posthog.captureException?.(error);
    }
  }, [error]);

  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-3xl font-bold">문제가 발생했어요</h1>
      <p className="mt-3 text-zinc-600">잠시 후 다시 시도해주세요.</p>
      <button onClick={reset} className="mt-8 underline">
        다시 시도
      </button>
    </main>
  );
}
