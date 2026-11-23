import { Container } from "@/components/ui/container";
import { navigation, siteConfig } from "@/config/site";
import { MagneticLink } from "@/components/ui/magnetic-link";
import { MockBadge } from "@/components/ui/mock-badge";
import { MobileMenu } from "@/components/site/mobile-menu";
import { getContactLinks, getSiteSettings } from "@/lib/site-settings";
import { getHomepageContent } from "@/content/home";
import { CalendarDays, Flower2 } from "lucide-react";

export async function SiteHeader() {
  const [site, links, home] = await Promise.all([
    getSiteSettings(),
    getContactLinks(),
    getHomepageContent(),
  ]);
  const [firstName, ...lastNames] = (site?.brand.name ?? siteConfig.name).split(
    " ",
  );
  const menu = site?.navigation ?? navigation;
  return (
    <>
      <header className="site-header">
        <Container className="header-inner">
          <a href="#ana-icerik" className="wordmark">
            <span className="header-brand-symbol" aria-hidden="true">
              <Flower2 strokeWidth={1.5} />
            </span>
            <span className="header-brand-copy">
              <span className="header-brand-name">
                {firstName} {lastNames.join(" ")}
              </span>
              <small>{site?.brand.tagline ?? "BESLENME & YAŞAM"}</small>
            </span>
          </a>
          <nav className="desktop-navigation" aria-label="Ana menü">
            <ul>
              {menu.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="header-actions">
            <MagneticLink
              href={links.whatsapp}
              className="button header-cta"
              target={
                links.whatsapp.startsWith("https://") ? "_blank" : undefined
              }
              rel={
                links.whatsapp.startsWith("https://")
                  ? "noopener noreferrer"
                  : undefined
              }
            >
              <CalendarDays size={18} strokeWidth={1.8} aria-hidden="true" />
              <span>{site?.brand.appointmentLabel ?? "Randevu Al"}</span>
            </MagneticLink>
            <MobileMenu items={menu} />
          </div>
        </Container>
      </header>
      <MockBadge enabled={home?.isMock ?? false} />
    </>
  );
}
