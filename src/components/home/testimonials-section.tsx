"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import { useMediaQuery } from "@/components/ui/use-media-query";
import type { HomeContent } from "@/content/home";
import type { Testimonial } from "@/types/content";

export function TestimonialsSection({
  items,
  copy,
}: {
  items: Testimonial[];
  copy: HomeContent["copy"]["testimonials"];
}) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { amount: 0.35 });
  const running = playing && !reduce && !hovered && !focused && visible;
  useEffect(() => {
    if (!running || items.length < 2) return;
    const interval = setInterval(
      () => setIndex((value) => (value + 1) % items.length),
      6500,
    );
    return () => clearInterval(interval);
  }, [running, items.length]);
  const item = items[index];
  if (!item) return null;
  function step(direction: number) {
    setPlaying(false);
    setIndex((value) => (value + direction + items.length) % items.length);
  }
  return (
    <section
      ref={ref}
      className="section testimonials-section dark"
      aria-labelledby="testimonials-title"
      aria-roledescription="slayt gösterisi"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
    >
      <Container>
        <div className="testimonial-heading">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 id="testimonials-title">
            {copy.title}
            <br />
            <em>{copy.accent}</em>
          </h2>
          <p className="sample-review-note">
            Örnek yorumlar · Gerçek danışan deneyimleri değildir.
          </p>
        </div>
        <motion.div
          className="testimonial-slider"
          drag={reduce ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          dragSnapToOrigin
          onDragEnd={(_, info) => {
            if (Math.abs(info.offset.x) > 45) step(info.offset.x > 0 ? -1 : 1);
          }}
        >
          <Quote
            size={44}
            strokeWidth={1}
            className="quote-icon"
            aria-hidden="true"
          />
          <motion.figure
            key={item.id}
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <blockquote>{item.quote}</blockquote>
            <figcaption>
              <span className="testimonial-avatar">{item.initials}</span>
              <span>
                {item.initials}
                <small>{item.label}</small>
              </span>
            </figcaption>
          </motion.figure>
        </motion.div>
        <div className="slider-controls">
          <button
            type="button"
            className="slider-text-button"
            onClick={() => step(-1)}
          >
            Önceki
          </button>
          <div className="slider-dots">
            {items.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                className={i === index ? "active" : ""}
                aria-label={`${i + 1}. örnek yorumu göster`}
                aria-pressed={i === index}
                onClick={() => {
                  setPlaying(false);
                  setIndex(i);
                }}
              />
            ))}
          </div>
          <button
            type="button"
            className="slider-text-button"
            onClick={() => step(1)}
          >
            Sonraki
          </button>
          {
            <button
              type="button"
              className="icon-button autoplay-toggle"
              aria-label={
                playing
                  ? "Yorumların otomatik geçişini duraklat"
                  : "Yorumların otomatik geçişini başlat"
              }
              onClick={() => setPlaying(!playing)}
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}
            </button>
          }
        </div>
      </Container>
    </section>
  );
}
