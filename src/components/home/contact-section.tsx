import type { HomeContent } from "@/content/home";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SocialLinks } from "@/components/ui/social-links";
import { SocialIcon } from "@/components/ui/social-icons";
import {
  getContactLinks,
  getContactSettings,
  getSocialLinks,
} from "@/lib/site-settings";

export async function ContactSection({
  copy,
}: {
  copy: HomeContent["copy"]["contact"];
}) {
  const contact = getContactSettings();
  if (!contact)
    return (
      <section id="iletisim" className="section">
        <Container>
          <h2>İletişim bilgileri hazırlanıyor.</h2>
        </Container>
      </section>
    );
  const links = getContactLinks();
  const socials = await getSocialLinks();
  return (
    <section
      id="iletisim"
      className="section contact-section"
      aria-labelledby="contact-title"
    >
      <Container>
        <div className="contact-heading">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 id="contact-title">
              {copy.title}
              <br />
              <em>{copy.accent}</em>
            </h2>
          </div>
          <p>{copy.description}</p>
        </div>
        <div className="contact-cards">
          <a href={links.whatsapp} className="contact-card">
            <SocialIcon platform="whatsapp" />
            <span>
              WhatsApp&apos;tan yaz<small>Telefon bilgisi onay bekliyor</small>
            </span>
          </a>
          <a href={links.phone} className="contact-card">
            <Phone size={24} />
            <span>
              Bir telefon kadar yakın<small>{contact.phone} · örnek</small>
            </span>
          </a>
          <a href={links.email} className="contact-card">
            <Mail size={24} />
            <span>
              Bir e-posta bırak<small>{contact.email} · örnek</small>
            </span>
          </a>
        </div>
        <div className="contact-meta">
          <p>
            <MapPin size={18} />
            <span>{contact.address}</span>
          </p>
          <p>
            <Clock3 size={18} />
            <span>{contact.hours}</span>
          </p>
        </div>
        <p className="contact-preview-note">
          Örnek iletişim bilgileri. Gerçek numara ve e-posta onaylanana kadar bu
          bağlantılar mesaj göndermez veya arama başlatmaz. Bu site randevu
          kaydetmez.
        </p>
        {socials.length > 0 && (
          <div className="contact-social">
            <p className="eyebrow">Sofradan, hayattan, birlikte.</p>
            <SocialLinks variant="cards" />
          </div>
        )}
      </Container>
    </section>
  );
}
