import type { NavigationItem } from "@/types/content";

export const siteConfig = {
  name: "Günay Turan",
  descriptor: "Sporcu Beslenmesi Danışmanlığı",
  descriptorStatus: "[ONAY BEKLİYOR]",
  title: "Dyt.",
  titleStatus: "[ONAY BEKLİYOR]",
  bookingUrl: "",
  productionUrl: "https://gunayturan.com.tr",
  description:
    "Günay Turan — spor, beslenme ve günlük yaşamın ritmine eşlik eden bir yaklaşım. Örnek içerikli tasarım önizlemesi.",
  repository: "https://github.com/Mert3rS/diyet",
  // Yayın alan adı belirli; içerik ve randevu akışı tamamlanana kadar önizleme.
  isPreview: true,
  smoothScroll: true,
  // Sahibi tarafından doğrulanmış numara eklenene kadar boş kalır.
  bodyAnalysisWhatsapp: "",
} as const;

export const navigation: readonly NavigationItem[] = [
  { label: "Hizmetler", href: "#hizmetler" },
  { label: "Hakkımda", href: "#hakkimda" },
  { label: "Kimler için", href: "#kimler-icin" },
  { label: "Sistem", href: "#sistem" },
  { label: "Tarifler", href: "#tarifler" },
  { label: "SSS", href: "#sss" },
  { label: "İletişim", href: "#iletisim" },
];
