"use client";

import { MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { siteConfig } from "@/config/site";

export function MotionShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!siteConfig.smoothScroll) return;
    let dispose: (() => void) | undefined;
    let cancelled = false;
    const media = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    );
    async function sync() {
      dispose?.();
      dispose = undefined;
      if (!media.matches) return;
      const { default: Lenis } = await import("lenis");
      if (cancelled || !media.matches) return;
      const lenis = new Lenis({
        autoRaf: true,
        anchors: { offset: -110 },
        duration: 0.85,
      });
      dispose = () => lenis.destroy();
    }
    void sync();
    media.addEventListener("change", sync);
    return () => {
      cancelled = true;
      media.removeEventListener("change", sync);
      dispose?.();
    };
  }, []);
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
