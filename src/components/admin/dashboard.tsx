export function AdminDashboard() {
  return (
    <section className="admin-welcome">
      <p className="admin-kicker">Günay Turan · yönetim merkezi</p>
      <h1>Sitenin kontrolü sende.</h1>
      <p>
        Bir alan seç, düzenle ve kaydet. Değişiklikler sitede görünür; yeniden
        derleme gerekmez.
      </p>
      <div className="admin-shortcuts">
        {[
          [
            "/admin/globals/site-settings",
            "Site ayarları",
            "WhatsApp, Instagram, iletişim ve görseller",
          ],
          [
            "/admin/globals/homepage",
            "Ana sayfa",
            "Başlıklar, biyografi, hizmetler, paketler ve sorular",
          ],
          [
            "/admin/globals/body-analysis-settings",
            "Vücut analizi",
            "Görünürlük, güvenli metinler ve mesaj şablonu",
          ],
          [
            "/admin/collections/media",
            "Görseller",
            "Görsel yükle ve açıklamalarını düzenle",
          ],
        ].map(([href, title, note]) => (
          <a href={href} key={href}>
            <strong>{title}</strong>
            <span>{note}</span>
          </a>
        ))}
      </div>
      <a href="/" target="_blank" rel="noopener noreferrer">
        Siteyi yeni sekmede görüntüle
      </a>
      <p className="admin-help">
        İlk girişten sonra profilinden şifreni değiştir. Örnek içerikleri,
        iletişim bilgilerini ve görsel izinlerini yayın öncesinde kontrol et.
      </p>
    </section>
  );
}
