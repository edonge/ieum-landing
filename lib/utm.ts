"use client";

const KEY = "ieum_utm";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>;

export function captureUtm(): Utm {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const fromUrl: Utm = {};
  UTM_KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) fromUrl[k] = v;
  });
  if (Object.keys(fromUrl).length > 0) {
    sessionStorage.setItem(KEY, JSON.stringify(fromUrl));
    return fromUrl;
  }
  const stored = sessionStorage.getItem(KEY);
  return stored ? (JSON.parse(stored) as Utm) : {};
}

export function getStoredUtm(): Utm {
  if (typeof window === "undefined") return {};
  const stored = sessionStorage.getItem(KEY);
  return stored ? (JSON.parse(stored) as Utm) : {};
}
