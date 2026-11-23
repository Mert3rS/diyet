import { Container } from "@/components/ui/container";
import { navigation } from "@/config/site";
import { SocialLinks } from "@/components/ui/social-links";
import { getSiteSettings } from "@/lib/site-settings";

export async function SiteFooter() {
  const site = await getSiteSettings();
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-top">
          <p className="eyebrow">
            {site?.brand.footerEyebrow ?? "Kendine iyi gelmeye yer aç."}
          </p>
          <SocialLinks variant="footer" />
        </div>
        <p
          className="footer-wordmark"
          aria-label={site?.brand.name ?? "Günay Turan"}
        >
          {site?.brand.name ?? "Günay Turan"}
          <span aria-hidden="true">✳</span>
        </p>
        <div className="footer-bottom">
          <p>{site?.brand.name ?? "Günay Turan"} · Tasarım önizlemesi</p>
          <nav aria-label="Alt menü">
            {(site?.navigation ?? navigation).map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="future-links">
            <span>
              Blog <small>Yakında</small>
            </span>
            <span>
              Tarifler <small>Yakında</small>
            </span>
            <span>
              KVKK <small>Yakında</small>
            </span>
            <span>
              Çerez politikası <small>Yakında</small>
            </span>
          </div>
        </div>
        <p className="footer-note">{site?.brand.footerNote}</p>
      </Container>
    </footer>
  );
}
