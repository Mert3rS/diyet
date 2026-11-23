"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { Container } from "@/components/ui/container";
import { EditorialImage } from "@/components/ui/editorial-image";
import type { HomeContent } from "@/content/home";
import type { ProcessStep } from "@/types/content";

export function ProcessSection({
  steps,
  copy,
}: {
  steps: ProcessStep[];
  copy: HomeContent["copy"]["process"];
}) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  useMotionValueEvent(scrollYProgress, "change", (value) =>
    setActive(
      Math.min(steps.length - 1, Math.max(0, Math.floor(value * steps.length))),
    ),
  );
  return (
    <section
      ref={ref}
      id="surec"
      className="section process-section dark"
      aria-labelledby="process-title"
    >
      <div className={`process-tint tint-${active}`} aria-hidden="true" />
      <Container className="process-grid">
        <div className="process-sticky">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 id="process-title">
            {copy.title}
            <br />
            <em>{copy.accent}</em>
          </h2>
          <p className="section-description">{copy.description}</p>
          <div className="process-image image-frame">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={`process-image-layer ${index === active ? "active" : ""}`}
                aria-hidden={index !== active}
              >
                <EditorialImage
                  name={step.image}
                  sizes="(max-width: 768px) 90vw, 33vw"
                />
              </div>
            ))}
            <span className="process-image-caption">
              Kendi ritminde, birlikte.
            </span>
          </div>
        </div>
        <div className="process-steps">
          <div className="process-track" aria-hidden="true">
            <motion.div style={{ scaleY: scrollYProgress, originY: 0 }} />
          </div>
          <ol>
            {steps.map((step, index) => (
              <li
                key={step.title}
                className={`process-step ${index === active ? "active" : ""}`}
              >
                <span className="step-number" aria-hidden="true">
                  0{index + 1}
                </span>
                <div>
                  <p className="eyebrow">{step.title}</p>
                  <h3>{step.description}</h3>
                  <p>{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
