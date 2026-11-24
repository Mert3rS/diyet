import { siteConfig, navigation } from "@/config/site";
import { mockContact } from "./mock-data";

export const defaultSiteSettings = {
  initialized: true,
  brand: {
    name: siteConfig.name,
    tagline: siteConfig.descriptor,
    title: siteConfig.title,
    titleStatus: siteConfig.titleStatus,
    descriptorStatus: siteConfig.descriptorStatus,
    bookingUrl: "",
    description: siteConfig.description,
    appointmentLabel: "Randevu Al",
    footerEyebrow: "Beslenme. Hareket. Senin ritmin.",
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
