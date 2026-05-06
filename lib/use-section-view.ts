"use client";

import { useEffect, useRef } from "react";
import { track } from "./analytics";

export function useSectionView<T extends HTMLElement = HTMLElement>(sectionName: string) {
  const ref = useRef<T | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !fired.current) {
            fired.current = true;
            track("section_viewed", { section_name: sectionName });
            obs.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [sectionName]);

  return ref;
}
