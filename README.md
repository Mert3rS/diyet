# Günay Turan

Günay Turan için hazırlanan, beslenme danışmanlığını dergi estetiğinde anlatan, mobil öncelikli web sitesi. Hedef yayın adresi **https://gunayturan.com.tr**, GitHub deposu [Mert3rS/diyet](https://github.com/Mert3rS/diyet).

**Çalıştırma ve yayın hedefi: Docker + Docker Compose; kaynak depo: GitHub.** Çok aşamalı üretim imajı, ayrı geliştirme/Watch yapılandırması ve GitHub CI hazırdır. Docker'daki Node **24.22.3** sürümü doğrulandı; imaj digest ile sabitlenmiştir.

**Durum: Faz 1 — örnek içerikli tek sayfa önizleme; yayın NO-GO.** `Dyt.` unvanı, biyografi, hizmetler, paketler, yorumlar ve iletişim bilgileri onay bekleyen örnek içeriktir. Site indekse kapalıdır. Faz 2–4 henüz uygulanmadı; CMS/DB ve diğer yayın altyapısı eksiktir. Sağlayıcı bağımsız Faz 5 denetim araçları ve işletim kılavuzları hazırlanmıştır; gerçek yayın tamamlanmış değildir.

## Bu sürümde hazır olanlar

- Next.js 16 App Router, React 19, strict TypeScript ve Tailwind CSS 4.
- Krem, orman yeşili ve lime tasarım sistemi; `next/font` ile Fraunces ve Geist, Türkçe karakter desteği.
- Yapışkan header, klavye ile kullanılabilir mobil menü, mobil sabit randevu çubuğu, yüzen WhatsApp alanı ve başa dön bağlantısı.
- Büyük tipografi, maskeli başlık, çizilen alt çizgi, atlanabilir kısa giriş şeridi, iki fotoğraflı kolaj ve masaüstünde imleç/kaydırma paralaksı.
- Kayan uzmanlık etiketleri; gerçek fotoğraf gelene kadar portre alanı; altı hizmet ve dört aşamalı yapışkan süreç anlatımı.
- Hedef seçimi, ilgili hizmete yönlendirme, yerel mesaj taslağı ve kopyalama; üç örnek paket.
- Sürüklenebilir, görünürken otomatik ilerleyen ve duraklatılabilen örnek yorum kaydırıcısı.
- Bağlantısız “Yakında” blog kartları ve klavye ile açılabilen SSS.
- Hedef seçiminin ardından **Vücut analizi**: tarayıcıda tahmini yağ oranı aralığı, ölçüm ipuçları, koruyucu sınırlar ve düzenlenebilir/onaylı WhatsApp taslağı. Eski enerji hesaplayıcısı kaldırıldı. Araç geliştirmede açık, üretimde varsayılan olarak kapalıdır.
- Sosyal hesapların dört alanda aynı **`getSocialLinks()`** kaynağından sunulması; HTTPS/görünürlük filtresi ve on platform için inline SVG simgesi.
- Sosyal alan için asimetrik hesap kartları, açıklamalı platform adları, ince footer kapsülleri ve masaüstü ikon şeridi; iletişim bölümünde içeriği örtmeyen, klavyeyle açıklaması açılan yuvarlak WhatsApp düğmesi.
- Tek `USE_MOCK_CONTENT` bayrağı, merkezi `mock-data.ts`, her örnek kayıtta `isMock: true`; yalnızca development'ta küçük örnek içerik rozeti.
- Yerel WebP fotoğraflar, Türkçe alt metinler, blur önizleme, responsive `next/image` ve belgelenmiş kaynaklar.
- Azaltılmış hareket desteği, görünür odak, içeriğe atlama bağlantısı, 404, lint/tip/build ve Playwright + axe kontrolleri.

**Bu fazda backend yoktur:** CMS, veritabanı, API route'u, veri kaydeden form, ödeme veya randevu depolama eklenmedi. Hesaplama değerleri tarayıcıda işlenir; analytics, takip çerezi veya yerel veri saklama kullanılmaz. Haricî bağlantılar ancak ziyaretçi seçerse açılır.

Vücut analizi ölçüleri sunucuya göndermez. Ziyaretçi taslağı okuyup onay vererek WhatsApp bağlantısını açarsa seçtiği bilgiler **haricî WhatsApp URL'sine** eklenir; site URL'sine eklenmez. Mesajı gönderme kararı WhatsApp'ta da ziyaretçidedir. Gerçek numara olmadığı için mevcut önizlemede gönderim düğmesi kapalıdır; telefon/e-posta alternatifleri onay bekleyen iletişim bölümüne gider.

