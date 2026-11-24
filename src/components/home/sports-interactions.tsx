"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m as motion, useInView } from "motion/react";
import { SportsImage } from "@/components/ui/sports-image";
import type { SportsHomeContent, SportsCopy } from "@/content/sports-defaults";
import {
  Activity,
  Check,
  ChevronDown,
  Footprints,
  Heart,
  Mic2,
  Pause,
  Play,
  Sprout,
  Trophy,
  Users,
  Utensils,
  MessageCircle,
  Quote,
} from "lucide-react";
import { Tilt } from "@/components/ui/sports-motion";
import { useMediaQuery } from "@/components/ui/use-media-query";

const icons = {
  activity: Activity,
  utensils: Utensils,
  users: Users,
  mic: Mic2,
  trophy: Trophy,
  sprout: Sprout,
  footprints: Footprints,
  heart: Heart,
};

export function openSportsService(slug: string, message?: string) {
  const target = document.getElementById(`hizmet-${slug}`);
  const details = target?.querySelector("details");
  if (details) details.open = true;
  if (message)
    window.dispatchEvent(
      new CustomEvent("contact-interest", { detail: message }),
    );
  // Wait for the anchor's native jump, then place the selected service in view.
  window.setTimeout(
    () =>
      target?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      }),
    40,
  );
}

export function AudienceCards({
  items: sportsAudiences,
}: {
  items: SportsHomeContent["audiences"];
}) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="audience-grid">
      {sportsAudiences.map((item, index) => {
        const Icon = icons[item.icon as keyof typeof icons] ?? Activity;
        return (
          <Tilt
            key={item.title}
            row={`audiences.${index}`}
            className={`audience-card ${index === 0 ? "featured" : ""} ${selected === index ? "is-selected" : ""}`}
          >
            <button
              type="button"
              className="audience-toggle"
              aria-expanded={selected === index}
              aria-controls={`audience-${index}`}
              onClick={() => setSelected(selected === index ? null : index)}
            >
              <span className="audience-icon">
                <Icon size={25} strokeWidth={1.5} />
              </span>
              <span className="audience-subtitle">{item.subtitle}</span>
              <span className="audience-title">{item.title}</span>
              <span className="audience-more">
                <ChevronDown size={18} />
              </span>
            </button>
            <div className="audience-description" id={`audience-${index}`}>
              <p>{item.description}</p>
              <a
                href="#hizmetler"
                onClick={() => openSportsService(item.service, item.message)}
              >
                Sana uygun yaklaşımı keşfet
              </a>
            </div>
          </Tilt>
        );
      })}
    </div>
  );
}

