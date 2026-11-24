"use client";

import { m as motion, useReducedMotion } from "motion/react";
import { useRef, type ReactNode, type CSSProperties } from "react";
import { useMediaQuery } from "./use-media-query";

export function GradientText({ children }: { children: ReactNode }) {
  return <span className="gradient-text">{children}</span>;
}

export function SplitText({
  text,
  reveal = true,
}: {
  text: string;
  reveal?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <span className="split-text">
      <span className="sr-only">{text}</span>
      {text.split(" ").map((word, index) => (
        <span className="word-mask" key={`${word}-${index}`} aria-hidden="true">
          <motion.span
            initial={reduce || !reveal ? false : { y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.55, delay: index * 0.045 }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Tilt({
  children,
  className = "",
  row,
}: {
  children: ReactNode;
  className?: string;
  row?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useMediaQuery(
    "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  );
  return (
    <div
      ref={ref}
      data-sports-row={row}
      className={`tilt-card ${className}`}
      onPointerMove={
        enabled
          ? (event) => {
              const box = event.currentTarget.getBoundingClientRect();
              const x = (event.clientX - box.left) / box.width;
              const y = (event.clientY - box.top) / box.height;
              event.currentTarget.style.setProperty(
                "--tilt-x",
                `${(0.5 - y) * 5}deg`,
              );
              event.currentTarget.style.setProperty(
                "--tilt-y",
                `${(x - 0.5) * 5}deg`,
              );
              event.currentTarget.style.setProperty("--glow-x", `${x * 100}%`);
              event.currentTarget.style.setProperty("--glow-y", `${y * 100}%`);
            }
          : undefined
      }
      onPointerLeave={() => {
        ref.current?.style.setProperty("--tilt-x", "0deg");
        ref.current?.style.setProperty("--tilt-y", "0deg");
      }}
    >
      {children}
    </div>
  );
}

export function Magnetic({
  children,
  href,
  className = "",
}: {
  children: ReactNode;
  href: string;
  className?: string;
}) {
  const enabled = useMediaQuery(
    "(min-width: 1024px) and (hover: hover) and (prefers-reduced-motion: no-preference)",
  );
  return (
    <a
      href={href}
      className={`button magnetic ${className}`}
      onPointerMove={
        enabled
          ? (event) => {
              const box = event.currentTarget.getBoundingClientRect();
              event.currentTarget.style.transform = `translate(${(event.clientX - box.left - box.width / 2) * 0.08}px, ${(event.clientY - box.top - box.height / 2) * 0.1}px)`;
            }
          : undefined
      }
      onPointerLeave={(event) => {
        event.currentTarget.style.transform = "";
      }}
    >
      {children}
    </a>
  );
}

export function AuroraBackground() {
  return (
    <div className="aurora-background" aria-hidden="true">
      <i />
      <i />
      <div className="hero-grid" />
    </div>
  );
}

export function ProgressRing({
  label,
  index,
  field,
}: {
  label: string;
  index: number;
  field?: string;
}) {
  return (
    <div
      className="progress-ring"
      style={{ "--ring-index": index } as CSSProperties}
    >
      <div className="ring-drawing" aria-hidden="true">
        <svg viewBox="0 0 64 64">
          <circle className="ring-track" cx="32" cy="32" r="27" />
          <circle
            className="ring-fill"
            cx="32"
            cy="32"
            r="27"
            strokeDasharray={`${125 + index * 12} 170`}
          />
        </svg>
        <span className="ring-symbol">{["↗", "≈", "✦"][index]}</span>
      </div>
      <span data-sports-field={field}>{label}</span>
    </div>
  );
}

export function MaskImage({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`mask-image ${className}`}
      initial={false}
      whileInView={
        reduce
          ? {}
          : {
              clipPath: [
                "inset(8% 0% 8% 0% round 2rem)",
                "inset(0% 0% 0% 0% round 2rem)",
              ],
            }
      }
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
    >
      {children}
    </motion.div>
  );
}

export function Marquee({
  items,
  fieldPrefix,
}: {
  items: readonly string[];
  fieldPrefix?: string;
}) {
  return (
    <div className="sport-marquee" aria-label="Spor branşları">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div
            className="marquee-copy"
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
          >
            {items.map((item, index) => (
              <span key={item}>
                <span
                  data-sports-field={
                    fieldPrefix ? `${fieldPrefix}.${index}.label` : undefined
                  }
                >
                  {item}
                </span>
                <i aria-hidden="true">✦</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
