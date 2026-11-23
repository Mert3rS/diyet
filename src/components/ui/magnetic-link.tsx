"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useState, type ReactNode, type PointerEvent } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  target?: "_blank";
  rel?: string;
  "aria-label"?: string;
};
export function MagneticLink({ children, className = "", ...props }: Props) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 22 });
  const springY = useSpring(y, { stiffness: 220, damping: 22 });
  const [ripple, setRipple] = useState<{
    x: number;
    y: number;
    key: number;
  } | null>(null);
  function move(event: PointerEvent<HTMLAnchorElement>) {
    if (
      reduce ||
      !window.matchMedia("(hover: hover) and (min-width: 1024px)").matches
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.12);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.15);
  }
  return (
    <motion.a
      {...props}
      className={`magnetic ${className}`}
      style={{ x: springX, y: springY }}
      onPointerMove={move}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onPointerDown={(event) => {
        if (reduce) return;
        const rect = event.currentTarget.getBoundingClientRect();
        setRipple({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          key: event.timeStamp,
        });
      }}
    >
      {children}
      {ripple && (
        <span
          key={ripple.key}
          className="click-ripple"
          style={{ left: ripple.x, top: ripple.y }}
          onAnimationEnd={() => setRipple(null)}
        />
      )}
    </motion.a>
  );
}
