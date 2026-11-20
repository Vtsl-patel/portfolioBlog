"use client";

import { useEffect, useState } from "react";

/** Scrollspy: id of the section crossing the viewport middle; null over the hero. */
export function useActiveSection(ids: readonly string[], resetId = "top"): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = [resetId, ...ids]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0 || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id === resetId ? null : entry.target.id);
          }
        }
      },
      // A thin band around the viewport's vertical middle.
      { rootMargin: "-45% 0px -50% 0px" }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, resetId]);

  return active;
}
