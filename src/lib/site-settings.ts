import { siteConfig, USE_MOCK_CONTENT } from "@/config/site";
import { sanitizeBodyAnalysisSettings } from "@/lib/body-analysis/settings";
import { normalizePhone } from "@/lib/body-analysis/messages";
import type { BodyAnalysisConfig } from "@/lib/body-analysis/types";
import { mockContact, mockSocialLinks } from "@/content/mock-data";
import type { ContactSettings, SocialLink } from "@/types/content";

export function filterSocialLinks(links: readonly SocialLink[]): SocialLink[] {
  return links.filter((link) => {
    if (!link.visible || !link.url.trim()) return false;
    try {
      const url = new URL(link.url);
      return url.protocol === "https:" && !url.username && !url.password;
    } catch {
      return false;
    }
  });
}
// Faz 2'de yalnızca bu kaynak CMS okumasıyla değiştirilecek.
export async function getSocialLinks(): Promise<SocialLink[]> {
  return filterSocialLinks(USE_MOCK_CONTENT ? mockSocialLinks : []);
}
export function getContactSettings() {
  return USE_MOCK_CONTENT ? mockContact : null;
}
// Faz 2: kaynak buradan CMS Global'ine taşınacak; şu an DB/admin bağımlılığı yoktur.
export async function getBodyAnalysisSettings(): Promise<BodyAnalysisConfig> {
  const production = process.env.NODE_ENV === "production";
  const settings = sanitizeBodyAnalysisSettings(null, production);
  const contact = getContactSettings();
  const mainPhone =
    contact && !contact.isMock
      ? contact.phone
      : siteConfig.bodyAnalysisWhatsapp;
  const phone = normalizePhone(settings.whatsappOverride || mainPhone);
  const alternatives = getContactLinks();
  return {
    ...settings,
    phone,
    phoneHref: alternatives.phone,
    emailHref: alternatives.email,
    privacyUrl: null, // Gerçek KVKK sayfası henüz mevcut değil.
    isDevelopment: !production,
  };
}
export function getContactLinks(
  contact: ContactSettings | null = getContactSettings(),
) {
  // Örnek numaraları ve e-posta adreslerini gerçek alıcılara dönüştürmeyin.
  const fallback = {
    whatsapp: "#iletisim",
    whatsappBase: null as string | null,
    phone: "#iletisim",
    email: "#iletisim",
    available: false,
  };
  if (!contact || contact.isMock) return fallback;
  const phone = contact.phone.replace(/[\s()-]/g, "");
  const validPhone = /^\+[1-9]\d{6,14}$/.test(phone);
  const validEmail = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(contact.email);
  const whatsappBase = validPhone ? `https://wa.me/${phone.slice(1)}` : null;
  return {
    whatsapp: whatsappBase
      ? `${whatsappBase}?text=${encodeURIComponent(contact.whatsappMessage)}`
      : fallback.whatsapp,
    whatsappBase,
    phone: validPhone ? `tel:${phone}` : fallback.phone,
    email: validEmail ? `mailto:${contact.email}` : fallback.email,
    available: validPhone || validEmail,
  };
}
