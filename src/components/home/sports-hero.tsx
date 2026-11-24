"use client";

import { SportsImage } from "@/components/ui/sports-image";
import type { SportsHomeContent } from "@/content/sports-defaults";
import { AnimatePresence, m as motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  MoveDown,
  CalendarDays,
} from "lucide-react";
import {
  AuroraBackground,
  Marquee,
  ProgressRing,
  SplitText,
  Tilt,
} from "@/components/ui/sports-motion";
import { useMediaQuery } from "@/components/ui/use-media-query";
import { openSportsService } from "./sports-interactions";

type HeroContent = Pick<
  SportsHomeContent,
  "hero" | "slides" | "dashboard" | "sections" | "branches"
>;

function PerformanceBoard({
  paused,
  sportsDashboard,
}: {
  paused: boolean;
  sportsDashboard: SportsHomeContent["dashboard"];
}) {
  return (
    <Tilt className={`performance-board ${paused ? "is-paused" : ""}`}>
      <div className="board-heading">
        <span className="board-icon">
          <Activity size={19} />
        </span>
        <div>
          <span className="eyebrow" data-sports-field="dashboard.eyebrow">
            {sportsDashboard.eyebrow}
          </span>
          <h3 data-sports-field="dashboard.title">{sportsDashboard.title}</h3>
        </div>
        <span className="board-spark" aria-hidden="true">
          ✦
        </span>
      </div>
      <p className="board-disclaimer" data-sports-field="dashboard.disclaimer">
        {sportsDashboard.disclaimer}
      </p>
      <div
        className="board-rings"
        tabIndex={0}
        role="group"
        aria-label="Örnek denge göstergeleri, yatay kaydırılabilir"
      >
        {sportsDashboard.rings.map((label, index) => (
          <ProgressRing
            key={label}
            label={label}
            index={index}
            field={`dashboard.rings.${index}.label`}
          />
        ))}
      </div>
      <div className="board-timeline">
        <p>
          <span data-sports-field="dashboard.timelineTitle">
            {sportsDashboard.timelineTitle}
          </span>{" "}
          <span>Örnek</span>
        </p>
        <ol
          tabIndex={0}
          aria-label="Örnek maç günü adımları, yatay kaydırılabilir"
        >
          {sportsDashboard.timeline.map((item, index) => (
            <li
              key={item}
              data-sports-field={`dashboard.timeline.${index}.label`}
              style={{ "--step": index } as CSSProperties}
            >
              <i aria-hidden="true" />
              {item}
            </li>
          ))}
        </ol>
      </div>
      <div className="board-ticker">
        <div>
          {[...sportsDashboard.chips, ...sportsDashboard.chips].map(
            (item, index) => (
              <span
                key={`${item}-${index}`}
                data-sports-field={`dashboard.chips.${index % sportsDashboard.chips.length}.label`}
                aria-hidden={
                  index >= sportsDashboard.chips.length ? true : undefined
                }
              >
                {item}
              </span>
            ),
          )}
        </div>
      </div>
    </Tilt>
  );
}

