"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { track, getDistinctId, identify } from "@/lib/analytics";
import { getStoredUtm } from "@/lib/utm";

const schema = z.object({
  email: z.string().email("올바른 이메일을 입력해주세요"),
  problem: z.string().min(1, "답변을 입력해주세요"),
  current_solution: z.string().min(1, "답변을 입력해주세요"),
  willingness_to_pay: z.enum(["free_only", "lt_3000", "lt_6000", "lt_10000", "gte_10000"]),
  wants_interview: z.boolean().default(false),
  consent: z.literal(true, { errorMap: () => ({ message: "개인정보 수집 동의가 필요합니다" }) }),
});

type FormValues = z.infer<typeof schema>;

const wtpOptions: { value: FormValues["willingness_to_pay"]; label: string }[] = [
  { value: "free_only", label: "무료라면 쓰겠다" },
  { value: "lt_3000", label: "월 3,000원 이하" },
  { value: "lt_6000", label: "월 6,000원 이하" },
  { value: "lt_10000", label: "월 10,000원 이하" },
  { value: "gte_10000", label: "월 10,000원 이상도 가능" },
];

export function InterviewFlow({ plan }: { plan: "free" | "pro" }) {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { wants_interview: false },
  });

  const onSubmit = async (values: FormValues) => {
    const posthog_id = getDistinctId();
    identify(values.email);

    const utm = getStoredUtm();
    const referrer = typeof document !== "undefined" ? document.referrer || undefined : undefined;

    const waitlistRes = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: values.email,
        plan_selected: plan,
        posthog_id,
        ...utm,
        referrer,
      }),
    });
    const waitlistData = await waitlistRes.json().catch(() => ({}));
    track("waitlist_submitted", { plan_name: plan });

    await fetch("/api/interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        waitlist_id: waitlistData?.id,
        problem: values.problem,
        current_solution: values.current_solution,
        willingness_to_pay: values.willingness_to_pay,
        wants_interview: values.wants_interview,
      }),
    });
    track("interview_completed", { willingness_to_pay: values.willingness_to_pay });
    if (values.wants_interview) track("interview_requested");

    setDone(true);
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-zinc-200 p-8 text-center">
        <div className="text-3xl">💌</div>
        <h2 className="mt-4 text-xl font-bold">감사합니다!</h2>
        <p className="mt-2 text-zinc-600">
          출시 준비가 되면 가장 먼저 알려드릴게요.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-2xl border border-zinc-200 p-8">
      <Field label="이메일" error={errors.email?.message}>
        <input type="email" className="input" placeholder="you@example.com" {...register("email")} />
      </Field>

      <Field label="1. 어떤 문제를 해결하려고 결제까지 진행하셨나요?" error={errors.problem?.message}>
        <textarea rows={3} className="input" {...register("problem")} />
      </Field>

      <Field label="2. 지금은 그 문제를 어떻게 해결하고 계신가요?" error={errors.current_solution?.message}>
        <textarea rows={3} className="input" {...register("current_solution")} />
      </Field>

      <Field label="3. 한 달에 얼마까지 지불할 의향이 있으신가요?" error={errors.willingness_to_pay?.message}>
        <div className="space-y-2">
          {wtpOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value={opt.value} {...register("willingness_to_pay")} />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </Field>

      <label className="flex items-start gap-2 cursor-pointer">
        <input type="checkbox" className="mt-1" {...register("wants_interview")} />
        <span className="text-sm">
          30분 인터뷰에 응할 의향이 있어요. <strong>응답 시 Pro 3개월 무료 이용권 제공</strong>
        </span>
      </label>

      <label className="flex items-start gap-2 cursor-pointer">
        <input type="checkbox" className="mt-1" {...register("consent")} />
        <span className="text-sm text-zinc-600">
          개인정보 수집 및 이용에 동의합니다 (수집 항목: 이메일·인터뷰 응답 / 목적: 출시 알림 및 수요 조사 / 보관: 출시 후 1년).
        </span>
      </label>
      {errors.consent && <p className="text-sm text-red-600">{errors.consent.message}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "제출 중..." : "제출하기"}
      </Button>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #e4e4e7;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          outline: none;
        }
        .input:focus {
          border-color: #4f46e5;
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
