import Image from "next/image";
import { existsSync } from "node:fs";
import path from "node:path";
import {
  Activity,
  Check,
  Flower2,
  Heart,
  Leaf,
  Monitor,
  Sprout,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SocialLinks } from "@/components/ui/social-links";
import { MagneticLink } from "@/components/ui/magnetic-link";
import { portraitImage } from "@/content/images";
import { getContactLinks, getSiteSettings } from "@/lib/site-settings";
import type { HomeContent } from "@/content/home";

const serviceIcons = {
  leaf: Leaf,
  screen: Monitor,
  activity: Activity,
  flower: Flower2,
  sprout: Sprout,
  heart: Heart,
};
export async function HomeSections({ content }: { content: HomeContent }) {
  const site = await getSiteSettings();
  const portrait = site?.photos.portrait;
  const hasPortrait =
    Boolean(portrait) ||
    existsSync(
      path.join(process.cwd(), "public", portraitImage.path.replace(/^\//, "")),
    );
  return (
    <>
      <div className="marquee" aria-label="Danışmanlık yaklaşımı">
        <div className="marquee-track">
          {[false, true].map((duplicate) => (
            <div
              className="marquee-group"
              key={String(duplicate)}
              aria-hidden={duplicate || undefined}
            >
              {content.tags.map((tag) => (
                <span key={tag.label}>
                  {tag.label}
                  <i aria-hidden="true">✳</i>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <section
        id="hakkimda"
        className="section about-section"
        aria-labelledby="about-title"
      >
        <Container className="about-grid">
          <Reveal className="portrait-composition">
            <div className="portrait-orbit" aria-hidden="true" />
            <div className="portrait-slot image-frame">
              {hasPortrait ? (
                <Image
                  src={portrait?.url ?? portraitImage.path}
                  alt={portrait?.alt ?? portraitImage.alt}
                  fill
                  sizes="(max-width: 768px) 90vw, 35vw"
                />
              ) : (
                <div className="portrait-placeholder">
                  <svg viewBox="0 0 200 240" aria-hidden="true">
                    <path d="M100 25c-35 0-52 35-40 65 8 22 27 27 22 46-5 18-36 21-48 45-7 14-9 32-9 59h150c0-27-2-45-9-59-12-24-43-27-48-45-5-19 14-24 22-46 12-30-5-65-40-65Z" />
                  </svg>
                  <span>Fotoğraf yakında</span>
                </div>
              )}
            </div>
            <div className="portrait-caption">
              <span aria-hidden="true">✳</span>{" "}
              {content.copy.about.portraitFirst}
              <br />
              <em>{content.copy.about.portraitAccent}</em>
            </div>
            <span className="portrait-handwriting">
              {content.copy.about.portraitHandwriting}
            </span>
          </Reveal>
          <Reveal className="about-copy">
            <p className="eyebrow">{content.copy.about.eyebrow}</p>
            <h2 id="about-title">
              {content.copy.about.title}
              <br />
              <em>{content.copy.about.accent}</em>
            </h2>
            <p className="identity-line">
              {content.identity.title} {content.identity.name}
              {(content.identity.titleStatus || content.isMock) && (
                <span>
                  {content.identity.titleStatus}
                  {content.isMock ? " · Örnek biyografi" : ""}
                </span>
              )}
            </p>
            <p>{content.identity.bio}</p>
            <p>{content.identity.approach}</p>
            <SocialLinks />
            {site?.socials.some((link) => link.isMock) && (
              <p className="small-note">Sosyal hesaplar örnektir.</p>
            )}
          </Reveal>
        </Container>
      </section>
      <section
        id="hizmetler"
        className="section services-section"
        aria-labelledby="services-title"
      >
        <Container>
          <Reveal className="section-title-row">
            <div>
              <p className="eyebrow">{content.copy.services.eyebrow}</p>
              <h2 id="services-title">
                {content.copy.services.title}
                <br />
                <em>{content.copy.services.accent}</em>
              </h2>
            </div>
            <p>
              {content.copy.services.description}
              <br />
              {content.isMock && (
                <span className="small-note">Hizmet kapsamları örnektir.</span>
              )}
            </p>
          </Reveal>
          <div className="service-grid">
            {content.services.map((service) => {
              const Icon = serviceIcons[service.icon];
              return (
                <Reveal key={service.slug}>
                  <article
                    className="service-card"
                    id={`hizmet-${service.slug}`}
                  >
                    <div className="service-icon">
                      <Icon strokeWidth={1.3} size={30} />
                    </div>
                    <p className="service-tag">{service.tag}</p>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <a href="#iletisim" className="service-link">
                      {content.copy.services.linkLabel}
                      <span aria-hidden="true">+</span>
                    </a>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
export async function PackagesSection({
  packages,
  copy,
}: {
  packages: HomeContent["packages"];
  copy: HomeContent["copy"]["packages"];
}) {
  const whatsapp = (await getContactLinks()).whatsapp;
  return (
    <section
      className="section packages-section"
      aria-labelledby="packages-title"
    >
      <Container>
        <Reveal className="center-heading">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 id="packages-title">
            {copy.title}
            <br />
            <em>{copy.accent}</em>
          </h2>
          <p>{copy.description}</p>
        </Reveal>
        <div className="package-grid">
          {packages.map((pkg) => (
            <Reveal key={pkg.title}>
              <article
                className={`package-card ${pkg.featured ? "featured" : ""}`}
              >
                {pkg.featured && (
                  <span className="package-popular">
                    Öne çıkan {pkg.isMock && <small>· örnek etiket</small>}
                  </span>
                )}
                <p className="eyebrow">{pkg.subtitle}</p>
                <h3>{pkg.title}</h3>
                <p className="package-price">Fiyat için iletişime geçin</p>
                <ul>
                  {pkg.scope.map((item) => (
                    <li key={item}>
                      <Check size={16} />
                      {item}
                    </li>
                  ))}
                </ul>
                <MagneticLink
                  href={whatsapp}
                  className={`button ${pkg.featured ? "button-lime" : "button-outline"}`}
                >
                  Detayları konuşalım
                </MagneticLink>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="section-footnote">
          Örnek paketlerdir. Kapsam ve fiyatlar henüz onaylanmamıştır; tercih
          etiketi gerçek bir satış istatistiğini göstermez.
        </p>
      </Container>
    </section>
  );
}
