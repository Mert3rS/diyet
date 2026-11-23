import { Container } from "@/components/ui/container";
import { navigation, siteConfig } from "@/config/site";
import { MagneticLink } from "@/components/ui/magnetic-link";
import { MockBadge } from "@/components/ui/mock-badge";
import { MobileMenu } from "@/components/site/mobile-menu";
import { getContactLinks, getSiteSettings } from "@/lib/site-settings";
import { getHomepageContent } from "@/content/home";

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
    <header className="site-header">
      <Container className="header-inner">
        <a href="#ana-icerik" className="wordmark">
          {firstName}{" "}
          <span>
            {lastNames.join(" ")}
            <small>{site?.brand.tagline ?? "BESLENME & YAŞAM"}</small>
          </span>
          <i aria-hidden="true">✳</i>
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
          <MockBadge enabled={home?.isMock ?? false} />
          <MagneticLink href={links.whatsapp} className="button header-cta">
            {site?.brand.appointmentLabel ?? "Randevu Al"}
          </MagneticLink>
          <MobileMenu items={menu} />
        </div>
      </Container>
    </header>
  );
}
