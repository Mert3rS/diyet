"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";

export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const reduce = useReducedMotion();
  return (
    <div
      ref={ref}
      className={`${className} reveal ${visible && !reduce ? "is-visible" : ""}`}
    >
      {children}
    </div>
  );
}
