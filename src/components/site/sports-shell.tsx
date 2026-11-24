import { SocialIcon } from "@/components/ui/social-icons";
import { Activity, CalendarDays, Clock3, MapPin, Phone } from "lucide-react";
import { navigation, siteConfig } from "@/config/site";
import {
  getContactLinks,
  getSiteSettings,
  getSocialLinks,
} from "@/lib/site-settings";
import { getSportsHome } from "@/content/sports-home";
import { SportsMobileMenu } from "./sports-controls";
import { Magnetic } from "@/components/ui/sports-motion";
export async function SportsHeader() {
  const [site, socials, content, links] = await Promise.all([
    getSiteSettings(),
    getSocialLinks(),
    getSportsHome(),
    getContactLinks(),
  ]);
  const brand = site?.brand;
  const contact = site?.contact;
  const menu = site?.navigation ?? navigation;
  return (
    <>
      <div className="info-bar">
        <div className="container info-bar-inner">
          <a href={links.phone}>
            <Phone size={13} />
            <span data-site-field="contact.phone">{contact?.phone}</span>
            {contact?.isMock && <small>Örnek numara</small>}
          </a>
          <span className="info-desktop">
            <MapPin size={13} />
            <span data-site-field="contact.address">{contact?.address}</span>
          </span>
          <span className="info-desktop">
            <Clock3 size={13} />
            <span data-site-field="contact.hours">{contact?.hours}</span>
          </span>
          <div className="info-socials">
            {socials.map((item) => (
              <a
                href={item.url}
                key={item.platform}
                aria-label={`${item.platform === "instagram" ? "Instagram" : "WhatsApp"}${item.isMock ? " · örnek bağlantı" : ""}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIcon platform={item.platform} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <a href="#ana-icerik" className="wordmark">
            <span className="brand-mark" aria-hidden="true">
              <Activity size={25} strokeWidth={1.7} />
            </span>
            <span>
              <strong data-site-field="brand.name">
                {brand?.name ?? siteConfig.name}
              </strong>
              <span className="sr-only"> · Ana sayfa </span>
              <small>
                <span data-site-field="brand.tagline">{brand?.tagline}</span>
                <span
                  className="brand-approval"
                  data-site-field="brand.descriptorStatus"
                >
                  {" "}
                  {brand?.descriptorStatus}
                </span>
              </small>
            </span>
          </a>
          <nav className="desktop-navigation" aria-label="Ana menü">
            {menu.map((item, index) => (
              <a href={item.href} key={item.href} data-menu-index={index}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <Magnetic href={links.whatsapp} className="header-cta">
              <CalendarDays size={16} />
              <span data-site-field="brand.appointmentLabel">
                {brand?.appointmentLabel ?? "Randevu Al"}
              </span>
            </Magnetic>
            <SportsMobileMenu
              items={menu}
              name={brand?.name ?? siteConfig.name}
              label={brand?.appointmentLabel ?? "Randevu Al"}
            />
          </div>
        </div>
      </header>
      {content?.isMock && process.env.NODE_ENV === "development" && (
        <span className="mock-badge">Örnek içerik</span>
      )}
    </>
  );
}
export async function SportsFooter() {
  const [site, socials] = await Promise.all([
    getSiteSettings(),
    getSocialLinks(),
  ]);
  const brand = site?.brand;
  const menu = site?.navigation ?? navigation;
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <p data-site-field="brand.footerEyebrow">{brand?.footerEyebrow}</p>
          <a href="#iletisim" className="button button-light">
            <span data-site-field="brand.appointmentLabel">
              {brand?.appointmentLabel ?? "Randevu Al"}
            </span>
          </a>
        </div>
        <p className="footer-wordmark">
          <span data-site-field="brand.name">
            {brand?.name ?? siteConfig.name}
          </span>
          <span aria-hidden="true">✳</span>
        </p>
        <div className="footer-grid">
          <div>
            <p className="eyebrow">BURADA BULUŞALIM</p>
            {socials.map((item) => (
              <a
                href={item.url}
                key={item.platform}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.platform === "instagram" ? "Instagram" : "WhatsApp"}
                {item.isMock && <small>Örnek hesap</small>}
              </a>
            ))}
          </div>
          <nav aria-label="Alt menü">
            {menu.map((item, index) => (
              <a key={item.href} href={item.href} data-menu-index={index}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="legal-placeholders">
            <span>
              KVKK <small>Yakında</small>
            </span>
            <span>
              Çerez politikası <small>Yakında</small>
            </span>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()}{" "}
            <span data-site-field="brand.name">
              {brand?.name ?? siteConfig.name}
            </span>
          </p>
          <p data-site-field="brand.footerNote">{brand?.footerNote}</p>
          <p>Senin ritminde, birlikte.</p>
        </div>
      </div>
    </footer>
  );
}
