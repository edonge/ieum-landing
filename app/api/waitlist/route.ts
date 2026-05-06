import { NextResponse } from "next/server";
import { z } from "zod";
import { getServiceClient } from "@/lib/supabase";
import { notifyByEmail } from "@/lib/notify";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email(),
  plan_selected: z.enum(["free", "pro"]),
  posthog_id: z.string().optional(),
  utm_source: z.string().max(200).optional(),
  utm_medium: z.string().max(200).optional(),
  utm_campaign: z.string().max(200).optional(),
  utm_content: z.string().max(200).optional(),
  utm_term: z.string().max(200).optional(),
  referrer: z.string().max(2000).optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("waitlist")
    .upsert(
      {
        email: parsed.data.email,
        plan_selected: parsed.data.plan_selected,
        posthog_id: parsed.data.posthog_id,
        utm_source: parsed.data.utm_source,
        utm_medium: parsed.data.utm_medium,
        utm_campaign: parsed.data.utm_campaign,
        utm_content: parsed.data.utm_content,
        utm_term: parsed.data.utm_term,
        referrer: parsed.data.referrer,
      },
      { onConflict: "email" }
    )
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  notifyByEmail({
    subject: `[이음] 새 waitlist 가입 (${parsed.data.plan_selected})`,
    text: `${parsed.data.email} — plan: ${parsed.data.plan_selected}`,
  });

  return NextResponse.json({ id: data.id });
}