export function ServiceBlocks({
  items: sportsServices,
}: {
  items: SportsHomeContent["services"];
}) {
  return (
    <div className="service-list">
      {sportsServices.map((item, index) => {
        const Icon = icons[item.icon as keyof typeof icons] ?? Activity;
        return (
          <article
            id={`hizmet-${item.slug}`}
            className="service-block"
            data-sports-row={`services.${index}`}
            key={item.slug}
          >
            <div className="service-symbol">
              <Icon size={30} strokeWidth={1.4} />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className="service-main">
              <p className="eyebrow">{item.tag}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <details className="scope-accordion">
                <summary>
                  Program kapsamı
                  <ChevronDown size={18} />
                </summary>
                <div className="accordion-body">
                  <ul>
                    {item.scope.map((line) => (
                      <li key={line}>
                        <Check size={16} />
                        {line}
                      </li>
                    ))}
                  </ul>
                  <p>
                    <strong>İlk görüşme</strong>
                    {item.note}
                  </p>
                  <a
                    href="#iletisim"
                    className="text-link"
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("contact-interest", {
                          detail: `${item.title} hakkında bilgi almak istiyorum.`,
                        }),
                      )
                    }
                  >
                    Bu hizmet hakkında konuşalım
                  </a>
                </div>
              </details>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function StoryStep({
  item,
  index,
  onActive,
}: {
  item: SportsHomeContent["method"][number];
  index: number;
  onActive: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.55 });
  useEffect(() => {
    if (visible) onActive(index);
  }, [visible, index, onActive]);
  return (
    <div ref={ref} className="story-step" data-sports-row={`method.${index}`}>
      <span className="eyebrow">{item.label}</span>
      <h3>{item.word}</h3>
      <p>{item.description}</p>
      <span className="story-step-label">
        {String(index + 1).padStart(2, "0")} / {item.title}
      </span>
    </div>
  );
}

export function StickyStory({
  items: sportsMethod,
  copy,
}: {
  items: SportsHomeContent["method"];
  copy: SportsCopy["method"];
}) {
  const [active, setActive] = useState(0);
  return (
    <section id="sistem" className="method-section dark" data-pillar={active}>
      <div className="container method-grid">
        <div className="method-sticky">
          <p className="eyebrow" data-sports-field="copy.method.eyebrow">
            {copy.eyebrow}
          </p>
          <h2>
            <span data-sports-field="copy.method.title">{copy.title}</span>
            <br />
            <span
              className="gradient-text"
              data-sports-field="copy.method.accent"
            >
              {copy.accent}
            </span>
          </h2>
          <p data-sports-field="copy.method.description">{copy.description}</p>
          <ol className="method-progress">
            {sportsMethod.map((item, index) => (
              <li key={item.title} className={index === active ? "active" : ""}>
                <a
                  href={`#sistem-adim-${index}`}
                  aria-current={index === active ? "step" : undefined}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
          <div className="method-emblem" aria-hidden="true">
            ✳<span>SENİN RİTMİNDE</span>
          </div>
        </div>
        <div className="story-steps">
          {sportsMethod.map((item, index) => (
            <div id={`sistem-adim-${index}`} key={item.title}>
              <StoryStep item={item} index={index} onActive={setActive} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const categories = ["Tümü", "Ana yemek", "Tatlı", "Tuzlu"] as const;
export function RecipeGrid({
  items: sportsRecipes,
}: {
  items: SportsHomeContent["recipes"];
}) {
  const [category, setCategory] = useState<string>("Tümü");
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const recipes = sportsRecipes.filter(
    (item) => category === "Tümü" || item.category === category,
  );
  return (
    <>
      <div className="recipe-filters" aria-label="Tarif kategorileri">
        {categories.map((item) => (
          <button
            type="button"
            key={item}
            aria-pressed={item === category}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">
        {recipes.length} örnek tarif gösteriliyor.
      </p>
      <motion.div className="recipe-grid" layout={!reduce}>
        <AnimatePresence initial={false} mode="popLayout">
          {recipes.map((item) => (
            <motion.article
              key={item.title}
              className="recipe-card"
              data-sports-row={`recipes.${sportsRecipes.indexOf(item)}`}
              layout={!reduce}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.25 }}
            >
              <div className="recipe-image">
                <SportsImage
                  name={item.image}
                  photo={item.photo}
                  field={`recipes.${sportsRecipes.indexOf(item)}.photo`}
                  sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                />
                <span className="soon-badge">Yakında</span>
              </div>
              <div className="recipe-copy">
                <div>
                  <span>{item.category}</span>
                  <span>{item.time}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

export function SportsTestimonials({
  items: sportsTestimonials,
  copy,
}: {
  items: SportsHomeContent["testimonials"];
  copy: SportsCopy["testimonials"];
}) {
  const [playing, setPlaying] = useState(true);
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const track = useRef<HTMLDivElement>(null);
  const touching = useRef<number | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!playing || reduce || hovered || focused) return;
    const timer = window.setInterval(() => {
      const node = track.current;
      if (!node) return;
      const max = node.scrollWidth - node.clientWidth;
      node.scrollTo({
        left:
          node.scrollLeft >= max - 5 ? 0 : node.scrollLeft + node.clientWidth,
        behavior: "smooth",
      });
    }, 6000);
    return () => window.clearInterval(timer);
  }, [playing, reduce, hovered, focused]);
  return (
    <section className="testimonials-section dark">
      <div className="container">
        <div className="section-heading horizontal">
          <div>
            <p
              className="eyebrow"
              data-sports-field="copy.testimonials.eyebrow"
            >
              {copy.eyebrow}
            </p>
            <h2>
              <span data-sports-field="copy.testimonials.title">
                {copy.title}
              </span>
              <br />
              <span
                className="gradient-text"
                data-sports-field="copy.testimonials.accent"
              >
                {copy.accent}
              </span>
            </h2>
          </div>
          <div>
            <p data-sports-field="copy.testimonials.description">
              {copy.description}
            </p>
            <button
              className="button button-glass"
              type="button"
              disabled={reduce}
              onClick={() => setPlaying(!playing)}
            >
              {playing && !reduce ? <Pause size={16} /> : <Play size={16} />}
              {playing && !reduce ? "Yorumları duraklat" : "Yorumları oynat"}
            </button>
          </div>
        </div>
        <div
          className="testimonial-track"
          ref={track}
          role="region"
          aria-label="Örnek danışan yorumları"
          tabIndex={0}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              setPlaying(false);
              track.current?.scrollBy({
                left:
                  (event.key === "ArrowRight" ? 1 : -1) *
                  (track.current?.clientWidth ?? 300),
                behavior: reduce ? "instant" : "smooth",
              });
            }
          }}
          onPointerDown={(event) => {
            setPlaying(false);
            touching.current = event.clientX;
          }}
          onPointerUp={(event) => {
            if (touching.current !== null && event.pointerType === "mouse")
              track.current?.scrollBy({
                left: touching.current - event.clientX,
                behavior: "smooth",
              });
            touching.current = null;
          }}
        >
          {sportsTestimonials.map((item, index) => (
            <article
              className="testimonial-card"
              data-sports-row={`testimonials.${index}`}
              key={item.initials}
            >
              <Quote size={30} strokeWidth={1.3} />
              <blockquote>{item.quote}</blockquote>
              <div className="testimonial-author">
                <span>{item.initials}</span>
                <p>
                  {item.initials}
                  <small>{item.label}</small>
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SportsFaq({
  items: sportsFaqs,
}: {
  items: SportsHomeContent["faqs"];
}) {
  return (
    <div className="faq-list">
      {sportsFaqs.map((item, index) => (
        <details key={item.question} data-sports-row={`faqs.${index}`}>
          <summary>
            {item.question}
            <ChevronDown size={20} />
          </summary>
          <div className="accordion-body">
            <p>{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

export function ContactInterest({
  whatsappBase,
}: {
  whatsappBase: string | null;
}) {
  const [message, setMessage] = useState("");
  useEffect(() => {
    const onInterest = (event: Event) => {
      const detail = (event as CustomEvent<unknown>).detail;
      if (typeof detail === "string") setMessage(detail);
    };
    window.addEventListener("contact-interest", onInterest);
    return () => window.removeEventListener("contact-interest", onInterest);
  }, []);
  if (!message) return null;
  return (
    <div className="contact-interest" role="status">
      <MessageCircle size={20} />
      <div>
        <strong>İlk mesajın hazır</strong>
        <p>{message}</p>
        {whatsappBase ? (
          <a
            href={`${whatsappBase}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp ile paylaş
          </a>
        ) : (
          <small>
            Örnek iletişim bilgileri kullanıldığı için mesaj gönderilmez.
          </small>
        )}
      </div>
    </div>
  );
}
