# Docker işletimi

Docker Desktop Linux motoru ve Compose gerekir. Ortamları önce [README](../README.md) üzerinden `scripts/setup-cms-env.mjs --email ...` ile oluşturun. Gerçek e-posta ve parolalar Git'e girmez. Betik mevcut env dosyalarını korur.

```sh
docker compose -f compose.dev.yaml up --build --watch
docker compose -f compose.dev.yaml ps
docker compose -f compose.dev.yaml logs --follow web
```

Geliştirme site/panel: `http://localhost:3001` ve `/admin`. `DEV_PORT` ile değişir. Compose Watch kaynak ve public dosyalarını aktarır; paket/config değişikliklerinde imajı yeniler. Kaynaklar host `node_modules` ile paylaşılmaz. CMS şemasını değiştirmek ayrıca migration gerektirir.

Üretim: `docker compose up --build --detach --wait`. Varsayılan port 3000; yerel önizlemede PowerShell `$env:APP_PORT='3002'` ile 3002 seçilir. Bind varsayılan `127.0.0.1` olduğundan dış erişim için sunucuda TLS reverse proxy gerekir. SITE_URL varsayılanı `https://gunayturan.com.tr`. Yerel çalıştırma alan adını yayınlamaz.

Her iki ortamda üç servis bulunur: `db` PostgreSQL 17, `cms-init` migration/ilk veri hazırlama, `web` Next/Payload. Web, DB sağlıklı ve init başarılı olmadan başlamaz. DB portu host'a açılmaz. `/api/health` DB sorgusu yapar, hazır değilse 503 verir; bağlantı sırlarını döndürmez.

`diyet-dev_pg_data` ve `diyet_pg_data` farklı veritabanlarıdır. Ortamlara ait `media` volume'leri yüklenen görselleri, üretimde `next_cache` optimizasyon önbelleğini tutar. `down` konteynerleri durdurur, volume'leri korur. **`down -v` kullanmayın:** DB ve yüklemeleri siler. Kaynak kodu pushlamak veri veya görselleri GitHub'a taşımaz.

Yeni şema için kaynak/config değişikliğinden sonra, Node bağımlılıkları olan tooling ortamında `npm run payload -- migrate:create aciklayici_ad` kullanın; üretilen TS/JSON ve index dosyalarını inceleyip commit edin. `push:false` ile otomatik şema push kapalıdır. Yeniden başlatma `cms:migrate` ve `cms:seed` çalıştırır; mevcut kayıtlar ve parolalar korunur. Üretim migration öncesi DB ve medyayı yedekleyin. Runner derlemesi DB veya yönetici şifresi gerektirmez; sırlar yalnız runtime env_file ile verilir.

```sh
docker compose -f compose.dev.yaml exec web npm run check
docker compose -f compose.dev.yaml down
docker compose down
```

Üretim runner root olmayan kullanıcı, salt okunur kök dosya sistemi ve yazılabilir medya/cache volume'leriyle çalışır. Tooling imajı migration CLI'sını içerir; sunucu runner'ı CLI olarak kullanılmaz. GitHub Actions geçici env oluşturup imaj/HTTP/tarayıcı kontrollerini çalıştırır. Otomatik sunucu deployment veya dış yedekleme henüz yoktur.
