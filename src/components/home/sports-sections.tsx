import Image from "next/image";
import { existsSync } from "node:fs";
import path from "node:path";
import {
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  MessagesSquare,
  Mic2,
  Phone,
  Play,
  Users,
  AudioLines,
  BookOpen,
} from "lucide-react";
import type { SportsHomeContent } from "@/content/sports-defaults";
import { SportsImage } from "@/components/ui/sports-image";
import { portraitImage } from "@/content/images";
import { siteConfig } from "@/config/site";
import {
  getContactLinks,
  getContactSettings,
  getSiteSettings,
  getSocialLinks,
} from "@/lib/site-settings";
import { Reveal } from "@/components/ui/reveal";
import { MaskImage } from "@/components/ui/sports-motion";
import { SocialIcon } from "@/components/ui/social-icons";
import {
  AudienceCards,
  ContactInterest,
  RecipeGrid,
  ServiceBlocks,
  SportsFaq,
} from "./sports-interactions";

function SectionHeading({
  copy,
  className = "",
  section,
}: {
  section?: string;
  copy: {
    eyebrow: string;
    title: string;
    accent: string;
    description?: string;
  };
  className?: string;
}) {
  return (
    <div className={`section-heading ${className}`} data-sports-copy={section}>
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2>
        {copy.title}
        <br />
        <span className="gradient-text">{copy.accent}</span>
      </h2>
      {copy.description && (
        <p className="section-description">{copy.description}</p>
      )}
    </div>
  );
}
export function AudienceSection({ content }: { content: SportsHomeContent }) {
  return (
    <section id="kimler-icin" className="section audience-section">
      <div className="container">
        <Reveal>
          <SectionHeading
            copy={content.copy.audience}
            section="audience"
            className="centered"
          />
          <AudienceCards items={content.audiences} />
        </Reveal>
      </div>
    </section>
  );
}
export async function SportsAbout({ content }: { content: SportsHomeContent }) {
  const [socials, site] = await Promise.all([
    getSocialLinks(),
    getSiteSettings(),
  ]);
  const portrait = existsSync(
    path.join(process.cwd(), "public", portraitImage.path),
  );
  return (
    <section id="hakkimda" className="section about-section">
      <div className="container about-grid">
        <MaskImage className="portrait-frame">
          <div className="portrait-image-slot" data-site-photo="portrait">
            {site?.photos.portrait || portrait ? (
              <Image
                src={site?.photos.portrait?.url ?? portraitImage.path}
                alt={site?.photos.portrait?.alt ?? portraitImage.alt}
                fill
                sizes="(max-width: 700px) 90vw, 40vw"
              />
            ) : (
              <div className="portrait-placeholder">
                <div className="portrait-orbit" />
                <span className="portrait-monogram" aria-hidden="true">
                  gt<span>✳</span>
                </span>
                <p>
                  Fotoğraf yakında
                  <small>Günay Turan’ın portresi için ayrılan alan</small>
                </p>
              </div>
            )}
          </div>
          <span className="portrait-signature" data-site-field="brand.name">
            {site?.brand.name ?? siteConfig.name}
          </span>
          <span className="portrait-bracket bracket-one" />
          <span className="portrait-bracket bracket-two" />
        </MaskImage>
        <Reveal className="about-copy">
          <SectionHeading copy={content.copy.about} section="about" />
          <p data-sports-field="copy.about.bio">{content.copy.about.bio}</p>
          <p data-sports-field="copy.about.philosophy">
            {content.copy.about.philosophy}
          </p>
          <div className="about-credentials">
            <span>
              {site?.brand.title} {site?.brand.name}{" "}
              <small>{site?.brand.titleStatus}</small>
            </span>
            <p data-sports-field="copy.about.credential">
              {content.copy.about.credential}
            </p>
          </div>
          <p className="sample-note" data-sports-field="copy.about.note">
            {content.copy.about.note}
          </p>
          <div className="about-socials">
            {socials.map((item) => (
              <a
                href={item.url}
                aria-label={`${item.platform === "instagram" ? "Instagram" : "WhatsApp"} · örnek hesap`}
                key={item.platform}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIcon platform={item.platform} />
              </a>
            ))}
            <span>Biraz daha tanışalım.</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
export function SportsServices({ content }: { content: SportsHomeContent }) {
  return (
    <section id="hizmetler" className="section services-section">
      <div className="container services-layout">
        <Reveal>
          <SectionHeading copy={content.copy.services} section="services" />
          <span className="services-motif" aria-hidden="true">
            ✳
          </span>
          <p className="sample-note">
            Örnek hizmet kapsamları.
            <br />
            Mesleki bilgiler onay bekliyor.
          </p>
        </Reveal>
        <ServiceBlocks items={content.services} />
      </div>
    </section>
  );
}
export function EventsSection({ content }: { content: SportsHomeContent }) {
  const icons = { mic: Mic2, messages: MessagesSquare, users: Users };
  return (
    <section className="section events-section">
      <div className="container">
        <Reveal>
          <SectionHeading
            copy={content.copy.events}
            section="events"
            className="horizontal-copy"
          />
          <div className="events-grid">
            {content.events.map((item, index) => {
              const Icon = icons[item.icon as keyof typeof icons] ?? Mic2;
              return (
                <article
                  className="event-card"
                  data-sports-row={`events.${index}`}
                  key={item.title}
                >
                  <div className="event-top">
                    <span className="event-icon">
                      <Icon size={29} strokeWidth={1.5} />
                    </span>
                    <span className="soon-badge">Yakında</span>
                  </div>
                  <p className="eyebrow">{item.type}</p>
                  <h3>{item.title}</h3>
                  <p className="event-date">
                    <CalendarDays size={14} />
                    {item.date}
                  </p>
                </article>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
export function RecipesSection({ content }: { content: SportsHomeContent }) {
  return (
    <section id="tarifler" className="section recipes-section">
      <div className="container">
        <Reveal>
          <SectionHeading copy={content.copy.recipes} section="recipes" />
          <RecipeGrid items={content.recipes} />
        </Reveal>
      </div>
    </section>
  );
}
export async function SportsSocial({
  content,
}: {
  content: SportsHomeContent;
}) {
  const socials = await getSocialLinks();
  const icons = { VİDEO: Play, PODCAST: AudioLines, BLOG: BookOpen };
  return (
    <section className="section social-section">
      <div className="container">
        <div className="social-section-heading">
          <SectionHeading copy={content.copy.social} section="social" />
          <div>
            {socials.map((item) => (
              <a
                href={item.url}
                className="social-follow"
                key={item.platform}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIcon platform={item.platform} />
                <span>
                  {item.platform === "instagram"
                    ? "Instagram’da takip et"
                    : "WhatsApp’ta buluşalım"}
                  {item.isMock && <small>Örnek hesap</small>}
                </span>
              </a>
            ))}
          </div>
        </div>
        <div className="social-bento">
          {content.socialTiles.map((item, index) => (
            <article
              key={item.title}
              className={`social-tile social-tile-${index}`}
              data-sports-row={`socialTiles.${index}`}
            >
              <div
                className="social-tile-photo"
                data-sports-field={`socialTiles.${index}.photo`}
              >
                {(item.image || item.photo) && (
                  <SportsImage
                    name={item.image ?? "salad"}
                    photo={item.photo}
                    sizes="(max-width: 700px) 50vw, 33vw"
                  />
                )}
              </div>
              <span className="social-tile-scrim" />
              <div className="social-tile-copy">
                <span className="eyebrow">{item.topic}</span>
                <h3>{item.title}</h3>
                <small>Örnek paylaşım</small>
              </div>
              {!item.image && !item.photo && (
                <span className="social-tile-shape" aria-hidden="true">
                  {index === 1 ? "✳" : index === 2 ? "↗" : "≈"}
                </span>
              )}
            </article>
          ))}
        </div>
        <div className="media-grid">
          {content.media.map((item, index) => {
            const Icon = icons[item.type as keyof typeof icons] ?? BookOpen;
            return (
              <article
                key={item.title}
                className="media-card"
                data-sports-row={`media.${index}`}
              >
                <span className="media-icon">
                  <Icon size={23} />
                </span>
                <div>
                  <p className="eyebrow">{item.type}</p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <span className="soon-badge">Yakında</span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export function FaqBlock({ content }: { content: SportsHomeContent }) {
  return (
    <section id="sss" className="section faq-section">
      <div className="container faq-layout">
        <SectionHeading copy={content.copy.faq} section="faq" />
        <SportsFaq items={content.faqs} />
      </div>
    </section>
  );
}
export async function SportsContact({
  content,
}: {
  content: SportsHomeContent;
}) {
  const [contact, links, socials, site] = await Promise.all([
    getContactSettings(),
    getContactLinks(),
    getSocialLinks(),
    getSiteSettings(),
  ]);
  return (
    <section id="iletisim" className="section contact-section">
      <div className="container">
        <div className="contact-header">
          <SectionHeading copy={content.copy.contact} section="contact" />
          <div className="contact-star" aria-hidden="true">
            ✳
          </div>
        </div>
        <ContactInterest whatsappBase={links.whatsappBase} />
        <div className="contact-cards">
          <a href={links.whatsapp} className="contact-card">
            <span className="contact-icon">
              <MessageCircle size={25} />
            </span>
            <p>WhatsApp</p>
            <h3>Bir mesajla başlayalım.</h3>
            <span>Randevu ve bilgi almak için</span>
          </a>
          <a href={links.phone} className="contact-card">
            <span className="contact-icon">
              <Phone size={23} />
            </span>
            <p>Telefon</p>
            <h3 data-site-field="contact.phone">{contact?.phone}</h3>
            <span>
              {contact?.isMock
                ? "Örnek numara · Onay bekliyor"
                : "Telefonla iletişim"}
            </span>
          </a>
          <a href={links.email} className="contact-card">
            <span className="contact-icon">
              <Mail size={24} />
            </span>
            <p>E-posta</p>
            <h3 data-site-field="contact.email">{contact?.email}</h3>
            <span>
              {contact?.isMock
                ? "Örnek adres · Onay bekliyor"
                : "E-posta ile iletişim"}
            </span>
          </a>
        </div>
        <div className="contact-bottom">
          <div>
            <div className="contact-detail">
              <MapPin size={20} />
              <p>
                <strong>Görüşme noktası</strong>
                <span data-site-field="contact.address">
                  {contact?.address}
                </span>
              </p>
            </div>
            <div className="contact-detail">
              <Clock3 size={20} />
              <p>
                <strong>Çalışma saatleri</strong>
                <span data-site-field="contact.hours">{contact?.hours}</span>
              </p>
            </div>
            <div className="contact-socials">
              {socials.map((item) => (
                <a
                  key={item.platform}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${item.platform === "instagram" ? "Instagram" : "WhatsApp"} · örnek hesap`}
                >
                  <SocialIcon platform={item.platform} />
                </a>
              ))}
            </div>
            {site?.brand.bookingUrl && (
              <a href={site.brand.bookingUrl} className="button">
                Online randevu
              </a>
            )}
            <p className="sample-note">{content.copy.contact.note}</p>
          </div>
          <div
            className="map-placeholder"
            role="img"
            aria-label="Örnek harita alanı. Gerçek adres doğrulandıktan sonra konum eklenecek."
          >
            <div className="map-streets" aria-hidden="true" />
            <span>
              <MapPin size={28} />
              Burada buluşalım.<small>Konum yakında · Örnek harita alanı</small>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
