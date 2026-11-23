import { Globe2, Leaf, LockKeyhole, Sparkles } from "lucide-react";
import Link from "next/link";

export function AdminLoginIntro() {
  return (
    <>
      <aside className="admin-login-story" aria-label="Yönetim merkezi">
        <span className="admin-story-tag">
          <Sparkles size={16} aria-hidden="true" /> Sana özel bir alan
        </span>
        <div className="admin-story-copy">
          <span className="admin-kicker">GÜNAY TURAN · YÖNETİM MERKEZİ</span>
          <h2>
            İyi bir yaşam.
            <br />
            <em>Güzel bir başlangıç.</em>
          </h2>
          <p>
            İlham veren içeriklerin, uzmanlığın ve sana ait tüm detaylar.
            Hepsini tek bir yerden yönet.
          </p>
        </div>
        <div className="admin-story-orbit" aria-hidden="true">
          <Leaf size={104} strokeWidth={1} />
          <span />
        </div>
        <span className="admin-story-footer">Kendi ritminde, birlikte.</span>
      </aside>
      <div className="admin-login-heading">
        <p className="admin-kicker">SİTE YÖNETİMİ</p>
        <h1>Yeniden merhaba.</h1>
        <p>Yönetim paneline erişmek için hesabına giriş yap.</p>
      </div>
    </>
  );
}

export function AdminLoginFooter() {
  return (
    <footer className="admin-login-footer">
      <span>
        <LockKeyhole size={15} aria-hidden="true" /> Yalnızca yetkili
        yöneticiler erişebilir.
      </span>
      <Link href="/">
        <Globe2 size={16} aria-hidden="true" /> Siteye dön
      </Link>
    </footer>
  );
}
