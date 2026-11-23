"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { SocialIcon } from "@/components/ui/social-icons";

export function FloatingControls({
  whatsapp,
  whatsappVisible = true,
  instagram,
  instagramIsMock = false,
  brandName = "Günay Turan",
  appointmentLabel = "Randevu Al",
}: {
  whatsapp: string;
  whatsappVisible?: boolean;
  instagram: string | null;
  instagramIsMock?: boolean;
  brandName?: string;
  appointmentLabel?: string;
}) {
  const external = whatsapp.startsWith("https://wa.me/");
  const [showTop, setShowTop] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);
  const [nearContact, setNearContact] = useState(false);
  useEffect(() => {
    const update = () => setShowTop(window.scrollY > 800);
    update();
    window.addEventListener("scroll", update, { passive: true });
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape") setHintDismissed(true);
    };
    window.addEventListener("keydown", dismiss);
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        setNearContact(visible.size > 0);
      },
      { rootMargin: "-110px 0px -80px 0px" },
    );
    for (const target of [
      document.getElementById("iletisim"),
      document.querySelector(".site-footer"),
    ]) {
      if (target) observer.observe(target);
    }
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("keydown", dismiss);
      observer.disconnect();
    };
  }, []);
  return (
    <>
      <div className="floating-actions" hidden={nearContact}>
        {showTop && (
          <a
            className="back-to-top"
            href="#ana-icerik"
            aria-label="Sayfanın başına dön"
          >
            <ChevronUp size={20} />
          </a>
        )}
        {(whatsappVisible || instagram) && (
          <div
            className="floating-socials"
            role="group"
            aria-label="Hızlı iletişim"
          >
            {whatsappVisible && (
              <a
                href={whatsapp}
                className="floating-whatsapp"
                data-hint-dismissed={hintDismissed}
                onFocus={() => setHintDismissed(false)}
                onPointerEnter={() => setHintDismissed(false)}
                aria-label={
                  external
                    ? "WhatsApp ile iletişime geç"
                    : "İletişim seçeneklerini gör · WhatsApp numarası onay bekliyor"
                }
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
              >
                <span className="floating-whatsapp-face">
                  <SocialIcon platform="whatsapp" />
                </span>
                <span className="floating-hint" aria-hidden="true">
                  <strong>Bir merhaba de.</strong>
                  <span>
                    {external
                      ? "WhatsApp ile iletişim"
                      : "İletişim seçenekleri"}
                  </span>
                </span>
              </a>
            )}
            {instagram && (
              <a
                className="floating-instagram"
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram hesabını aç${instagramIsMock ? " · örnek hesap" : ""}`}
                data-hint-dismissed={hintDismissed}
                onFocus={() => setHintDismissed(false)}
                onPointerEnter={() => setHintDismissed(false)}
              >
                <span className="floating-whatsapp-face">
                  <SocialIcon platform="instagram" />
                </span>
                <span className="floating-hint" aria-hidden="true">
                  <strong>Instagram’da buluşalım.</strong>
                  <span>
                    {instagramIsMock ? "Örnek hesap" : "Profili görüntüle"}
                  </span>
                </span>
              </a>
            )}
          </div>
        )}
      </div>
      <div className="mobile-cta-bar">
        <span>
          Kendi ritminde, birlikte.<small>{brandName}</small>
        </span>
        <a
          href={whatsapp}
          className="button button-lime"
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
        >
          {appointmentLabel}
        </a>
      </div>
    </>
  );
}
