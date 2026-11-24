import "server-only";
import { cache } from "react";
import { siteConfig, navigation } from "@/config/site";
import { defaultSiteSettings } from "@/content/site-defaults";
import { sanitizeBodyAnalysisSettings } from "./body-analysis/settings";
import { normalizePhone } from "./body-analysis/messages";
import type { BodyAnalysisConfig } from "./body-analysis/types";
import type { ContactSettings, SocialLink } from "@/types/content";
import type { SitePhotos, SiteSettings } from "@/types/site-settings";
import { readGlobal } from "./cms";
import { record, text, flag } from "./content-normalize";
import { contactLinks, filterSocialLinks } from "./contact";
export { filterSocialLinks } from "./contact";

export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  const data = await readGlobal("site-settings");
  if (!data?.initialized) return null;
  const brand = record(data.brand),
    contact = record(data.contact),
    social = record(data.social),
    rawPhotos = record(data.photos);
  const normalizedContact: ContactSettings = {
    isMock: flag(contact.isMock, true),
    phone: text(contact.phone, "", 40),
    email: text(contact.email, "", 200),
    address: text(contact.address, "", 400),
    hours: text(contact.hours, "", 300),
    whatsappMessage: text(contact.whatsappMessage, "", 500),
  };
  const links = contactLinks(normalizedContact);
  const socials: SocialLink[] = [
    {
      platform: "whatsapp",
      visible: flag(social.whatsappVisible, true),
      isMock: normalizedContact.isMock,
      url: normalizedContact.isMock
        ? "https://example.invalid/whatsapp"
        : links.whatsapp,
      label: text(social.whatsappLabel, "Bir merhaba ile başlayalım", 100),
    },
    {
      platform: "instagram",
      visible: flag(social.instagramVisible, true),
      isMock: flag(social.instagramIsMock, true),
      url: text(social.instagramUrl, "", 300),
      label: text(social.instagramLabel, "Sofradan küçük notlar", 100),
    },
  ];
  const photos: SitePhotos = {};
  for (const key of [
    "portrait",
    "salad",
    "fruit",
    "preparation",
    "breakfast",
  ] as const) {
    const photo = record(rawPhotos[key]);
    const url = text(photo.url);
    // Only same-origin public media routes may become image sources.
    if (url.startsWith("/api/media/file/") && !url.includes(".."))
      photos[key] = {
        url,
        alt: text(photo.alt, "Günay Turan görseli", 240),
        width: typeof photo.width === "number" ? photo.width : undefined,
        height: typeof photo.height === "number" ? photo.height : undefined,
      };
  }
  const menu = Array.isArray(data.navigation) ? data.navigation : [];
  const nav = menu
    .flatMap((item) => {
      const row = record(item);
      const original = navigation.find(
        (link) =>
          link.href === `#${row.anchor === "surec" ? "sistem" : row.anchor}`,
      );
      return original && flag(row.visible, true)
        ? [{ href: original.href, label: text(row.label, original.label, 40) }]
        : [];
    })
    .filter(
      (item, index, list) =>
        list.findIndex((other) => other.href === item.href) === index,
    );
  return {
    brand: {
      name: text(brand.name, siteConfig.name, 80),
      tagline: text(brand.tagline, defaultSiteSettings.brand.tagline, 60),
      description: text(brand.description, siteConfig.description, 300),
      appointmentLabel: text(brand.appointmentLabel, "Randevu Al", 40),
      footerEyebrow: text(
        brand.footerEyebrow,
        defaultSiteSettings.brand.footerEyebrow,
        100,
      ),
      footerNote: text(brand.footerNote, "", 500),
      title: text(brand.title, siteConfig.title, 50),
      titleStatus: text(brand.titleStatus, siteConfig.titleStatus, 100),
      descriptorStatus: text(
        brand.descriptorStatus,
        siteConfig.descriptorStatus,
        100,
      ),
      bookingUrl: (() => {
        const value = text(brand.bookingUrl, "", 500);
        try {
          const url = new URL(value);
          return url.protocol === "https:" && !url.username && !url.password
            ? url.href
            : "";
        } catch {
          return "";
        }
      })(),
    },
    contact: normalizedContact,
    socials: filterSocialLinks(socials),
    navigation: nav,
    photos,
  };
});
export async function getSocialLinks(): Promise<SocialLink[]> {
  return (await getSiteSettings())?.socials ?? [];
}
export async function getContactSettings() {
  return (await getSiteSettings())?.contact ?? null;
}
export async function getContactLinks(contact?: ContactSettings | null) {
  return contactLinks(
    contact === undefined ? await getContactSettings() : contact,
  );
}
export async function getBodyAnalysisSettings(): Promise<BodyAnalysisConfig> {
  const production = process.env.NODE_ENV === "production";
  const raw = await readGlobal("body-analysis-settings");
  const data = raw
    ? {
        ...raw,
        services: Array.isArray(raw.services)
          ? raw.services.map((value) => {
              const row = record(value);
              return { ...row, id: row.key };
            })
          : undefined,
      }
    : null;
  const settings = sanitizeBodyAnalysisSettings(data, production);
  const site = await getSiteSettings();
  const contact = site?.contact;
  const main =
    contact && !contact.isMock
      ? contact.phone
      : siteConfig.bodyAnalysisWhatsapp;
  const phone = normalizePhone(settings.whatsappOverride || main);
  const links = contactLinks(contact ?? null);
  return {
    ...settings,
    enabled: Boolean(raw?.initialized) && settings.enabled,
    phone,
    phoneHref: links.phone,
    emailHref: links.email,
    privacyUrl: null,
    isDevelopment: !production,
  };
}
