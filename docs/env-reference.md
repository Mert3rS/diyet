# Ortam değişkenleri

23 Kasım 2026 denetimi. Mevcut uygulama Faz 1 önizlemesidir; CMS ve sağlayıcı entegrasyonları henüz yoktur. Bu envanter mevcut okuma noktalarını, başlangıç korumasını ve gelecekte bağlanması gereken alanları ayırır. Secret değerleri bu belgeye veya Git'e yazılmaz.

Çalışma/yayın yöntemi Docker Compose'tur. `SITE_URL` üretim imajına build ARG ve runtime env olarak aynı kök adresle verilir; `.env.local`/gerçek env dosyaları imaja kopyalanmaz. `NEXT_OUTPUT_STANDALONE=1` yalnız Docker builder'da standalone çıktıyı seçer; sır değildir. Compose ayarları `APP_PORT`, `APP_BIND_ADDRESS`, `APP_IMAGE` ve geliştirme `DEV_PORT` [Docker kılavuzunda](docker.md) açıklanır. Native Node minimumu 24.22.3; Docker imajı bu sürümle doğrulandı.

| Değişken         | Amaç                                           | Zorunluluk                                                  | Nerede ayarlanır                                                                         | Güvenli örnek                                                         |
| ---------------- | ---------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `SITE_URL`       | Metadata kökü ve production başlangıç denetimi | `npm start` için zorunlu                                    | Seçilecek hosting'in build/runtime ortamı; yerelde `.env.production.local` veya terminal | `https://gunayturan.com.tr`                                           |
| `NODE_ENV`       | Next.js geliştirme/production modu             | Framework yönetir                                           | `next dev`, `next build`, `next start`                                                   | `production`                                                          |
| `PAYLOAD_SECRET` | Gelecekteki CMS oturum imzası                  | Yalnızca Payload kurulduğunda başlangıç korumasında zorunlu | Hosting secret alanı; yerelde Git dışı env dosyası                                       | `CHANGE_ME_WITH_A_RANDOM_SECRET`                                      |
| `DATABASE_URI`   | Gelecekteki PostgreSQL bağlantısı              | Yalnızca Payload kurulduğunda başlangıç korumasında zorunlu | Hosting secret alanı                                                                     | `postgresql://example_user:CHANGE_ME@example.invalid:5432/example_db` |
| `TEST_BASE_URL`  | Playwright test hedefi                         | İsteğe bağlı, testlerde                                     | Test terminali veya CI job'ı                                                             | `http://127.0.0.1:3015`                                               |
| `CI`             | Test sunucusu yeniden kullanım davranışı       | CI platformu yönetir                                        | GitHub Actions                                                                           | `true`                                                                |

E-posta, analitik, depolama ve izleme entegrasyonları kurulmadığı için bunların değişken adları uydurulmadı. Seçilecek adapterlerin resmî belgelerine göre bu tablo ve `.env.example` birlikte genişletilmeli. Mevcut kodda `NEXT_PUBLIC_` secret yoktur; sırları bu önekle tanımlamayın.

## Başlangıç koruması

`npm start`, `prestart` üzerinden `npm run env:check` eşdeğeri denetimi çalıştırır. SITE_URL yoksa, localhost, www, HTTP, sorgulu veya farklı bir alan adıysa başlatmaz. Hata yalnızca anahtar adını/koşulu yazdırır. Payload henüz yokken DB'ye bağlanmış veya sırlarını doğrulamış sayılmaz; Payload eklendiğinde secret/URI biçim denetimi de devreye girer. Gerçek DB erişimi ayrıca health ve smoke kontrolü gerektirir.

Process ortamı önceliklidir. Sonra `.env.production.local`, `.env.local`, `.env.production`, `.env` sırası izlenir; ilk değer korunur. Node'un `parseEnv` ayrıştırıcısı kullanılır, `$DEGISKEN` genişletmesi yapılmaz; literal değer girin. `.env.example` otomatik yüklenmez. Dosyadaki NODE_ENV, production başlangıcını geliştirme moduna çeviremez.

Yerel production önizlemesi:

```powershell
$env:SITE_URL = 'https://gunayturan.com.tr'
npm run build
npm start -- --hostname 127.0.0.1 --port 3015
```

Bu komut DNS değiştirmez ve siteyi yayınlamaz. Metadata statik üretildiği için build ortamındaki SITE_URL de aynı olmalıdır; yalnızca runtime değerini değiştirmek eski build'i düzeltmez. `npm run dev` bu production kapısından geçmez. NODE_ENV/framework sürümleri [Next.js self-hosting belgesine](https://nextjs.org/docs/app/guides/self-hosting) göre birlikte değerlendirilmelidir.

## OWNER ACTION — sır yönetimi

1. Hosting kararı sonrası build/runtime ortamlarını ayrı inceleyin. Production, staging ve yerel sırları paylaşmayın.
2. CMS kurulunca PAYLOAD_SECRET'i kriptografik rastgele üretin; çıktıyı yalnızca parola kasasına ve hosting secret alanına alın. Shell geçmişine gerçek değer yazmayın.
3. DB hesabına yalnızca gerekli veritabanı/şema izinlerini verin. Migrations için gereken yetkiyi app runtime hesabından ayırın; superuser kullanmayın.
4. DB kimlik bilgisi döndürürken yeni hesabı/yetkileri oluşturun, staging'de doğrulayın, production secret'ını değiştirip yeniden başlatın, eski hesabı bağlantılar boşalınca kapatın.
5. PAYLOAD_SECRET değişikliğinin aktif oturumları ve kurulacak Payload'ın imzalı/şifreli verilerini etkileyebileceğini önce staging'de doğrulayın. Secret, oturumlar ve geri yükleme birlikte değerlendirilmeden eski sırları silmeyin.
6. Geliştirmede kullanılan hiçbir gerçek sırrı production'a taşımayın. Sır sızıntısında yalnızca Git kaydını silmek yetmez; önce sağlayıcıdan iptal edin/döndürün.
