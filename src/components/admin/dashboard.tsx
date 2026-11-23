import Link from "next/link";
import {
  Activity,
  Check,
  Globe2,
  ImagePlus,
  LayoutTemplate,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Gutter } from "@payloadcms/ui";

const shortcuts = [
  {
    href: "/admin/visual-editor",
    title: "Görsel düzenleyici",
    note: "Sayfayı görerek düzenle. Yazıya veya fotoğrafa tıkla, değişikliği anında gör.",
    icon: LayoutTemplate,
    color: "green",
    label: "Önizlemeyle düzenle",
  },
  {
    href: "/admin/globals/site-settings",
    title: "Site ayarları",
    note: "İletişim bilgilerin, sosyal medya hesapların ve marka detayların.",
    icon: Settings2,
    color: "orange",
    label: "Ayarları aç",
  },
  {
    href: "/admin/globals/body-analysis-settings",
    title: "Vücut analizi",
    note: "Analiz alanlarını, bilgilendirmeleri ve WhatsApp mesajını kişiselleştir.",
    icon: Activity,
    color: "purple",
    label: "Analizi yönet",
  },
  {
    href: "/admin/collections/media",
    title: "Görsel kütüphanesi",
    note: "Yeni fotoğraflar yükle, görsellerini ve açıklamalarını bir arada tut.",
    icon: ImagePlus,
    color: "blue",
    label: "Görselleri aç",
  },
] as const;

export function AdminDashboard() {
  return (
    <Gutter className="dashboard">
      <section
        className="admin-welcome"
        aria-labelledby="admin-dashboard-title"
      >
        <div className="admin-dashboard-topline">
          <p className="admin-kicker">
            <Sparkles size={15} aria-hidden="true" /> SENİN ALANIN, SENİN
            HİKÂYEN
          </p>
          <a
            className="admin-preview-link"
            href="/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Globe2 size={17} aria-hidden="true" /> Siteyi görüntüle
          </a>
        </div>
        <div className="admin-hero">
          <div>
            <span className="admin-hero-label">
              Günay Turan · Yönetim merkezi
            </span>
            <h1 id="admin-dashboard-title">
              Güzel şeyler
              <br />
              <em>seninle başlar.</em>
            </h1>
            <p>
              Siteni güncelle, içeriklerine hayat ver.
              <br />
              Bir sonraki güzel adım için her şey burada.
            </p>
            <Link className="admin-hero-button" href="/admin/visual-editor">
              <LayoutTemplate size={18} aria-hidden="true" /> Ana sayfayı
              görerek düzenle
            </Link>
          </div>
          <div className="admin-hero-art" aria-hidden="true">
            <span>g</span>
            <Sparkles size={36} />
            <i />
          </div>
        </div>
        <div className="admin-section-heading">
          <div>
            <h2>Bugün ne yapmak istersin?</h2>
            <p>İhtiyacın olan alana tek dokunuşla ulaş.</p>
          </div>
          <span>Hızlı erişim</span>
        </div>
        <div className="admin-shortcuts">
          {shortcuts.map(({ href, title, note, icon: Icon, color, label }) => (
            <Link
              href={href}
              key={href}
              className={`admin-shortcut admin-shortcut--${color}`}
            >
              <span className="admin-shortcut-icon">
                <Icon size={24} strokeWidth={1.7} aria-hidden="true" />
              </span>
              <h3>{title}</h3>
              <p>{note}</p>
              <span className="admin-shortcut-label">{label}</span>
            </Link>
          ))}
        </div>
        <div className="admin-bottom-grid">
          <div className="admin-publish-note">
            <span className="admin-note-icon">
              <Check size={22} aria-hidden="true" />
            </span>
            <div>
              <h3>Düzenle. Kaydet. Paylaş.</h3>
              <p>
                Kaydettiğin değişiklikler doğrudan sitene yansır. İçeriklerini
                dilediğin zaman güncelleyebilirsin.
              </p>
            </div>
          </div>
          <Link className="admin-team-link" href="/admin/collections/users">
            <Users size={23} aria-hidden="true" />
            <div>
              <strong>Yönetici hesapları</strong>
              <span>Profil ve erişim ayarları</span>
            </div>
          </Link>
        </div>
        <p className="admin-help">
          <ShieldCheck size={16} aria-hidden="true" /> İlk girişinden sonra
          profilinden şifreni güncelleyebilirsin.
        </p>
      </section>
    </Gutter>
  );
}
