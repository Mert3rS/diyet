# Ortam değişkenleri

`node scripts/setup-cms-env.mjs --email ...`, `.env.cms.local` ve `.env.cms.production` oluşturur; mevcut dosyaları korur. Parolalar ve ilk giriş bilgileri `.reports/admin-credentials.txt` dosyasına yazılır. Bu dosyaların tamamı Git ve Docker build context dışında tutulur. Geliştirme/üretim sırları farklıdır.

| Değişken                                        | Görev                                                                      |
| ----------------------------------------------- | -------------------------------------------------------------------------- |
| PAYLOAD_SECRET                                  | Oturum imzalama sırrı; rastgele 96 hex karakter                            |
| DATABASE_URI                                    | Konteynerler arası PostgreSQL bağlantısı; host `db`                        |
| POSTGRES_USER / POSTGRES_DB / POSTGRES_PASSWORD | PostgreSQL ilk kurulum bilgileri                                           |
| CMS_ADMIN_EMAIL / CMS_ADMIN_PASSWORD            | Yalnız boş DB'de ilk yönetici oluşturma; sonra değiştirilmiş şifre ezilmez |
| CMS_ENVIRONMENT                                 | İlk analiz görünürlüğü: development açık, production kapalı                |
| SITE_URL                                        | Compose tarafından verilir; üretim canonical https://gunayturan.com.tr     |
| CMS_ALLOWED_ORIGINS                             | Compose tarafından verilen virgülle ayrılmış CORS/CSRF kökenleri           |
| APP_PORT / DEV_PORT                             | Compose host portları; varsayılan 3000 / 3001                              |
| APP_BIND_ADDRESS                                | Üretim bind adresi; varsayılan 127.0.0.1                                   |

Compose env_file ile runtime sırlarını yükler; `SITE_URL` ve `NODE_ENV` service.environment üzerinden önceliklidir. Host `npm run dev` bu özel env dosyalarını kendiliğinden okumaz; Docker önerilir. Doğrudan çalıştırmada ayrıca host PostgreSQL ve uygun `.env.local` gerekir; Docker `db` hostname'i host'ta çözülmez.

Build yalnız SITE_URL doğrular; runtime başlatma sır/URI biçimini, health DB erişimini kontrol eder. Ortam değerleri hata raporlarına yazılmaz. `.env.example` yalnız örnek envanterdir, gerçek parola içermez. Production e-posta servisi, dış storage, analytics ve DNS erişim bilgileri yapılandırılmadı.

Volume mevcutken POSTGRES_PASSWORD değiştirmek DB rol parolasını değiştirmez. Parola rotasyonunda DB rolü ile uygulama URI/env birlikte ve yedekli bir operasyonla güncellenmelidir. PAYLOAD_SECRET değiştirmek mevcut oturumları geçersiz kılar.
