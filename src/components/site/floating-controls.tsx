"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { SocialIcon } from "@/components/ui/social-icons";

export function FloatingControls({ whatsapp }: { whatsapp: string }) {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const update = () => setShowTop(window.scrollY > 800);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <>
      <div className="floating-actions">
        {showTop && (
          <a
            className="back-to-top"
            href="#ana-icerik"
            aria-label="Sayfanın başına dön"
          >
            <ChevronUp size={20} />
          </a>
        )}
        <a
          href={whatsapp}
          className="floating-whatsapp"
          aria-label="Konuşalım · WhatsApp ile randevu bilgisi · telefon onay bekliyor"
        >
          <SocialIcon platform="whatsapp" />
          <span>Konuşalım</span>
        </a>
      </div>
      <div className="mobile-cta-bar">
        <span>
          Kendi ritminde, birlikte.<small>Günay Turan</small>
        </span>
        <a href={whatsapp} className="button button-lime">
          Randevu Al
        </a>
      </div>
    </>
  );
}
