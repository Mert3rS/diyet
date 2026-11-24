import type { ReactNode } from "react";
import { SportsFooter, SportsHeader } from "@/components/site/sports-shell";
import { SportsFloating } from "@/components/site/sports-controls";
import { getSocialLinks } from "@/lib/site-settings";
import { getSiteSettings, getContactLinks } from "@/lib/site-settings";
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
      default: `${site?.brand.name ?? siteConfig.name} — Beslenme ve hareket`,
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
  const [site, links, socials] = await Promise.all([
    getSiteSettings(),
    getContactLinks(),
    getSocialLinks(),
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
      <SportsHeader />
      <main id="ana-icerik" tabIndex={-1}>
        {children}
      </main>
      <SportsFooter />
      <SportsFloating
        whatsapp={links.whatsapp}
        whatsappVisible={socials.some((item) => item.platform === "whatsapp")}
        label={site?.brand.appointmentLabel}
      />
    </PublicRoot>
  );
}
