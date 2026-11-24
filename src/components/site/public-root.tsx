import localFont from "next/font/local";
import type { ReactNode } from "react";
import { MotionShell } from "@/components/ui/motion-shell";
import { SiteMediaProvider } from "./site-media";
import type { SitePhotos } from "@/types/site-settings";
import "@/styles/globals.css";
import "@/styles/visual-preview.css";
import { VisualPreviewBridge } from "./visual-preview-bridge";
const display = localFont({
  src: "../../../public/fonts/geist-tr.woff2",
  weight: "100 900",
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
