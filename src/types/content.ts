export type MockRecord = { isMock: true };
export type NavigationItem = { label: string; href: `#${string}` };
export type SocialPlatform =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "facebook"
  | "x"
  | "linkedin"
  | "whatsapp"
  | "telegram"
  | "threads"
  | "pinterest";
export type SocialLink = {
  platform: SocialPlatform;
  url: string;
  label?: string;
  visible: boolean;
};
export type ImageKey = "salad" | "preparation" | "fruit" | "breakfast";
export type Service = MockRecord & {
  slug: string;
  title: string;
  description: string;
  icon: "leaf" | "screen" | "activity" | "flower" | "sprout" | "heart";
  tag: string;
};
export type ProcessStep = MockRecord & {
  title: string;
  description: string;
  detail: string;
  image: ImageKey;
};
export type Goal = MockRecord & {
  id: string;
  title: string;
  description: string;
  service: string;
  image: ImageKey;
  message: string;
};
export type Testimonial = MockRecord & {
  id: string;
  initials: string;
  label: string;
  quote: string;
};
export type Package = MockRecord & {
  title: string;
  subtitle: string;
  scope: string[];
  featured: boolean;
};
export type BlogPreview = MockRecord & {
  title: string;
  category: string;
  readingTime: string;
  image: ImageKey;
};
export type Faq = MockRecord & { question: string; answer: string };
export type ContactSettings = {
  isMock: boolean;
  phone: string;
  email: string;
  address: string;
  hours: string;
  whatsappMessage: string;
};
