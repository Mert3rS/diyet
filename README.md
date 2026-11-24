# Günay Turan · Spor ve Beslenme

Mavi-beyaz, hareketli ana sayfa ve aynı tasarımın içeriklerini yöneten Türkçe Payload admin paneli. Next.js 16.4.6, React 19.3.1, Payload 3.94.1, PostgreSQL 17 ve sabit Node 24.22.3 ile çalışır. Ana sayfa artık CMS kayıtlarından okunur.

## Yerel başlangıç

Docker Desktop Linux motoru gereklidir. Mevcut kurulumda:

```powershell
docker compose -f compose.dev.yaml up --build --detach --wait
docker compose -f compose.dev.yaml watch --no-up
```

İlk kurulumda ortam dosyaları henüz yoksa Node 24.22.3 ile `node scripts/setup-cms-env.mjs --email kendi-adresiniz@example.com` çalıştırın. Betik mevcut ortam dosyalarını değiştirmez. Başlangıç servisi migration ve seed uygular; mevcut içerikleri ve parolaları ezmez.

- Site: http://localhost:3001
- Yönetim merkezi: http://localhost:3001/admin
- Yeni ana sayfa formu: http://localhost:3001/admin/globals/sports-homepage
- Görsel düzenleyici: http://localhost:3001/admin/visual-editor
- Ortak marka/iletişim ayarları: http://localhost:3001/admin/globals/site-settings
- İlk giriş bilgileri: Git dışındaki `.reports/admin-credentials.txt`.

## Panelden düzenleme

Yeni ana sayfa formunun altı sekmesi slider, bölüm metinleri, biyografi, hizmet/kapsam, hedef kitle, sistem, etkinlikler, tarifler, sosyal kartlar, medya önizlemeleri, yorumlar, SSS, performans panosu ve görünürlüğü yönetir. Kartlar eklenebilir, sıralanabilir ve silmeden gizlenebilir. Slider ve kartların özel fotoğrafları yüklenebilir.

Görsel düzenleyicide yazı/fotoğrafa tıklayın, masaüstü veya mobilde taslağı inceleyin ve kaydedin. Taslak ziyaretçiye görünmez; Kaydet sonrası yeni sayfa isteğinde güncel içerik gösterilir. Yeniden build gerekmez. Marka, menü, sosyal hesaplar, portre, paylaşılan görseller, footer ve isteğe bağlı HTTPS randevu adresi Site ayarları içindedir.

[Adım adım Türkçe yönetim kılavuzu](docs/admin-guide-tr.md).

## Kaynak düzeni

- Marka varsayılanları ve menü: `src/config/site.ts`.
- CMS şeması: `src/cms/globals/sports-homepage.ts` ve `site-settings.ts`.
- İlk içerikler: `src/content/mock-data.ts` ve `sports-defaults.ts`; yalnız boş Global'e seed edilir.
- Canlı içerik okuma/normalizasyon: `src/content/sports-home.ts`, `src/lib/site-settings.ts`.
- Görsel yolları ve kaynakları: `src/content/images.ts`.
- Görsel editör eşlemeleri: `src/lib/visual-editor.ts`.
- Tasarım değişkenleri: `src/styles/globals.css`; panel stilleri `admin.css` ve `visual-editor.css`.
- Şema migration'ları ve üretilen tipler: `src/migrations/`, `src/payload-types.ts`.

Örnek içerik durumu panelde yönetilir. Eski `USE_MOCK_CONTENT` kod anahtarı kaldırıldı. Seed dosyasını değiştirmek mevcut CMS kaydını değiştirmez. Önceki tasarımın `homepage` kayıtları **Eski ana sayfa · Arşiv** altında korunur.

## Doğrulama

```powershell
docker compose -f compose.dev.yaml exec web npm run check
$env:TEST_BASE_URL='http://127.0.0.1:3001'
npx playwright test tests/e2e/sports-admin.spec.ts tests/e2e/sports-home.spec.ts
docker build --target builder --tag diyet-admin:verified .
```

Testler yerel hesapla giriş yapar, geçici içerik/görsel değişikliklerini geri alır. Eski tasarıma bağlı test beklentileri ayrı tarihsel kapsamdadır. [Doğrulama kaydı](docs/verification.md).

Veri ve görseller kalıcı Docker volume'lerindedir. `down -v` kullanmayın. Geliştirme ve üretim verileri ayrıdır; kod pushlamak veri taşımaz. [Docker işletimi](docs/docker.md), [yedekleme](docs/backup-restore-runbook.md), [mimari](docs/architecture.md), [içerik modeli](docs/content-model.md).

## Yayın durumu

Yerel CMS revizyonu tamamlandıktan sonra da site **noindex** kalır. Unvan, biyografi, portre, iletişim, sosyal hesaplar ve örnek içerikler doğrulanmalıdır. Randevu kaydı, ödeme, çalışan iletişim formu, ayrıntı içerik sayfaları ve hukuk metinleri bu sürümde yoktur. Şifre kurtarma e-postası etkin değildir.

Canlı yayın yapılmadı. Render Free + Supabase Free için mevcut [yayın kılavuzu](docs/render-supabase.md) korunur; hesap, sunucu, DNS/TLS ve dış yedek işlemleri ayrı çalışmadır. [Yayın listesi](docs/launch-checklist.md), [görsel kaynakları](docs/image-credits.md), [tasarım kararları](docs/design-direction.md), [yol haritası](docs/roadmap.md).
