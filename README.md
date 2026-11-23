# Günay Turan · Beslenme & Yaşam

Günay Turan için Türkçe danışmanlık sitesi ve içerik yönetimi. Hedef yayın adresi **gunayturan.com.tr**; henüz bu alan adına yayın yapılmadı. Next.js 16, React 19, Payload 3 ve PostgreSQL 17, Docker Compose üzerinde çalışır.

Sosyal alanlarda yalnızca **WhatsApp ve Instagram** bulunur. Soldaki sabit şerit kaldırılmıştır; sağ alttaki çift düğme, hakkımda, iletişim ve footer aynı panel ayarlarını kullanır.

## GitHub'dan canlı yayın

Tam sürüm (site, admin ve görsel düzenleyici) için **Render Free + Supabase Free** kurulumu hazırdır. GitHub Pages bu Node/PostgreSQL uygulamasını çalıştıramaz; README'yi görüntülemesi canlı uygulama yayını değildir.

[![Render'da kur](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Mert3rS/diyet)

[Adım adım ücretsiz yayın kılavuzu](docs/render-supabase.md). `render.yaml` ücretsiz web servisini tanımlar; veritabanı ve kalıcı fotoğraf deposu için Supabase bilgileri Render ortamına girilir. Gerçek hesaplara bağlanıp başarılı deploy sonucu alınmadan site canlı sayılmaz. Ücretsiz planlarda uyuma ve kota sınırları vardır.

## Başlatma

Docker Desktop Linux konteynerleri kullanmalıdır. İlk kurulumda Node 24.22.3 ile:

```sh
node scripts/setup-cms-env.mjs --email admin@example.invalid
docker compose -f compose.dev.yaml up --build --watch
```

Örnek e-postanın yerine kendi yönetici adresinizi yazın. Host Node olmadan ilk komutun eşdeğeri:

```powershell
docker run --rm --mount "type=bind,source=$($PWD.Path),target=/workspace" -w /workspace node:24-bookworm-slim@sha256:dc26ae92c9fb15cf6b1d63e20f0944b2efe0f115b20e00be48fb23fceb061c54 node scripts/setup-cms-env.mjs --email admin@example.invalid
```

- Site: [localhost:3001](http://localhost:3001)
- Türkçe yönetim: [localhost:3001/admin](http://localhost:3001/admin), aynı uygulama ve port
- İlk giriş bilgileri: `.reports/admin-credentials.txt`, Git dışında

Kurulum iki ayrı ortam dosyası, bağımsız parolalar ve sırlar oluşturur. Mevcut dosyaları değiştirmez. Başlangıç servisi migration uygular ve boş veritabanını bir kez hazırlar; mevcut içerikleri veya değiştirilen şifreleri ezmez. İlk girişten sonra şifrenizi panelden değiştirin.

Üretim imajını yerelde denemek için PowerShell:

```powershell
$env:APP_PORT = '3002'
docker compose up --build --detach --wait
```

Üretim önizlemesi `http://localhost:3002`, panel `/admin` yolundadır. Varsayılan üretim portu 3000; bu makinedeki önizleme 3002 kullanır. Geliştirme ve üretimin DB/medya volume'leri ayrıdır; içerik otomatik kopyalanmaz.

## Yönetim

**Site ayarları:** marka, düğmeler, iletişim, yalnızca WhatsApp/Instagram, fotoğraflar, menü. **Ana sayfa:** başlıklar, biyografi, hizmetler, süreç, hedefler, paketler, yorumlar, blog önizlemeleri, SSS. **Vücut analizi ayarları:** görünürlük, metinler, hizmetler, isteğe bağlı ölçüler, mesaj şablonu, örnek önizleme ve sıfırlama. Kaydedilen değişiklikler sayfa yenilendiğinde görünür; yeniden build gerekmez. [Kullanım kılavuzu](docs/admin-guide-tr.md).

Fotoğraflar alt metinle yüklenir; JPEG/PNG/WebP/AVIF, en fazla 8 MB. Kullanıcılar ve yazma işlemleri yönetici oturumu gerektirir. Yeni hesapların açık kaydı kapalıdır; son yönetici silinemez. Parola kurtarma e-postası için henüz mail servisi yapılandırılmadı.

## Geliştirme ve kontrol

```sh
docker compose -f compose.dev.yaml exec web npm run check
npm run test:ops
npm run secrets:audit
npx playwright install chromium --only-shell
```

Playwright için `TEST_BASE_URL=http://127.0.0.1:3001` ayarlayıp `npm run test:e2e` çalıştırın. CMS testleri yerel ortam dosyasındaki hesapla giriş yapar, geçici değişikliklerini geri alır; gerçek mesaj göndermez. `npm run test:container -- http://127.0.0.1:3002` üretim HTTP/varlık kontrolüdür. CI aynı Docker akışını ve tarayıcı testlerini çalıştırır.

`src/cms/` alanları ve erişim kurallarını, `src/migrations/` sürümlü şemayı, `src/lib/` veri erişimini, `src/components/` arayüzü içerir. İlk örnek içerikler `src/content/` içinden yalnızca boş DB'ye eklenir; sonraki düzenlemeler panelden yapılır.

## Yayın durumu

İçerikler ve sosyal adresler hâlâ örnektir. Gerçek portre, doğrulanmış unvan/biyografi/hizmetler, telefon ve Instagram adresi panelden girilmelidir. Admin e-postası, halka açık iletişim adresi olarak otomatik kullanılmaz. Blog/tarif ayrıntı sayfaları, randevu kayıt formu, hukuk sayfaları, mail servisi, sunucu/DNS/TLS ve dış yedekleme henüz tamamlanmadı. Arama motoru indekslemesi kapalı; analiz aracı üretim DB'sinde ilk kurulumda kapalıdır. [Yayın durumu](docs/launch-readiness.md).

- [Docker ve kalıcı veriler](docs/docker.md)
- [Mimari](docs/architecture.md) · [İçerik modeli](docs/content-model.md)
- [Ortam değişkenleri](docs/env-reference.md) · [Gizlilik notları](docs/privacy-notes.md)
- [Yedekleme](docs/backup-restore-runbook.md) · [Doğrulama](docs/verification.md)
- [Yol haritası](docs/roadmap.md) · [Görsel kaynakları](docs/image-credits.md)

Paylaşılan `read.txt` başka projenin README örneğidir. Referans sitenin kimliği veya içerikleri bu projeye aktarılmadı.
