import { Container } from "@/components/ui/container";
import { navigation } from "@/config/site";
import { SocialLinks } from "@/components/ui/social-links";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-top">
          <p className="eyebrow">Kendine iyi gelmeye yer aç.</p>
          <SocialLinks variant="footer" />
        </div>
        <p className="footer-wordmark" aria-label="Günay Turan">
          Günay Turan<span aria-hidden="true">✳</span>
        </p>
        <div className="footer-bottom">
          <p>Günay Turan · Tasarım önizlemesi</p>
          <nav aria-label="Alt menü">
            {navigation.map((item) => (
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
        <p className="footer-note">
          Bu site örnek içerikle hazırlanmıştır. Sosyal hesaplar ve iletişim
          bilgileri temsildir.
        </p>
      </Container>
    </footer>
  );
}
