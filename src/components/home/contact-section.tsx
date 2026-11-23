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
  const contact = await getContactSettings();
  if (!contact)
    return (
      <section id="iletisim" className="section">
        <Container>
          <h2>İletişim bilgileri hazırlanıyor.</h2>
        </Container>
      </section>
    );
  const links = await getContactLinks(contact);
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
              WhatsApp&apos;tan yaz
              <small>
                {contact.isMock
                  ? "Telefon bilgisi onay bekliyor"
                  : "Danışmanlık hakkında bilgi al"}
              </small>
            </span>
          </a>
          <a href={links.phone} className="contact-card">
            <Phone size={24} />
            <span>
              Bir telefon kadar yakın
              <small>
                <span data-contact-field="phone">{contact.phone}</span>
                {contact.isMock ? " · örnek" : ""}
              </small>
            </span>
          </a>
          <a href={links.email} className="contact-card">
            <Mail size={24} />
            <span>
              Bir e-posta bırak
              <small>
                <span data-contact-field="email">{contact.email}</span>
                {contact.isMock ? " · örnek" : ""}
              </small>
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
        {contact.isMock && (
          <p className="contact-preview-note">
            Örnek iletişim bilgileri. Gerçek numara ve e-posta onaylanana kadar
            bu bağlantılar mesaj göndermez veya arama başlatmaz. Bu site randevu
            kaydetmez.
          </p>
        )}
        {socials.length > 0 && (
          <div className="contact-social">
            <div className="contact-social-intro">
              <div>
                <p className="eyebrow">{copy.socialEyebrow}</p>
                <h3>
                  {copy.socialTitle}
                  <br />
                  <em>{copy.socialAccent}</em>
                </h3>
              </div>
              <p>{copy.socialDescription}</p>
            </div>
            <SocialLinks variant="cards" />
          </div>
        )}
      </Container>
    </section>
  );
}
