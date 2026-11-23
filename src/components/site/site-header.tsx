import { Container } from "@/components/ui/container";
import { navigation, siteConfig } from "@/config/site";
import { MagneticLink } from "@/components/ui/magnetic-link";
import { MockBadge } from "@/components/ui/mock-badge";
import { MobileMenu } from "@/components/site/mobile-menu";
import { getContactLinks } from "@/lib/site-settings";

export function SiteHeader() {
  const [firstName, ...lastNames] = siteConfig.name.split(" ");
  return (
    <header className="site-header">
      <Container className="header-inner">
        <a href="#ana-icerik" className="wordmark">
          {firstName}{" "}
          <span>
            {lastNames.join(" ")}
            <small>BESLENME & YAŞAM</small>
          </span>
          <i aria-hidden="true">✳</i>
        </a>
        <nav className="desktop-navigation" aria-label="Ana menü">
          <ul>
            {navigation.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header-actions">
          <MockBadge />
          <MagneticLink
            href={getContactLinks().whatsapp}
            className="button header-cta"
          >
            Randevu Al
          </MagneticLink>
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
