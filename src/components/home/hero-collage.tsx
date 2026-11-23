"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { EditorialImage } from "@/components/ui/editorial-image";
import { useMediaQuery } from "@/components/ui/use-media-query";

export function HeroCollage() {
  const reduce = useReducedMotion();
  const desktop = useMediaQuery("(min-width: 1024px) and (hover: hover)");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scrollOffset = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const [intro, setIntro] = useState(true);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 70, damping: 25 });
  const sy = useSpring(y, { stiffness: 70, damping: 25 });
  const inverseX = useTransform(sx, (value) => value * -0.6);
  const inverseY = useTransform(sy, (value) => value * -0.6);
  const mainY = useTransform(() => sy.get() + scrollOffset.get());
  const smallY = useTransform(() => inverseY.get() - scrollOffset.get() * 0.6);
  const enabled = desktop && !reduce;
  return (
    <div
      ref={ref}
      className="hero-collage"
      onPointerMove={(event) => {
        if (
          reduce ||
          !window.matchMedia("(min-width: 1024px) and (hover: hover)").matches
        )
          return;
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left - rect.width / 2) * 0.035);
        y.set((event.clientY - rect.top - rect.height / 2) * 0.035);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <svg className="hero-blob" viewBox="0 0 600 650" aria-hidden="true">
        <path
          d="M300 15C460-10 590 140 570 310S540 630 340 630 10 530 35 340 110 45 300 15Z"
          fill="currentColor"
        />
      </svg>
      <motion.div
        className="collage-main image-frame"
        style={{ x: enabled ? sx : 0, y: enabled ? mainY : 0 }}
      >
        <EditorialImage
          name="salad"
          priority
          sizes="(max-width: 600px) 80vw, (max-width: 1000px) 65vw, 35vw"
        />
      </motion.div>
      <motion.div
        className="collage-small image-frame"
        style={{ x: enabled ? inverseX : 0, y: enabled ? smallY : 0 }}
      >
        <EditorialImage name="fruit" sizes="(max-width: 600px) 35vw, 18vw" />
      </motion.div>
      <div className="collage-note">
        <span className="note-spark" aria-hidden="true">
          ✳
        </span>
        <span>
          Bir tabaktan
          <br />
          <em>çok daha fazlası.</em>
        </span>
      </div>
      <div className="collage-seal" aria-hidden="true">
        <span>KENDİ RİTMİNDE</span>
        <svg viewBox="0 0 60 60">
          <path d="M30 5v50M5 30h50M12 12l36 36M12 48l36-36" />
        </svg>
        <span>KENDİ DENGENDE</span>
      </div>
      {intro && (
        <div className="intro-ribbon" onAnimationEnd={() => setIntro(false)}>
          <button type="button" onClick={() => setIntro(false)}>
            Animasyonu geç
          </button>
          <span aria-hidden="true">Yeni bir dengeye yer aç.</span>
        </div>
      )}
    </div>
  );
}
