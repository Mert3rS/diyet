# Mimari — Faz 1

## Docker ve GitHub çalışma ortamı

Uygulamanın çalışma/yayın hedefi Docker Compose'tur. Node 24.22.3 resmî Linux imajı digest ile sabitlenir; `.nvmrc`, `.node-version` ve engines aynı minimuma göre ayarlanır. Üretim builder'ı `NEXT_OUTPUT_STANDALONE=1` ile standalone çıktı üretir; runner yalnız izlenen bağımlılıklar, statik dosyalar, public ve başlangıç/health scriptlerini taşır. Non-root kullanıcı, read-only kök dosya sistemi, cache volume ve tmpfs ile doğrulandı. Entrypoint npm prestart denetimini atlamaz: üretim env doğrulamasını kendisi çağırır.

`compose.yaml` üretim, `compose.dev.yaml` ayrı geliştirme projesidir. Watch yalnız kaynak/görselleri senkronize eder; host node_modules/.next/env dosyalarını içeri taşımaz. `Dockerfile`, `.dockerignore`, Compose dosyaları ve npm lock Git'e dahildir; env/cache/anahtarlar hariçtir. CI Linux üretim build+health+HTTP/görsel optimizasyonunu ve Docker dev sunucusuna karşı Playwright testlerini içerir. Docker healthcheck GET `/` liveness'tır; CMS/DB readiness ucu eklenmedi. [Çalıştırma kılavuzu](docker.md).

## Yayın hazırlığı ek katmanı

`scripts/` altında env başlangıç kontrolü, fail-closed `launch:audit`, salt okunur HTTP `smoke` ve değer yazdırmayan sınırlı sır imza taraması eklendi. `ops/decisions.json` sağlayıcı/bütçe/tarih kararlarını içerir; şu anda hepsi bekliyor. Bu araçlar CMS/API/DB eklemez. Production başlatma `prestart` üzerinden SITE_URL denetler; CMS eklendiğinde PAYLOAD_SECRET/DATABASE_URI biçim denetimi de uygulanır.

CI'ya operasyon testleri ve sır taraması, ayrıca Dependabot tanımı eklendi; deploy workflow'u sağlayıcı seçilmediğinden yoktur. Üç temel güvenlik başlığı Next config'te tanımlanır; CSP/HSTS ve sağlayıcı redirect/storage/backup entegrasyonları doğrulanmadan eklenmedi. Sağlık endpoint'i DB kontrolü yapılamadığından sahte başarı döndüren stub olarak oluşturulmadı. Güncel sınırlar [yayın hazırlığı raporunda](launch-readiness.md), bağımlı işlemler [işletim kılavuzunda](ops-runbook.md) tutulur.

Tek Next.js uygulaması, varsayılan Server Components ve yerel tipli içerik. Özel API route'u, CMS, veritabanı, kullanıcı hesabı, veri kaydeden form veya ödeme servisi yoktur.

```text
config/site.ts → marka, menü, örnek içerik ve smooth scroll bayrakları
content/mock-data.ts → content/home.ts → Server Component bölümleri
                    → lib/site-settings.ts → getSocialLinks() → dört sosyal alan
content/images.ts → EditorialImage → yerel WebP + next/image
content/body-analysis.ts → lib/site-settings.ts → getBodyAnalysisSettings()
lib/body-analysis/ → lazy client aracı → yerel sonuç → düzenleme/onay → haricî WhatsApp
```

## Yerleşim

`app/` route/layout/metadata, `components/home/` sayfa bölümleri, `components/site/` ortak gezinme/CTA, `components/ui/` küçük ortak parçalar, `content/` içerik, `types/` sözleşmeler, `styles/` tasarım sistemi olarak korunur. Yeni veri yardımcıları `lib/` altındadır. `@/*`, `src/*` konumuna gider.

Yalnızca etkileşim gerektiren küçük bileşenler client'tır: mobil menü, hero kolajı, motion kabuğu/reveal/manyetik bağlantılar, süreç vurgusu, hedef seçimi, yorumlar, hesaplayıcı ve yüzen kontroller. Ana sayfa, içerik seçimi, hizmetler, paketler, blog, SSS ve iletişim gövdesi sunucuda oluşturulur.

## Örnek içerik ve sosyal sınır

`USE_MOCK_CONTENT` tek bayraktır. Kapalıysa örnek sayfa dönmez; sosyal liste boştur. Örnek kayıtlar `isMock: true` içerir. Genel development rozeti production'da gizlenir; biyografi, yorum, iletişim ve paket örnek notları görünmeye devam eder.