export function SportsHero(props: {
  content: HeroContent;
  editorMode?: boolean;
}) {
  if (!props.content.slides.length) return null;
  return <HeroSlider {...props} />;
}
function HeroSlider({
  content,
  editorMode = false,
}: {
  content: HeroContent;
  editorMode?: boolean;
}) {
  const sportsSlides = content.slides;
  const sportsBranches = content.branches;
  const [index, setIndex] = useState(0);
  const [hasChanged, setHasChanged] = useState(false);
  const [playing, setPlaying] = useState(content.hero.autoplay && !editorMode);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const reducedMotion = useReducedMotion();
  const touchStart = useRef<number | null>(null);
  const slide = sportsSlides[index % sportsSlides.length];
  const running = playing && !hovered && !focused && !hidden && !reduce;
  const region = useRef<HTMLElement>(null);
  const finePointer = useMediaQuery(
    "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  );

  useEffect(() => {
    const change = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setHasChanged(true);
      setIndex((current) => (current + 1) % sportsSlides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [running, index, sportsSlides.length]);

  const stop = () => {
    setPlaying(false);
  };
  const choose = (next: number) => {
    stop();
    setHasChanged(true);
    setIndex((next + sportsSlides.length) % sportsSlides.length);
  };
  return (
    <section
      ref={region}
      className={`sports-hero ${running ? "is-playing" : "is-paused"}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Beslenme danışmanlığı hizmetleri"
      data-slide={index + 1}
      data-autoplay={running ? "playing" : "paused"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          choose(index + (event.key === "ArrowRight" ? 1 : -1));
        }
      }}
      onPointerDown={(event) => {
        if (event.pointerType === "touch") touchStart.current = event.clientX;
      }}
      onPointerUp={(event) => {
        if (event.pointerType === "touch" && touchStart.current !== null) {
          const delta = touchStart.current - event.clientX;
          if (Math.abs(delta) > 45) choose(index + (delta > 0 ? 1 : -1));
          touchStart.current = null;
        }
      }}
      onPointerMove={
        finePointer
          ? (event) => {
              const box = event.currentTarget.getBoundingClientRect();
              event.currentTarget.style.setProperty(
                "--parallax-x",
                `${(event.clientX / box.width - 0.5) * 10}px`,
              );
              event.currentTarget.style.setProperty(
                "--parallax-y",
                `${((event.clientY - box.top) / box.height - 0.5) * 8}px`,
              );
            }
          : undefined
      }
    >
      <AuroraBackground />
      <div className="hero-visual" aria-hidden="true">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={`${index}-${slide.visual}`}
            data-sports-field={`slides.${index}.photo`}
            className={`hero-photo photo-${slide.visual}`}
            initial={
              reducedMotion
                ? { opacity: 0 }
                : { clipPath: "polygon(100% 0, 100% 0, 100% 100%, 70% 100%)" }
            }
            animate={{
              opacity: 1,
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: editorMode ? 0 : reducedMotion ? 0.15 : 0.8,
            }}
          >
            {slide.photo || slide.visual === "running" ? (
              <SportsImage
                name="running"
                photo={slide.photo}
                decorative
                eager
                className="hero-sports-image"
                sizes="(max-width: 700px) 85vw, 65vw"
              />
            ) : slide.visual === "track" ? (
              <svg
                className="track-composition"
                viewBox="0 0 700 800"
                preserveAspectRatio="xMidYMid slice"
              >
                <g fill="none" stroke="currentColor" strokeWidth="3">
                  {[0, 1, 2, 3, 4, 5].map((lane) => (
                    <path
                      key={lane}
                      d={`M${80 + lane * 55} 850V350a${200 + lane * 55} ${200 + lane * 55} 0 0 1 ${400 + lane * 110} 0v500`}
                    />
                  ))}
                </g>
                <text
                  x="110"
                  y="650"
                  fill="currentColor"
                  fontSize="180"
                  fontWeight="800"
                >
                  GT
                </text>
              </svg>
            ) : (
              <SportsImage
                name={slide.visual === "food" ? "salad" : "preparation"}
                decorative
                className="hero-sports-image"
                sizes="(max-width: 700px) 100vw, 65vw"
              />
            )}
          </motion.div>
        </AnimatePresence>
        <div className="hero-photo-overlay" />
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <span className="visual-caption">
          <span data-sports-field={`slides.${index}.label`}>{slide.label}</span>
          <span data-sports-field="hero.visualCaption">
            {content.hero.visualCaption}
          </span>
        </span>
      </div>
      <div className="container hero-main">
        <div className="hero-copy">
          <div className="hero-overline">
            <span className="hero-line" />
            <h1 data-sports-field="hero.headline">{content.hero.headline}</h1>
          </div>
          <div
            className="hero-slide-content"
            aria-live={running ? "off" : "polite"}
            aria-atomic="true"
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={index}
                role="group"
                aria-roledescription="slayt"
                aria-label={`${index + 1} / ${sportsSlides.length}`}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: editorMode ? 0 : reducedMotion ? 0.1 : 0.18,
                }}
              >
                <p className="hero-kicker">
                  <span>
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(sportsSlides.length).padStart(2, "0")}
                  </span>
                  <span data-sports-field={`slides.${index}.kicker`}>
                    {slide.kicker}
                  </span>
                </p>
                <h2>
                  <span data-sports-field={`slides.${index}.first`}>
                    {editorMode ? (
                      slide.first
                    ) : (
                      <SplitText text={slide.first} reveal={hasChanged} />
                    )}
                  </span>
                  <br />
                  <span className="hero-gradient">
                    <span data-sports-field={`slides.${index}.accent`}>
                      {editorMode ? (
                        slide.accent
                      ) : (
                        <SplitText text={slide.accent} reveal={hasChanged} />
                      )}
                    </span>
                  </span>
                </h2>
                <p
                  className="hero-description"
                  data-sports-field={`slides.${index}.description`}
                >
                  {slide.description}
                </p>
                <div className="hero-ctas">
                  <a
                    className="button button-light"
                    href="#hizmetler"
                    onClick={() => {
                      stop();
                      openSportsService(slide.service);
                    }}
                  >
                    <span data-sports-field="hero.primaryLabel">
                      {content.hero.primaryLabel}
                    </span>
                  </a>
                  <a
                    className="button button-glass"
                    href="#iletisim"
                    onClick={stop}
                  >
                    <CalendarDays size={17} />
                    <span data-sports-field="hero.secondaryLabel">
                      {content.hero.secondaryLabel}
                    </span>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="hero-small-note">
            <span aria-hidden="true">✳</span>
            <span data-sports-field="hero.note">{content.hero.note}</span>
          </p>
        </div>
        {content.sections.dashboard && (
          <PerformanceBoard
            paused={!running}
            sportsDashboard={content.dashboard}
          />
        )}
      </div>
      <div className="container hero-bottom">
        <div className="hero-slider-controls">
          <div className="slide-tabs" aria-label="Slayt seçimi">
            {sportsSlides.map((item, tab) => (
              <button
                key={`${item.service}-${tab}`}
                type="button"
                aria-label={`${String(tab + 1).padStart(2, "0")} · ${tab + 1}. slayt: ${item.kicker}`}
                aria-pressed={tab === index}
                onClick={() => choose(tab)}
              >
                <span>{String(tab + 1).padStart(2, "0")}</span>
                <i>
                  <b
                    key={`${index}-${playing}-${hovered}-${focused}`}
                    className={
                      index === tab && running ? "progress-running" : ""
                    }
                  />
                </i>
              </button>
            ))}
          </div>
          <div className="slider-buttons">
            <button
              className="icon-button"
              type="button"
              aria-label={
                playing && !reduce ? "Slaytları duraklat" : "Slaytları oynat"
              }
              onClick={() => {
                if (playing) stop();
                else if (!reduce) {
                  setPlaying(true);
                }
              }}
              disabled={reduce || editorMode}
            >
              {playing && !reduce ? <Pause size={17} /> : <Play size={17} />}
            </button>
            <button
              className="icon-button"
              type="button"
              aria-label="Önceki slayt"
              onClick={() => choose(index - 1)}
            >
              <ChevronLeft size={19} />
            </button>
            <button
              className="icon-button"
              type="button"
              aria-label="Sonraki slayt"
              onClick={() => choose(index + 1)}
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </div>
        <a href="#kimler-icin" className="scroll-cue" onClick={stop}>
          <MoveDown size={17} />
          <span data-sports-field="hero.scrollLabel">
            {content.hero.scrollLabel}
          </span>
        </a>
      </div>
      {content.sections.branches && (
        <Marquee items={sportsBranches} fieldPrefix="branches" />
      )}
      <svg
        className="hero-wave"
        viewBox="0 0 1440 32"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 18Q360 52 720 18T1440 18V32H0Z" />
      </svg>
    </section>
  );
}
