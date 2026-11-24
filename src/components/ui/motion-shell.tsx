"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { siteConfig } from "@/config/site";

const loadFeatures = () =>
  import("./motion-features").then((module) => module.default);

export function MotionShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (
      !siteConfig.smoothScroll ||
      new URLSearchParams(location.search).get("editor") === "1"
    )
      return;
    let dispose: (() => void) | undefined;
    let cancelled = false;
    let enabled = true;
    const media = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    );
    async function sync() {
      dispose?.();
      dispose = undefined;
      if (!media.matches || !enabled) return;
      const { default: Lenis } = await import("lenis");
      if (cancelled || !media.matches || !enabled) return;
      const lenis = new Lenis({
        autoRaf: true,
        anchors: { offset: -110 },
        duration: 0.85,
      });
      dispose = () => lenis.destroy();
    }
    void sync();
    const toggle = (event: Event) => {
      enabled = (event as CustomEvent<boolean>).detail;
      void sync();
    };
    window.addEventListener("smooth-scroll-toggle", toggle);
    media.addEventListener("change", sync);
    return () => {
      cancelled = true;
      media.removeEventListener("change", sync);
      window.removeEventListener("smooth-scroll-toggle", toggle);
      dispose?.();
    };
  }, []);
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