`getSocialLinks()` async erişim noktasıdır. Görünmez, boş, geçersiz URL, HTTPS dışı protokol ve URL içine gömülü kimlik bilgisi içeren kayıtlar filtrelenir. Dizi sırası korunur. Sosyal görünümler yalnızca bu işlevi çağırır; boş listede bağlantı alanı dönmez. `SocialIcon` on platform için tek SVG eşlemesidir. Haricî bağlantılar yeni sekme, `noopener noreferrer` ve Türkçe erişilebilir isim kullanır.

`example.invalid` kayıtları gerçek hesap değildir. Faz 2'de async kaynağın CMS ile değiştirilmesi mümkün olacak şekilde sosyal görünüm bileşenleri hazırlanmıştır. Production için mock fallback tasarlanmamıştır; gerçek kaynak bağlanmadan bayrağı kapatmak içeriği boş bırakır.

## İletişim ve veri

`getContactLinks()` mock kayıt için iletişim bölümüne döner. Onaylı kayıt için E.164 telefon doğrulaması ve e-posta biçim denetimiyle `wa.me`, `tel:` ve `mailto:` üretir. Mesaj yalnızca hazırlanır; otomatik gönderilmez. Hedef seçimi ve kopyalama kullanıcı eylemidir, saklama yapmaz.

Eski BMI/enerji hesaplayıcısı kaldırıldı. Vücut analizi `#analiz` içinde, hedef seçimi ile paketler arasındadır. Sunucu yalnızca güvenli ayarları sağlar; form görünüm yaklaştığında dinamik yüklenir. Varsayılanlar ve sabit Türkçe metinler `content/body-analysis.ts`, hesap/validasyon `lib/body-analysis/calculations.ts`, mesaj ve telefon yardımcıları `messages.ts`, ayar allowlist'i `settings.ts` içindedir. Katsayılar, hata payları ve yaş sınırları ayar tipine dahil değildir.

`BodyAnalysisJourney` React context'i yalnızca hizmet seçimini aynı sayfada paylaşır; ölçüler form component state'inde kalır. Modül genelinde ziyaretçiye ait mutable state yoktur. Form gönderimi engellenir; hesap/önizleme/onay sırasında fetch/XHR/beacon, cookie, storage veya site URL'si değişikliği yapılmaz. Alan değişince sonuç ve mesaj onayı düşer. Ziyaretçi mesajı düzenleyip boş başlayan kutuyu işaretlerse yalnızca kendi eylemiyle `wa.me` adresine gider. Bu haricî URL, seçtiği mesaj verisini içerir. Kopyalama API'si kullanılamazsa metin seçilip elle kopyalama anlatılır.

Payload yoktur; getter varsayılanları güvenli birleştirir, onaylı iletişim kaydı/araç numarası/site placeholder sırasını kullanır. Geliştirmede araç açık, production'da kapalıdır. Geçerli numara yoksa gönderim kapalıdır. CMS Global, server access, DB hata politikası ve kaydetme sonrası revalidation henüz uygulanmadı. Ayrıntılar [araç belgesinde](body-analysis.md).

## Hareket ve varlıklar

Motion yalnızca transform/opacity/clip-path geçişleri içindir. Lenis masaüstü + normal hareket tercihinde dinamik import edilir ve cleanup'ta kaldırılır. `smoothScroll=false` ile kapatılabilir. Responsive medya gözlemi `useSyncExternalStore` ile ilk sunucu/tarayıcı HTML'ini tutarlı tutar. Azaltılmış harekette CSS de animasyonları kapatır.

Yerel statik WebP importları boyut ve blur metadata sağlar. Hero fotoğrafı öncelikli, kalanlar lazy'dir. `next/font` fontları kendi alan adından sunar. Portre varlığı sunucuda dosya kontrolüyle belirlenir; production'da yeni portre için rebuild gerekir. Medya yükleme veya yazma endpoint'i yoktur.

## Doğrulama ve sonraki aşama

`npm run check`, `npm run build`, `npm run test:e2e`. Playwright farklı genişlikleri, etkileşimleri, azaltılmış hareketi, gönderim/depolama sınırını; axe erişilebilirliği kontrol eder. Lighthouse production çıktısına karşı ölçülür. Kanıt ve sınırlar [doğrulama raporunda](verification.md) tutulur.

Faz 2 kullanıcı “Phase 2” dediğinde başlar: önce Payload uyumluluğu doğrulanacak; dar kapsamlı Türkçe sosyal/iletişim admin'i, kimlik doğrulama, erişim kontrolü, PostgreSQL, cache invalidation ve migration/yedekleme ayrı uygulanacak. Faz 1 bu altyapıları başlatmaz. Daha geniş blog/tarif CMS planı [içerik modelinde](content-model.md) ayrı bir hedef olarak kalır.
