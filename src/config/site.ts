import type { NavigationItem } from "@/types/content";

export const siteConfig = {
  name: "Günay Turan",
  productionUrl: "https://gunayturan.com.tr",
  description:
    "Günay Turan — beslenmeye, harekete ve sana alan açan bir yaklaşım. Beslenme danışmanlığı sitesi tasarım önizlemesi.",
  repository: "https://github.com/Mert3rS/diyet",
  // Yayın alan adı belirli; içerik ve randevu akışı tamamlanana kadar önizleme.
  isPreview: true,
  smoothScroll: true,
  // Sahibi tarafından doğrulanmış numara eklenene kadar boş kalır.
  bodyAnalysisWhatsapp: "",
} as const;

export const navigation: readonly NavigationItem[] = [
  { label: "Hakkımda", href: "#hakkimda" },
  { label: "Hizmetler", href: "#hizmetler" },
  { label: "Süreç", href: "#surec" },
  { label: "Sıkça sorulanlar", href: "#sss" },
  { label: "İletişim", href: "#iletisim" },
];
