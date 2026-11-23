import type { ContactSettings, SocialLink } from "@/types/content";
import { normalizePhone } from "./body-analysis/messages";

export function filterSocialLinks(links: readonly SocialLink[]): SocialLink[] {
  return links.filter((link) => {
    if (
      !["instagram", "whatsapp"].includes(link.platform) ||
      !link.visible ||
      !link.url.trim()
    )
      return false;
    if (link.platform === "whatsapp" && link.url === "#iletisim") return true;
    try {
      const url = new URL(link.url);
      return url.protocol === "https:" && !url.username && !url.password;
    } catch {
      return false;
    }
  });
}
export function contactLinks(contact: ContactSettings | null = null) {
  const fallback = {
    whatsapp: "#iletisim",
    whatsappBase: null as string | null,
    phone: "#iletisim",
    email: "#iletisim",
    available: false,
  };
  if (!contact || contact.isMock) return fallback;
  const number = normalizePhone(contact.phone);
  const email = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(contact.email);
  const whatsappBase = number ? `https://wa.me/${number}` : null;
  return {
    whatsapp: whatsappBase
      ? `${whatsappBase}?text=${encodeURIComponent(contact.whatsappMessage)}`
      : fallback.whatsapp,
    whatsappBase,
    phone: number ? `tel:+${number}` : fallback.phone,
    email: email ? `mailto:${contact.email}` : fallback.email,
    available: Boolean(number || email),
  };
}
