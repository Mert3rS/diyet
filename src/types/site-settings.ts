import type {
  ContactSettings,
  ImageKey,
  NavigationItem,
  SocialLink,
} from "./content";
export type ManagedImage = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};
export type SitePhotos = Partial<Record<ImageKey | "portrait", ManagedImage>>;
export type SiteSettings = {
  brand: {
    name: string;
    tagline: string;
    description: string;
    appointmentLabel: string;
    footerEyebrow: string;
    footerNote: string;
    title: string;
    titleStatus: string;
    descriptorStatus: string;
    bookingUrl: string;
  };
  contact: ContactSettings;
  socials: SocialLink[];
  navigation: NavigationItem[];
  photos: SitePhotos;
};
