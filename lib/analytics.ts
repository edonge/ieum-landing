"use client";

import posthog from "posthog-js";

export type EventName =
  | "landing_viewed"
  | "section_viewed"
  | "cta_clicked"
  | "apply_viewed"
  | "pricing_viewed"
  | "plan_selected"
  | "checkout_viewed"
  | "checkout_submitted"
  | "waitlist_submitted"
  | "interview_completed"
  | "interview_requested";

export function track(event: EventName, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  posthog.capture(event, properties);
}

export function identify(distinctId: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  posthog.identify(distinctId, properties);
}

export function getDistinctId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return posthog.get_distinct_id();
}
