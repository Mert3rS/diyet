# Docker ve GitHub çalışma akışı

Çalışma/yayın hedefi Docker Compose'tur. Sunucu sağlayıcısı, reverse proxy/TLS ve DNS henüz seçilmedi. Mevcut frontend konteynerleşti; CMS, PostgreSQL, randevu API'si veya medya servisi kurulmuş değildir.

## Geliştirme

Docker Desktop'ı **Linux containers** modunda başlatın. Host Node/npm gerekli değildir.

```bash
git clone https://github.com/Mert3rS/diyet.git
cd diyet
docker compose -f compose.dev.yaml up --build --watch
```

`http://localhost:3001`. `compose.dev.yaml` ayrı `diyet-dev` projesidir. Node 24.22.3 ve Linux bağımlılıkları imaj içindedir; kaynaklar `COPY --chown=node:node` ile node kullanıcısına aittir. Watch, `src` ve `public` değişikliklerini aktarır; paket/lock/Next/TypeScript/PostCSS/Dockerfile değişiklikleri rebuild tetikler. `.env`, `.git`, host `node_modules` ve `.next` senkronize edilmez. Değişikliklerin aktarılması için `--watch` komutu açık kalmalı. `initial_sync` için Compose 2.32+ gerekir; bu oturumda Compose 5.6.0 kullanıldı.

Next.js geliştirme kaynakları için yalnız ek `127.0.0.1` hostuna izin verilir (`allowedDevOrigins`); localhost zaten Next tarafından izinlidir. Bu ayar Docker port yönlendirmesinde HMR ve etkileşimli bölümlerin yüklenmesini sağlar; genel wildcard veya production CORS izni eklenmedi.

```bash
docker compose -f compose.dev.yaml logs --follow web
docker compose -f compose.dev.yaml down
```

`down` proje konteynerlerini ve ağını kaldırır; repo dosyalarını silmez. Yeni paket ekledikten sonra lock dosyasını da commit edin; Linux bağımlılıklarını host klasörüne kopyalamayın. Önbelleği silen geniş `docker system prune` veya `down -v` rutin güncelleme komutu değildir.

## Üretim imajını yerelde çalıştırma

```bash
docker compose up --build --detach --wait
docker compose ps
docker compose logs --follow web
docker compose down
```

Varsayılan `http://127.0.0.1:3000`. Port doluysa PowerShell:

```powershell
$env:APP_PORT = '3002'
docker compose up --build --detach --wait
```

`docker compose down`/yeniden `up` komutlarında aynı port ortamını koruyun; Compose proje adı sabittir. Bash eşdeğeri `APP_PORT=3002 docker compose up --build --detach --wait`.

`Dockerfile` aşamaları: bağımlılıklar → geliştirme veya builder → runner. Builder `NEXT_OUTPUT_STANDALONE=1` ayarlayarak Next `output: 'standalone'` üretir; `.next/static` ve `public` ayrıca kopyalanır. Bu bayrak olmadan hosttaki mevcut `npm run build` / `npm start` akışı korunur. Runtime'da tam geliştirme bağımlılıkları gerekmez. `node` kullanıcısı, read-only kök dosya sistemi, yazılabilir `next_cache` volume'ü ve `/tmp` tmpfs'i vardır. Tüm Linux yetenekleri kaldırılır; init ve SIGTERM aktarımıyla kapanış sağlanır. Cache yalnız uygulama/görsel önbelleğidir; ziyaretçi ölçüleri için veri deposu değildir.

Standalone sunucu npm `prestart` çalıştırmadığından entrypoint **aynı production env doğrulamasını** açıkça çalıştırır. Boş/yanlış `SITE_URL` ile başlamaz. Konteyner healthcheck'i yalnız `GET / → 200` kontrolüdür; DB readiness veya yayın onayı değildir. `/api/health` varmış gibi stub eklenmedi.

İmaj Node tabanı resmî `node:24-bookworm-slim` çok platformlu manifest digest'iyle sabittir. `node --version` sonucu **v24.22.3**; `.nvmrc`, `.node-version` ve package engines bununla uyumludur. Dependabot Docker digest güncellemesi önerir; yeni digest'in Node sürümü ve testleri incelenmeden birleştirilmemeli. Eski host Node 24.20.0 geliştirmeye uygun sayılmaz; Docker kullanımı host yükseltmesini gerektirmez. Planlanan Payload'ın önceki Node minimum engeli konteynerde karşılandı; Payload/Next/PostgreSQL entegrasyonu henüz test edilmedi.

