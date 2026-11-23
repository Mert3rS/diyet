import type { SocialPlatform } from "@/types/content";

export const socialPresentation: Record<
  SocialPlatform,
  { name: string; description: string }
> = {
  instagram: { name: "Instagram", description: "Sofradan küçük notlar" },
  whatsapp: { name: "WhatsApp", description: "Bir merhaba ile başlayalım" },
};
