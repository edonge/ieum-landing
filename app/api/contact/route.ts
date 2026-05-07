import { NextResponse } from "next/server";
import { z } from "zod";
import { getServiceClient } from "@/lib/supabase";
import { notifyByEmail } from "@/lib/notify";

export const runtime = "nodejs";

const MIN_DWELL_MS = 1500;

const schema = z.object({
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(1).max(2000),
  privacy_consent: z.literal(true),
  privacy_consented_at: z.string().datetime(),
  hp_company: z.string().max(0).optional().or(z.literal("")),
  loaded_at: z.number().int().positive().optional(),
  posthog_id: z.string().max(200).optional(),
  utm_source: z.string().max(200).optional(),
  utm_medium: z.string().max(200).optional(),
  utm_campaign: z.string().max(200).optional(),
  utm_content: z.string().max(200).optional(),
  utm_term: z.string().max(200).optional(),
  referrer: z.string().max(2000).optional(),
});

function isAllowedOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
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
  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  // 봇 차단
  if (parsed.data.hp_company && parsed.data.hp_company.length > 0) {
    return NextResponse.json({ ok: true });
  }
  if (parsed.data.loaded_at) {
    const dwell = Date.now() - parsed.data.loaded_at;
    if (dwell < MIN_DWELL_MS) {
      return NextResponse.json({ ok: true });
    }
  }

  const supabase = getServiceClient();
  const { error } = await supabase.from("contacts").insert({
    email: parsed.data.email,
    message: parsed.data.message,
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
    console.error("[/api/contact] supabase insert failed", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }

  // 알림 메일 — replyTo에 문의자 이메일 → 받은 메일에서 답장 누르면 바로 회신 가능
  notifyByEmail({
    subject: `[이음 문의] ${parsed.data.email}`,
    text: `발신: ${parsed.data.email}\n\n${parsed.data.message}`,
    replyTo: parsed.data.email,
  });

  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({ error: "method_not_allowed" }, { status: 405 });
}
