# Ortam değişkenleri

`node scripts/setup-cms-env.mjs --email ...`, `.env.cms.local` ve `.env.cms.production` oluşturur; mevcut dosyaları korur. Parolalar ve ilk giriş bilgileri `.reports/admin-credentials.txt` dosyasına yazılır. Bu dosyaların tamamı Git ve Docker build context dışında tutulur. Geliştirme/üretim sırları farklıdır.

| Değişken                                        | Görev                                                                                 |
| ----------------------------------------------- | ------------------------------------------------------------------------------------- |
| PAYLOAD_SECRET                                  | Oturum imzalama sırrı; rastgele 96 hex karakter                                       |
| DATABASE_URI                                    | Konteynerler arası PostgreSQL bağlantısı; host `db`                                   |
| POSTGRES_USER / POSTGRES_DB / POSTGRES_PASSWORD | PostgreSQL ilk kurulum bilgileri                                                      |
| CMS_ADMIN_EMAIL / CMS_ADMIN_PASSWORD            | Yalnız boş DB'de ilk yönetici oluşturma; sonra değiştirilmiş şifre ezilmez            |
| CMS_ENVIRONMENT                                 | İlk analiz görünürlüğü: development açık, production kapalı                           |
| SITE_URL                                        | Compose tarafından verilir; üretim canonical https://gunayturan.com.tr                |
| CMS_ALLOWED_ORIGINS                             | Compose tarafından verilen virgülle ayrılmış CORS/CSRF kökenleri                      |
| APP_PORT / DEV_PORT                             | Compose host portları; varsayılan 3000 / 3001                                         |
| APP_BIND_ADDRESS                                | Üretim bind adresi; varsayılan 127.0.0.1                                              |
| RENDER_EXTERNAL_URL                             | Render'ın verdiği HTTPS adresi; SITE_URL boşken canonical ve origin olarak kullanılır |
| MEDIA_STORAGE                                   | `s3` ise Supabase/S3 kalıcı depolama; yerel Docker'da boş bırakılır                   |
| S3_BUCKET / S3_ENDPOINT / S3_REGION             | Supabase bucket, S3 endpoint ve region bilgileri                                      |
| S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY         | Yalnız sunucuda kullanılan S3 erişim anahtarları                                      |

Compose env_file ile runtime sırlarını yükler; `SITE_URL` ve `NODE_ENV` service.environment üzerinden önceliklidir. Host `npm run dev` bu özel env dosyalarını kendiliğinden okumaz; Docker önerilir. Doğrudan çalıştırmada ayrıca host PostgreSQL ve uygun `.env.local` gerekir; Docker `db` hostname'i host'ta çözülmez.

Build yayın adresini doğrular; runtime başlatma sır/URI ve depolama ayarlarını, health DB erişimini kontrol eder. Render'da S3 ayarları eksikse kalıcı olmayan diske sessizce dönülmez. Ortam değerleri hata raporlarına yazılmaz. `.env.example` yalnız örnek envanterdir, gerçek parola içermez. [Render + Supabase kurulumu](render-supabase.md) hazırdır; gerçek hesap, veritabanı ve bucket bağlantıları henüz tamamlanmamıştır. E-posta, analytics ve DNS ayrıca yapılandırılır.

Volume mevcutken POSTGRES_PASSWORD değiştirmek DB rol parolasını değiştirmez. Parola rotasyonunda DB rolü ile uygulama URI/env birlikte ve yedekli bir operasyonla güncellenmelidir. PAYLOAD_SECRET değiştirmek mevcut oturumları geçersiz kılar.
