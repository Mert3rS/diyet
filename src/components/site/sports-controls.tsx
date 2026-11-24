"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X, MessageCircle, ChevronUp, CalendarDays } from "lucide-react";
import type { NavigationItem } from "@/types/content";

export function SportsMobileMenu({
  items: navigation,
  name,
  label,
}: {
  items: readonly NavigationItem[];
  name: string;
  label: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const close = () => {
    dialog.current?.close();
    setOpen(false);
  };
  return (
    <div className="mobile-menu">
      <button
        type="button"
        className="icon-button menu-toggle"
        aria-label="Menüyü aç"
        aria-expanded={open}
        aria-controls="mobil-menu"
        onClick={() => {
          dialog.current?.showModal();
          setOpen(true);
        }}
      >
        <Menu size={22} />
      </button>
      <dialog
        id="mobil-menu"
        className="mobile-dialog"
        ref={dialog}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="mobile-dialog-top">
          <span>
            <span data-site-field="brand.name">{name}</span>
            <span className="brand-star">✳</span>
          </span>
          <button
            type="button"
            className="icon-button"
            aria-label="Menüyü kapat"
            onClick={close}
          >
            <X />
          </button>
        </div>
        <nav aria-label="Mobil menü">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={close}>
              {item.label}
            </a>
          ))}
        </nav>
        <p>Beslenme. Hareket. Senin ritmin.</p>
        <a href="#iletisim" className="button" onClick={close}>
          <span data-site-field="brand.appointmentLabel">{label}</span>
        </a>
      </dialog>
    </div>
  );
}

export function SportsFloating({
  whatsapp,
  whatsappVisible = true,
  label = "Randevu Al",
}: {
  whatsapp: string;
  whatsappVisible?: boolean;
  label?: string;
}) {
  const [showTop, setShowTop] = useState(false);
  const [smooth, setSmooth] = useState(true);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 650);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <div className="floating-tools">
        {showTop && (
          <a
            href="#ana-icerik"
            className="floating-top"
            aria-label="Sayfanın başına dön"
          >
            <ChevronUp size={20} />
          </a>
        )}
        {whatsappVisible && (
          <a
            href={whatsapp}
            className="floating-whatsapp"
            aria-label="WhatsApp ile iletişim bilgilerini görüntüle"
          >
            <MessageCircle size={25} />
          </a>
        )}
      </div>
      <a href="#iletisim" className="mobile-appointment">
        <CalendarDays size={18} />
        <span data-site-field="brand.appointmentLabel">{label}</span>
        <span>Birlikte başlayalım</span>
      </a>
      <button
        className="motion-toggle"
        type="button"
        aria-pressed={!smooth}
        onClick={() => {
          const next = !smooth;
          setSmooth(next);
          window.dispatchEvent(
            new CustomEvent("smooth-scroll-toggle", { detail: next }),
          );
        }}
      >
        {smooth ? "Yumuşak kaydırmayı kapat" : "Yumuşak kaydırmayı aç"}
      </button>
    </>
  );
}