Araç ayarları `getBodyAnalysisSettings()` → [src/content/body-analysis.ts](src/content/body-analysis.ts) üzerinden gelir. Payload kurulmadı; `/admin`, Global, yetki/revalidation ve yönetici önizlemesi **Faz 2'yi bekler**. Kaynaklar, hata payları, sınırlar ve referans testleri [araç belgesinde](docs/body-analysis.md), düzenleme adımları [Türkçe yönetim kılavuzunda](docs/admin-guide-tr.md) açıklanır.

## Önizleme ve gerçek iletişim arasındaki fark

Gerçek telefon ve e-posta henüz doğrulanmadığı için CTA'lar iletişim bölümüne gider; arama veya mesaj göndermez. `getContactLinks()` onaylı, `isMock: false` kayıt için `wa.me`, `tel:` ve `mailto:` bağlantısı üretecek şekilde hazırdır. Hedef seçimi önceden doldurulmuş WhatsApp mesajını hazırlar; geçerli alıcı yokken yalnızca önizler/kopyalar.

Sosyal örnekler ayrılmış `https://example.invalid/...` adreslerini kullanır. Bunlar hiçbir gerçek kişinin hesabına yönlenmez ve tıklanınca çalışan sosyal profil açmaz. Canlıya çıkmadan değiştirilmelidir.

## Teknoloji ve kurulum

Önerilen çalışma ortamı **Docker Desktop (Linux konteynerleri) + Docker Compose** ve Git'tir. Host makinede Node/npm kurulması gerekmez. Bağımlılıklar Linux imajında `npm ci` ile kurulur; host `node_modules`, `.next`, `.git` ve gerçek env dosyaları Docker context'ine girmez. npm bağımlılıkları ve Node imajı sabitlenmiştir.

```bash
git clone https://github.com/Mert3rS/diyet.git
cd diyet
docker compose -f compose.dev.yaml up --build --watch
```

