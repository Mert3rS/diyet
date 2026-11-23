import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { FloatingControls } from "@/components/site/floating-controls";
import {
  getSiteSettings,
  getSocialLinks,
  getContactLinks,
} from "@/lib/site-settings";
import { PublicRoot } from "@/components/site/public-root";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";
import { getSiteUrl } from "@/config/site-url";
import Script from "next/script";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: `${site?.brand.name ?? siteConfig.name} — Beslenme, hareket, denge`,
      template: `%s | ${site?.brand.name ?? siteConfig.name}`,
    },
    description: site?.brand.description ?? siteConfig.description,
    robots: { index: false, follow: false },
  };
}

export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [site, socials, links] = await Promise.all([
    getSiteSettings(),
    getSocialLinks(),
    getContactLinks(),
  ]);
  return (
    <PublicRoot photos={site?.photos ?? {}}>
      <Script
        id="initial-scroll-position"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `if (!location.hash && performance.getEntriesByType('navigation')[0]?.type !== 'back_forward') { history.scrollRestoration = 'manual'; window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); window.addEventListener('pageshow', function (event) { if (!event.persisted && !location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, { once: true }); }`,
        }}
      />
      <SiteHeader />
      <main id="ana-icerik" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
      <FloatingControls
        whatsapp={links.whatsapp}
        whatsappVisible={socials.some((link) => link.platform === "whatsapp")}
        instagram={
          socials.find((link) => link.platform === "instagram")?.url ?? null
        }
        instagramIsMock={
          socials.find((link) => link.platform === "instagram")?.isMock ?? false
        }
        brandName={site?.brand.name ?? siteConfig.name}
        appointmentLabel={site?.brand.appointmentLabel ?? "Randevu Al"}
      />
    </PublicRoot>
  );
}
