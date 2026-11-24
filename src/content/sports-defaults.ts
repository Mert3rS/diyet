import {
  sportsAudiences,
  sportsBranches,
  sportsCopy,
  sportsDashboard,
  sportsEvents,
  sportsFaqs,
  sportsMedia,
  sportsMethod,
  sportsRecipes,
  sportsServices,
  sportsSlides,
  sportsSocialTiles,
  sportsTestimonials,
} from "./mock-data";
import type { ManagedImage } from "@/types/site-settings";

type Editable<T> = T extends string
  ? string
  : T extends boolean
    ? boolean
    : T extends readonly (infer U)[]
      ? Editable<U>[]
      : T extends object
        ? { -readonly [K in keyof T]: Editable<T[K]> }
        : T;
const photo = null as ManagedImage | null;
export function defaultSportsHome() {
  return {
    isMock: true,
    sections: {
      audience: true,
      about: true,
      services: true,
      method: true,
      events: true,
      recipes: true,
      social: true,
      testimonials: true,
      faq: true,
      contact: true,
      dashboard: true,
      branches: true,
    },
    hero: {
      headline: "Beslenme, hareket ve sana ait bir denge.",
      primaryLabel: "Bilgi Al",
      secondaryLabel: "Randevu Al",
      note: "Hazır kalıplar değil. Sana ait bir yaklaşım.",
      scrollLabel: "KENDİ RİTMİNİ KEŞFET",
      visualCaption: "GÜNAY TURAN · BESLENME & HAREKET",
      autoplay: true,
    },
    copy: {
      ...structuredClone(sportsCopy),
      method: {
        isMock: true,
        eyebrow: "YAKLAŞIMIMIZ",
        title: "Bir liste değil,",
        accent: "birlikte bir yol.",
        description: "Değişen hayatına eşlik eden, iletişime açık bir süreç.",
      },
      testimonials: {
        isMock: true,
        eyebrow: "ÖRNEK YORUMLAR",
        title: "Sürecin içinden,",
        accent: "birkaç ses.",
        description:
          "Bu yorumlar tasarım amaçlıdır. Gerçek danışan deneyimi değildir.",
      },
    },
    slides: sportsSlides.map((row) => ({ ...row, visible: true, photo })),
    services: sportsServices.map((row) => ({
      ...row,
      visible: true,
      scope: [...row.scope],
    })),
    audiences: sportsAudiences.map((row) => ({ ...row, visible: true })),
    method: sportsMethod.map((row) => ({ ...row, visible: true })),
    events: sportsEvents.map((row) => ({ ...row, visible: true })),
    recipes: sportsRecipes.map((row) => ({ ...row, visible: true, photo })),
    socialTiles: sportsSocialTiles.map((row) => ({
      ...row,
      visible: true,
      photo,
    })),
    media: sportsMedia.map((row) => ({ ...row, visible: true })),
    testimonials: sportsTestimonials.map((row) => ({ ...row, visible: true })),
    faqs: sportsFaqs.map((row) => ({ ...row, visible: true })),
    dashboard: {
      title: "Performans panosu",
      eyebrow: "SENİN RİTMİNDE",
      disclaimer: "Örnek görünüm — gerçek ölçüm değildir",
      timelineTitle: "Maç günü zaman çizelgesi",
      rings: [...sportsDashboard.rings],
      timeline: [...sportsDashboard.timeline],
      chips: [...sportsDashboard.chips],
    },
    branches: [...sportsBranches],
  };
}
export type SportsHomeContent = Editable<ReturnType<typeof defaultSportsHome>>;
export type SportsCopy = SportsHomeContent["copy"];

// Payload array fields have named row values; presentation uses plain strings.
export function sportsSeedData() {
  const content = defaultSportsHome();
  return {
    ...content,
    initialized: true,
    services: content.services.map((row) => ({
      ...row,
      scope: row.scope.map((text) => ({ text })),
    })),
    dashboard: {
      ...content.dashboard,
      ...Object.fromEntries(
        (["rings", "timeline", "chips"] as const).map((key) => [
          key,
          content.dashboard[key].map((label) => ({ label })),
        ]),
      ),
    },
    branches: content.branches.map((label) => ({ label })),
  };
}
