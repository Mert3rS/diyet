import { Container } from "@/components/ui/container";
import { MagneticLink } from "@/components/ui/magnetic-link";
import { HeroCollage } from "@/components/home/hero-collage";
import { BodyAnalysisHeroLink } from "./body-analysis-link";
import { getContactLinks } from "@/lib/site-settings";
import type { MockRecord } from "@/types/content";
import type { HomeContent } from "@/content/home";
import { Check, Sparkles } from "lucide-react";

export async function HeroSection({
  trust,
  copy,
  showBodyAnalysis = false,
}: {
  trust: (MockRecord & { label: string })[];
  copy: HomeContent["copy"]["hero"];
  showBodyAnalysis?: boolean;
}) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <Container className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="tiny-flower" aria-hidden="true">
              ✳
            </span>{" "}
            {copy.eyebrow}
          </p>
          <h1 id="hero-title">
            <span className="word-mask">
              <span>{copy.first}</span>
            </span>
            <span className="word-mask">
              <span>{copy.second}</span>
            </span>
            <em className="accent-word">
              {copy.accent}
              <svg
                viewBox="0 0 400 24"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M3 14Q175-5 395 14" />
              </svg>
            </em>
          </h1>
          <p className="hero-description">{copy.description}</p>
          <div className="hero-buttons">
            <MagneticLink
              href={(await getContactLinks()).whatsapp}
              className="button"
            >
              <Sparkles size={18} /> {copy.primaryButton}
            </MagneticLink>
            <a href="#hakkimda" className="text-link">
              {copy.introLink}
            </a>
            <BodyAnalysisHeroLink enabled={showBodyAnalysis} />
          </div>
          <div className="trust-list">
            {trust.map((item) => (
              <span key={item.label}>
                <Check size={14} />
                {item.label}
              </span>
            ))}
          </div>
        </div>
        <HeroCollage />
      </Container>
      <div className="hero-bottom">
        <span>{copy.note}</span>
        <a href="#hakkimda">
          Keşfetmek için kaydır <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
