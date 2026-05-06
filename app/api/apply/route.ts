import { NextResponse } from "next/server";
import { z } from "zod";
import { getServiceClient } from "@/lib/supabase";
import { notifyByEmail } from "@/lib/notify";

export const runtime = "nodejs";

// 봇 차단: 사람이 폼 제출하기엔 너무 빠른 시간(ms)
const MIN_DWELL_MS = 1500;

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  contact: z.string().trim().min(1).max(200),
  purpose: z.enum(["send_photos", "tv_easy", "family_record", "curious"]),
  privacy_consent: z.literal(true),
  privacy_consented_at: z.string().datetime(),
  // honeypot — 일반 사용자는 비워두고 봇은 채우는 함정 필드
  hp_company: z.string().max(0).optional().or(z.literal("")),
  // 폼 노출 시각 (ms 단위 timestamp). 너무 빠른 제출 차단용
  loaded_at: z.number().int().positive().optional(),
  posthog_id: z.string().max(200).optional(),
  utm_source: z.string().max(200).optional(),
  utm_medium: z.string().max(200).optional(),
  utm_campaign: z.string().max(200).optional(),
  utm_content: z.string().max(200).optional(),
  utm_term: z.string().max(200).optional(),
  referrer: z.string().max(2000).optional(),
});

function classifyContact(value: string): "email" | "phone" | "other" {
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "email";
  const digits = value.replace(/\D/g, "");
  if (digits.length >= 9 && digits.length <= 15) return "phone";
  return "other";
}

function isAllowedOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  // 서버-서버 호출(브라우저 외)에는 origin 없음 — 일단 허용
  if (!origin) return true;
  const host = req.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  // 1) Origin 검증 (CSRF 1차 방어)
  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // 2) 페이로드 파싱 + 스키마 검증
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  // 3) 봇 차단 — honeypot
  if (parsed.data.hp_company && parsed.data.hp_company.length > 0) {
    // 조용히 성공처럼 응답 (봇이 재시도하지 않게)
    return NextResponse.json({ ok: true });
  }

  // 4) 봇 차단 — 너무 빠른 제출
  if (parsed.data.loaded_at) {
    const dwell = Date.now() - parsed.data.loaded_at;
    if (dwell < MIN_DWELL_MS) {
      return NextResponse.json({ ok: true });
    }
  }

  const supabase = getServiceClient();
  const { error } = await supabase.from("applications").insert({
    name: parsed.data.name,
    contact: parsed.data.contact,
    contact_type: classifyContact(parsed.data.contact),
    purpose: parsed.data.purpose,
    privacy_consent: parsed.data.privacy_consent,
    privacy_consented_at: parsed.data.privacy_consented_at,
    posthog_id: parsed.data.posthog_id,
    utm_source: parsed.data.utm_source,
    utm_medium: parsed.data.utm_medium,
    utm_campaign: parsed.data.utm_campaign,
    utm_content: parsed.data.utm_content,
    utm_term: parsed.data.utm_term,
    referrer: parsed.data.referrer,
  });

  if (error) {
    // DB 내부 메시지 노출 금지 — 일반 에러만 반환
    console.error("[/api/apply] supabase insert failed", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  notifyByEmail({
    subject: `[이음] 새 사전 체험 신청 (${parsed.data.purpose})`,
    text: `이름: ${parsed.data.name}\n연락처: ${parsed.data.contact}\n목적: ${parsed.data.purpose}`,
  });

  return NextResponse.json({ ok: true });
}

// 보안: 허용 메서드 외 차단
export function GET() {
  return NextResponse.json({ error: "method_not_allowed" }, { status: 405 });
}
