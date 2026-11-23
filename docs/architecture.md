# Mimari

Tek Next.js uygulamasında iki root layout vardır: `(site)` halka açık tasarımı, `(payload)` `/admin` ve `/api` uçlarını sunar. Global 404 tam HTML döndürür. Payload 3.94.1, Next 16.4.6 ve Node 24.22.3 ile Docker üzerinde çalışır. PostgreSQL adapteri `push:false` ve sürümlü migration kullanır.

`src/payload.config.ts` kullanıcıları, görselleri ve üç Global'i tanımlar. Türkçe panel, özel başlangıç ekranı ve mesaj önizlemesi vardır. Yönetici yazma izni rol kontrolüne bağlıdır; açık/ilk hesap kaydı engellenir. İlk hesap yalnız yerel bootstrap bağlamında oluşturulur. Son yönetici silinemez. Oturum ömrü iki saat; başarısız giriş sınırı beş deneme/on dakika kilittir. Üretimde cookie Secure, tüm ortamlarda SameSite Lax kullanılır. CORS/CSRF kökenleri açık env listesiyle sınırlıdır.

`src/lib/cms.ts` sunucuya özel Payload Local API erişimidir. `site-settings` ve `homepage` getter'ları veriyi sınırlı tiplere dönüştürür. React cache yalnız istek içi paylaşım sağlar; halka açık sayfa dinamiktir. Kaydetme hook'u `revalidatePath` çağırır. Yeni istekte güncel DB içeriği okunur. DB yokken örnek veriyi sessizce yayınlama yerine hazırlık görünümü gösterilir; health 503 döner.

İlk varsayılanlar `src/content/` içinden sadece `initialized:false` kayıtlarına eklenir. Kaynak mock dosyasını sonradan değiştirmek mevcut CMS kayıtlarını değiştirmez. Marka/menü/sosyal/iletişim, tüm ilgili bölümlere ortak kaynaktan gider. Yalnız WhatsApp/Instagram platformları kabul edilir; solda sabit dock yoktur. Görsel bağlamı istemciye yalnız halka açık URL ve alt metni aktarır.

Medya aynı origin `/api/media/file/...` üzerinden sunulur ve kalıcı Docker volume'ünde tutulur. Yükleme yönetici gerektirir, okuma herkese açıktır; JPEG/PNG/WebP/AVIF ve 8 MB sınırı vardır. SVG yüklenmez. Next görsel optimizasyonu bu URL'leri kullanır.

Vücut analizi ziyaretçinin tarayıcısında hesaplanır; ölçüler CMS'ye, sunucu loguna veya analitiğe gönderilmez. Panel yalnız görünüm/hizmet/alan/mesaj seçeneklerini yönetir; formül ve güvenlik metinleri kodda sabittir. Mail adapteri yapılandırılmadığından şifre kurtarma kontrollü hata döndürür; konsola e-posta içeriği yazılmaz.

Docker build sır veya DB istemez. `cms-init` migration ve idempotent seed uygular; `web` health'i gerçek DB bağlantısını sınar. Geliştirme ve üretim DB/medya volume'leri ayrıdır. Randevu kaydı, blog/tarif ayrıntı CMS'si, hukuk sayfaları ve harici e-posta akışı henüz yoktur.
