import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SocialLinks } from "@/components/ui/social-links";
import { FloatingControls } from "@/components/site/floating-controls";
import { getContactLinks } from "@/lib/site-settings";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <SocialLinks variant="edge" />
      <main id="ana-icerik" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
      <FloatingControls whatsapp={getContactLinks().whatsapp} />
    </>
  );
}
