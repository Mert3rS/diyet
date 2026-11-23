import type { SocialPlatform } from "@/types/content";

export const socialPresentation: Record<
  SocialPlatform,
  { name: string; description: string }
> = {
  instagram: { name: "Instagram", description: "Sofradan küçük notlar" },
  youtube: { name: "YouTube", description: "Birlikte öğrenmeye alan aç" },
  tiktok: { name: "TikTok", description: "Günlük hayattan kısa molalar" },
  facebook: { name: "Facebook", description: "Gündelik yaşamdan paylaşımlar" },
  x: { name: "X", description: "Kısa notlar, yeni düşünceler" },
  linkedin: { name: "LinkedIn", description: "Mesleki paylaşımlar" },
  whatsapp: { name: "WhatsApp", description: "Bir merhaba ile başlayalım" },
  telegram: { name: "Telegram", description: "Notlardan haberdar ol" },
  threads: { name: "Threads", description: "Sohbete bir yer aç" },
  pinterest: { name: "Pinterest", description: "İlhamı biriktir" },
};