Docker geliştirme adresi: [http://localhost:3001](http://localhost:3001). Kaynak/görsel değişiklikleri Compose Watch ile aktarılır; paket/config değişiklikleri yeniden derlenir. Host dosyaları ve konteynerin Linux bağımlılıkları birbirine karışmaz.

Üretim derlemesini yerelde denemek için:

```bash
docker compose up --build -d --wait
docker compose logs --follow web
```

Adres: [http://localhost:3000](http://localhost:3000). Bu modda vücut analizi varsayılan kapalıdır. `SITE_URL` build ve runtime'da `https://gunayturan.com.tr` varsayılanını kullanır; env dosyası gerekmez. `APP_PORT` ile boş bir port seçilebilir. Çalıştırma, durdurma, önbellek, test, GitHub ve reverse proxy ayrıntıları [Docker kılavuzunda](docs/docker.md).

Docker dışında geliştirme gerekirse Node **24.22.3** kullanın (`.node-version`/`.nvmrc`); ardından `npm ci` ve `npm run dev`. Docker geliştirme sunucusu ayrı olarak 3001 portunu kullanır.

Yalnız Docker dışındaki yerel geliştirme için isteğe bağlı ortam dosyası:

```powershell
Copy-Item .env.example .env.local
```

macOS/Linux: `cp .env.example .env.local`.

| Değişken   | Kullanım                                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `SITE_URL` | Metadata kök adresi. Örnek dosyada localhost; yoksa `siteConfig.productionUrl`. Yayında `https://gunayturan.com.tr` kullanılır. |

Gerçek sırları Git'e eklemeyin. Faz 1 API anahtarı, veritabanı veya e-posta kimlik bilgisi gerektirmez. `next/font/local` yerel WOFF2 fontları sunar; geliştirme, derleme ve ziyaret sırasında Google Fonts bağlantısı gerekmez.

## Komutlar ve doğrulama

| Komut              | Görev                                                               |
| ------------------ | ------------------------------------------------------------------- |
| `npm run dev`      | Geliştirme sunucusu                                                 |
| `npm run check`    | Sıfır uyarı eşiğiyle ESLint ve Next route tipleri dahil TypeScript  |
| `npm run build`    | Production derlemesi                                                |
| `npm start`        | Önceden derlenmiş uygulama                                          |
| `npm run test:e2e` | Playwright: responsive görünüm, etkileşimler, veri sınırları ve axe |
| `npm run format`   | Prettier ile kaynak ve belge biçimlendirme                          |

İlk tarayıcı testi öncesinde:

```bash
npx playwright install chromium --only-shell
npm run test:e2e
```

Testler varsayılan olarak 3000 portundaki geliştirme sunucusunu kullanır veya başlatır. Başka bir sunucuya karşı PowerShell'de:

```powershell
$env:TEST_BASE_URL = 'http://127.0.0.1:3015'
npm run test:e2e
Remove-Item Env:TEST_BASE_URL
```

320, 390, 768 ve 1440 px; Türkçe belge dili, tek h1, görsel yükleme, bölüm bağlantıları, mobil menü, hedef mesajı, hesaplama, SSS, yorum geçişi, sosyal URL güvenliği, azaltılmış hareket ve axe WCAG A/AA kontrol edilir. Ekran görüntüleri/başarısız test izleri Git dışındaki `test-results/` altına yazılır.

GitHub Actions; lint/tip, operasyon ve sır kontrollerinden sonra Docker üretim imajını derler, başlatır, HTTP/statik varlık/görsel optimizasyonunu denetler; geliştirme konteynerinde Playwright testlerini çalıştırır. Registry'ye imaj yayımlama ve sunucuya otomatik deployment yapılandırılmadı. GitHub'da çalıştığı push sonrası Actions ekranından doğrulanmalıdır.

## Dosya yapısı ve düzenleme

```text
src/
├── app/                    # Route, layout, metadata, 404 ve site grubu
├── components/
│   ├── home/               # Ana sayfa bölümleri ve küçük etkileşimler
│   ├── site/               # Header, mobil menü, footer ve sabit CTA'lar
│   └── ui/                 # Görsel, sosyal simge, reveal ve hareket yardımcıları
├── config/site.ts          # Marka, menü, USE_MOCK_CONTENT, smoothScroll
├── content/
│   ├── mock-data.ts        # Örnek metin ve kayıtların tek kaynağı
│   ├── home.ts             # Ana sayfa içerik erişimi
│   └── images.ts           # Fotoğraf, alt metin ve kaynak envanteri
├── lib/
│   ├── site-settings.ts    # getSocialLinks, iletişim ve güvenli bağlantılar
│   └── calculations.ts     # Yan etkisiz hesaplama ve aralık denetimi
├── styles/globals.css      # Tasarım değişkenleri, bölüm stilleri, responsive/motion
└── types/content.ts        # İçerik ve sosyal platform tipleri
```

`public/images/` fotoğrafları, `tests/e2e/` kontrolleri, `docs/` kararları içerir. Örnek içerik importları yalnızca veri erişim katmanındadır; sosyal bileşenler mock dosyasını doğrudan okumaz. `getSocialLinks()` şimdiden async olduğundan Faz 2'de veri kaynağı değişirken sosyal görünüm bileşenleri aynı kalabilir.

`USE_MOCK_CONTENT=false` örnek ana sayfayı kaldırır ve sosyal listeyi boş döndürür. Gerçek içerik kaynağı bağlanana kadar “İçerik hazırlanıyor” gösterilir. Bu bayrağı kapatmak tek başına siteyi yayına hazır yapmaz.

Gerçek portreyi `public/images/portrait.jpg` olarak ekleyin. Dosya mevcutsa sonraki sayfa üretimi/production derlemesi fotoğrafı otomatik kullanır; stok bir kişi fotoğrafı Günay Turan olarak gösterilmez.

## Hareket ve hesaplayıcı sınırları

Lenis yalnızca masaüstünde ve azaltılmış hareket kapalıyken dinamik yüklenir; `siteConfig.smoothScroll=false` ile tamamen kapatılabilir. Mobilde imleç/paralaks yoktur. Azaltılmış harekette giriş şeridi, marquee, autoplay ve kaydırma animasyonları kapatılır. Metinler ilk HTML'de okunur; ana fotoğraf animasyon tamamlanmasını beklemez. Hesaplayıcı yakın görünümde dinamik yüklenir.

Animasyonlar transform, opacity ve clip-path kullanır. SSS'nin açılışı native `details` ve kısa clip/opacity geçişidir; layout ölçüsünü animasyonla değiştirmemek için height animasyonu kullanılmadı. Hedef kartı seçilince açılır; kullanıcı “İlgili hizmeti gör” ile ilgili bölüme geçer, beklenmedik otomatik sayfa sıçraması yapılmaz.

Hesaplayıcı yalnızca 20–78 yaş yetişkinler için BKİ ve yaklaşık günlük enerji harcaması gösterir. Formül, kapsam ve kaynaklar arayüzde açıklanır; sonuç tanı veya tüketim hedefi değildir. Kişisel değerler WhatsApp mesajına eklenmez.

## Belgeler ve sonraki aşama

Sağlayıcı seçimleri `ops/decisions.json` içinde `null` durumundadır. Hosting, DB, storage, e-posta, analytics/none, DNS, monitoring, bütçe ve tarih belirlenmeden deploy workflow'u veya DNS değerleri üretilmez.

Operasyon komutları:

```bash
npm run env:check
npm run test:ops
npm run secrets:audit
npm run launch:audit
npm run smoke -- http://127.0.0.1:3015
```

`npm start` artık ortam doğrulamasından geçer; production SITE_URL zorunludur. Yerel production önizlemesinde terminale `SITE_URL=https://gunayturan.com.tr` verin veya `.env.production.local` kullanın. `npm run dev` bu kontrolden etkilenmez. [Ortam envanteri](docs/env-reference.md) dosya önceliklerini ve fake örnekleri açıklar.

`launch:audit` mevcut örnek içerik, eksik CMS/route/hukuk metinleri ve bekleyen seçimler nedeniyle **başarısız olmalıdır**; bayrağı kapatmakla geçmez. CMS kayıt denetleyicisi ve staging/restore kanıtları henüz bağlanmamıştır; araç bu durumlarda kapalı kalır. `smoke` salt okunur GET kontrolleri yapar; form göndermez, gizli API'leri veya sosyal hesapları sorgulamaz. Başarısızlıklar ve yapılamayanlar ayrı raporlanır. JSON raporları `.reports/` altındadır.

`next.config.ts` ile `nosniff`, `strict-origin-when-cross-origin` ve `DENY` başlıkları eklendi. CSP, HTTPS/HSTS, canonical yönlendirmeler ve CMS uyumluluğu staging/sağlayıcı kararını bekler. Header/footer veya ana sayfa görünümü değiştirilmedi. Dependabot ve genişletilmiş CI tanımları commit/push sonrası GitHub'da doğrulanmalıdır.

- [Yayın hazırlığı ve sonuç raporu](docs/launch-readiness.md)
- [Ortam değişkenleri](docs/env-reference.md)
- [DNS/TLS kılavuzu](docs/domain-dns-runbook.md)
- [Yedek/restore kılavuzu](docs/backup-restore-runbook.md)
- [İşletim ve acil durum](docs/ops-runbook.md)
- [Yayın günü sırası](docs/launch-day-runbook.md)
- [Hesaplar ve bekleyen maliyetler](docs/costs-and-accounts.md)
- [Teknik gizlilik notları](docs/privacy-notes.md)

- [Tasarım yönü](docs/design-direction.md)
- [Mimari](docs/architecture.md)
- [Görsel/font kaynakları](docs/image-credits.md)
- [Yayın öncesi değiştirilecekler](docs/launch-checklist.md)
- [Faz 1 doğrulama raporu](docs/verification.md)
- [Yol haritası](docs/roadmap.md)
- [Gelecekteki içerik modeli](docs/content-model.md)

Referans [Sporcu Diyetisyenim](https://sporcudiyetisyenim.com/) yalnızca ilk bilgi mimarisi incelemesinde kullanıldı; kimliği, fotoğrafları veya metinleri aktarılmadı. Paylaşılan `read.txt` farklı projenin README örneğidir; bu deponun talimatı veya tamamlanan özellik kaydı değildir.

Faz 2 talebi alındı. Önceki host Node 24.20.0 minimum sürüm engeli Docker'da doğrulanmış **24.22.3** ile karşılandı; CMS henüz kurulmadı. Payload/Next/PostgreSQL entegrasyonu ayrı doğrulanıp uygulanmalı; Faz 3 içerik ve Faz 4 talep formu buna bağlıdır. Bu hazırlık hiçbir sağlayıcı hesabını, DNS'i, indeksi, analitiği veya production formunu etkinleştirmez.
