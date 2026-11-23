import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { MotionShell } from "@/components/ui/motion-shell";
import { siteConfig } from "@/config/site";
import "@/styles/globals.css";

const display = localFont({
  src: [
    {
      path: "../../public/fonts/fraunces-tr.woff2",
      weight: "450",
      style: "normal",
    },
    {
      path: "../../public/fonts/fraunces-italic-tr.woff2",
      weight: "450",
      style: "italic",
    },
  ],
  variable: "--font-display",
  display: "swap",
});
const sans = localFont({
  src: "../../public/fonts/geist-tr.woff2",
  weight: "100 900",
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || siteConfig.productionUrl),
  title: {
    default: `${siteConfig.name} — Beslenme, hareket, denge`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  // İçerik ve yayın hazırlığı tamamlanana kadar önizlemeyi indekslemeyin.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" className={`${display.variable} ${sans.variable}`}>
      <body>
        <a className="skip-link" href="#ana-icerik">
          İçeriğe geç
        </a>
        <MotionShell>{children}</MotionShell>
      </body>
    </html>
  );
}
