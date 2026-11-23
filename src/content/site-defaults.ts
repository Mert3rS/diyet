import { siteConfig, navigation } from "@/config/site";
import { mockContact } from "./mock-data";

export const defaultSiteSettings = {
  initialized: true,
  brand: {
    name: siteConfig.name,
    tagline: "BESLENME & YAŞAM",
    description: siteConfig.description,
    appointmentLabel: "Randevu Al",
    footerEyebrow: "Kendine iyi gelmeye yer aç.",
    footerNote:
      "Bu site örnek içerikle hazırlanmıştır. Sosyal hesaplar ve iletişim bilgileri temsildir.",
  },
  contact: { ...mockContact },
  social: {
    whatsappVisible: true,
    whatsappLabel: "Bir merhaba ile başlayalım",
    instagramVisible: true,
    instagramUrl: "https://example.invalid/instagram",
    instagramLabel: "Sofradan küçük notlar",
    instagramIsMock: true,
  },
  navigation: navigation.map((item) => ({
    anchor: item.href.slice(1),
    label: item.label,
    visible: true,
  })),
  photos: {},
};
