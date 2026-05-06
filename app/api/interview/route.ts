import { NextResponse } from "next/server";
import { z } from "zod";
import { getServiceClient } from "@/lib/supabase";

export const runtime = "nodejs";

const schema = z.object({
  waitlist_id: z.string().uuid().optional(),
  problem: z.string().min(1).max(2000),
  current_solution: z.string().min(1).max(2000),
  willingness_to_pay: z.enum(["free_only", "lt_3000", "lt_6000", "lt_10000", "gte_10000"]),
  wants_interview: z.boolean(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const { error } = await supabase.from("interview_responses").insert(parsed.data);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
