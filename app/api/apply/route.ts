import { NextResponse } from "next/server";
import { z } from "zod";
import { getServiceClient } from "@/lib/supabase";
import { notifyByEmail } from "@/lib/notify";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  contact: z.string().trim().min(1).max(200),
  purpose: z.enum(["send_photos", "tv_easy", "family_record", "curious"]),
  privacy_consent: z.literal(true),
  privacy_consented_at: z.string().datetime(),
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

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  notifyByEmail({
    subject: `[이음] 새 사전 체험 신청 (${parsed.data.purpose})`,
    text: `이름: ${parsed.data.name}\n연락처: ${parsed.data.contact}\n목적: ${parsed.data.purpose}`,
  });

  return NextResponse.json({ ok: true });
}
