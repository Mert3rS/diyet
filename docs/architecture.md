# Mimari

Tek Next.js 16.4.6 uygulamasının `(site)` kökü yeni mavi-beyaz ana sayfayı, `(payload)` kökü mevcut Payload 3.94.1 admin ve API uçlarını sunar. Node 24.22.3, PostgreSQL 17 ve Docker Compose kullanılır. Otomatik şema push kapalı, migration'lar sürümlüdür.

Ana sayfa `getSportsHome()` ile sports-homepage Global'ini okur. Getter yalnız bilinen içerik alanlarını ve aynı-origin medya URL/alt metnini aktarır; ham CMS kaydı tarayıcıya verilmez. React cache istek içi okumaları paylaşır. Ortak marka, menü, iletişim, sosyal bağlantılar ve fotoğraflar getSiteSettings()/getSocialLinks() üzerinden gelir. Halka açık sayfa dinamiktir; kaydetme hook'u revalidatePath çağırır, sonraki istekte güncel içerik görünür.

Başlangıç içerikleri yalnız boş Global'e yazılır. Site ayarları ve eski homepage kayıtları korunur; yeni tasarım ayrı sports-homepage kaydındadır. Mevcut kurulum için upgrade-sports-settings.ts yalnız eksik marka alanlarını, önceki değişmemiş varsayılanları ve yeni bölüm bağlantılarını tamamlayan tek seferlik yardımcıdır. Normal startup bu yükseltmeyi tekrar çalıştırmaz.

Global'ler ve upload koleksiyonu yönetici yazma kuralını korur. Açık kayıt yoktur; son yönetici silinemez. Panel Türkçedir. Metinler düz metindir, uzunlukları sunucuda doğrulanır. Hizmet kimlikleri benzersizdir; en az bir slayt görünür kalmalıdır. Instagram ve harici randevu URL'leri doğrulanır. noindex korunur.

Görsel editör sports-homepage ve site-settings belgelerini okur. Önizleme iframe'i yalnız aynı origin'de açılır. Seçici eşlemeleri yeni tasarımın alan ve satır işaretlerini kullanır. Slayt ve filtre seçimi, açılır hizmetler ve SSS odak işlemleri desteklenir. Metin/görsel taslağı tarayıcı belleğinde kalır; Kaydet API isteğiyle yayınlar. Kaydetme öncesinde updatedAt kontrolü başka sekmedeki güncellemeyi tespit ederse taslağı koruyarak durur. Bu iki Global arasında atomik bir transaction değildir; kısmi kayıt varsa arayüz bildirir.

Medya aynı-origin /api/media/file/... üzerinden sunulur; JPEG/PNG/WebP/AVIF, alt metin ve 8 MB sınırı korunur. Kalıcı media ve PostgreSQL volume'leri yeniden başlatmada veriyi tutar. cms-init migration ve idempotent seed uygular; web health gerçek DB bağlantısını kontrol eder. Build DB/sır gerektirmez; CMS yoksa sayfa hazırlık görünümü verir.

Yeni tasarıma randevu kaydı, ödeme veya çalışan iletişim formu eklenmedi. Eski vücut analizi altyapısı korunur; yeni sayfada analiz bölümü bulunmaz. Canlı hosting, DNS/TLS ve dış yedekleme bu yerel admin revizyonunun kapsamı dışındadır.
