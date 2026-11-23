import localFont from "next/font/local";
import type { ReactNode } from "react";
import { MotionShell } from "@/components/ui/motion-shell";
import { SiteMediaProvider } from "./site-media";
import type { SitePhotos } from "@/types/site-settings";
import "@/styles/globals.css";
import "@/styles/header.css";
import "@/styles/visual-preview.css";
import { VisualPreviewBridge } from "./visual-preview-bridge";
const display = localFont({
  src: [
    {
      path: "../../../public/fonts/fraunces-tr.woff2",
      weight: "450",
      style: "normal",
    },
    {
      path: "../../../public/fonts/fraunces-italic-tr.woff2",
      weight: "450",
      style: "italic",
    },
  ],
  variable: "--font-display",
  display: "swap",
});
const sans = localFont({
  src: "../../../public/fonts/geist-tr.woff2",
  weight: "100 900",
  variable: "--font-body",
  display: "swap",
});
export function PublicRoot({
  children,
  photos,
}: {
  children: ReactNode;
  photos: SitePhotos;
}) {
  return (
    <html lang="tr" className={`${display.variable} ${sans.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `if (!location.hash && performance.getEntriesByType('navigation')[0]?.type !== 'back_forward') { history.scrollRestoration = 'manual'; window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); window.addEventListener('pageshow', function (event) { if (!event.persisted && !location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, { once: true }); }`,
          }}
        />
      </head>
      <body>
        <VisualPreviewBridge />
        <a className="skip-link" href="#ana-icerik">
          İçeriğe geç
        </a>
        <SiteMediaProvider photos={photos}>
          <MotionShell>{children}</MotionShell>
        </SiteMediaProvider>
      </body>
    </html>
  );
}