## Ayarlar ve sırlar

| Değişken                         | Varsayılan / kapsam                                                 |
| -------------------------------- | ------------------------------------------------------------------- |
| `SITE_URL`                       | Üretim build + runtime: `https://gunayturan.com.tr`                 |
| `APP_PORT`                       | Üretim host portu: `3000`                                           |
| `APP_BIND_ADDRESS`               | `127.0.0.1`; public arayüz açma kararı sunucu mimarisine bağlı      |
| `APP_IMAGE`                      | Yerel üretim imaj adı `diyet-web:local`; otomatik registry push yok |
| `DEV_PORT`                       | Geliştirme host portu `3001`                                        |
| `NODE_ENV` / `PORT` / `HOSTNAME` | Compose tarafından mod ve konteyner içi `3000` / `0.0.0.0`          |

Env dosyası gerekmez. Compose yalnız `.env` dosyasını otomatik interpolation için okur; Next'in `.env.local` dosyası konteynere taşınmaz. `.env.example` içindeki localhost değerini production `.env` dosyasına olduğu gibi kopyalamayın. `SITE_URL` statik metadata'da build sırasında kullanılır; değiştirilince imajı yeniden derleyin. Gerçek sırlar build ARG/ENV/COPY içine eklenmemeli; CMS kurulunca runtime secret/env ve DB/medya volume mimarisi ayrıca eklenecek. Şu an gerçek secret gerekmez.

## Kontroller

Çalışan geliştirme konteynerinde:

```bash
docker compose -f compose.dev.yaml exec web npm run check
docker compose -f compose.dev.yaml exec web npm run test:ops
```

Üretim konteynerinde `node scripts/docker-healthcheck.mjs` çalıştırılabilir. `npm run test:container -- http://127.0.0.1:3000` komutu host Node 24.22.3 veya GitHub CI içindir; ana sayfa, güvenlik başlıkları, JS/CSS/fontlar, gerçek görsel optimizasyonu ve 404'ü kontrol eder. Geniş `launch:audit`/`smoke` gelecekteki CMS/route beklentilerini de denetler ve mevcut örnek içerikte NO-GO dönmeye devam eder.

GitHub Actions Node 24.22.3 ile host kontrollerini, ardından **Linux Docker üretim build/health/HTTP** ve **Docker geliştirme sunucusuna karşı Playwright** akışını çalıştırır. GitHub job sonucu yerel test sonucu değildir; push sonrası Actions ekranından incelenmeli.

## GitHub gönderimi ve sunucuda güncelleme

Hedef `origin`: `https://github.com/Mert3rS/diyet.git`, ana dal `main`. Önce değişiklikleri ve `npm run secrets:audit` çıktısını inceleyin. `.gitignore` env/rapor/build/cache/medya içeriklerini, `.dockerignore` da gerçek env ve özel anahtarları build context'inden çıkarır. Kaynak kodu, package lock, Docker/Compose ve CI dosyaları Git'e girer. Sır taraması sınırlıdır; elle inceleme yerine geçmez.

```bash
git status
git add .
git commit -m "Configure Docker development and production workflow"
git push -u origin main
```

Sunucuda doğrulanmış release commit'ini checkout edin, uygulama portunu ve gerçek production ortamını doğrulayıp `docker compose up --build --detach --wait` kullanın. Şu an sunucuya deploy/registry push/DNS işlemi tanımlı değildir. Basit tek konteyner güncellemesinin sıfır kesinti garantisi yoktur; gerçek release/rollback ve ilerideki DB migration/yedek akışı ayrıca hazırlanmalı.

Public `gunayturan.com.tr` yayını için uygulamanın önünde TLS sonlandıran reverse proxy gerekir. Varsayılan Compose portu loopback'e bağlıdır; aynı hosttaki proxy kullanabilir. Ayrı proxy konteyneri seçilirse ortak Docker ağı/servis yönlendirmesi düzenlenmelidir; körlemesine `0.0.0.0` açmayın. Günay Turan'ın gerçek içerik, iletişim ve hukuk metni onayları tamamlanmadan public yayın veya indeksleme açılmamalı.

Kaynaklar: [Next standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output), [Next self-hosting](https://nextjs.org/docs/app/guides/self-hosting), [Docker Compose Watch](https://docs.docker.com/compose/how-tos/file-watch/), [Compose hizmetleri](https://docs.docker.com/reference/compose-file/services/).
