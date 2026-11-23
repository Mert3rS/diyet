# Yayın hazırlığı sonuç raporu

## Sonraki Docker güncellemesi

Çalışma/yayın yöntemi artık Docker Compose'tur. Resmî Node imajında **24.22.3** doğrulandı ve digest ile sabitlendi; `.nvmrc`/`.node-version` kesin sürüme, engines minimumuna çekildi. Docker Desktop başlatıldı; Linux üretim ve geliştirme konteynerleri çalıştırıldı. Önceki Node sürümü/daemon engeli bu ortamda giderildi. Üretim konteyneri health, HTTP/statik dosya/görsel optimizasyonu ve yanlış SITE_URL ile başlamama denetimlerini geçti. CMS/DB kurulmadı; gerçek içerik ve diğer yayın engelleri sürüyor.

Aşağıdaki Faz 5 tablosu **önceki denetimin tarihsel kaydıdır**: 34 engel, Node 24.20.0, daemon ve önceki başlatma reddi bulguları güncel Docker çalışmasının sonucu değildir. Tam yayın audit'i yeniden geçmiş kabul edilmez. Güncel yapılandırma ve test ayrıntıları [Docker kılavuzunda](docker.md) ve [doğrulama raporunda](verification.md).

**Karar: NO-GO. Faz 5 tamamlanmış değildir.** Denetim tarihi 23 Kasım 2026. Gönderilen metin Faz 1–4'ün hazır olduğunu varsayıyordu; mevcut depoda yalnızca Faz 1 ve bu çalışmada eklenen operasyon hazırlığı vardır. CMS/DB, admin, blog/tarif/medya, hukuk sayfaları, randevu/e-posta/consent ve sağlık ucu bulunmaz.

## Hazırlananlar

- `launch:audit`: build ve kaynak üzerinde örnek kayıt, placeholder, eksik route/altyapı/karar denetimi. Gerçek CMS kayıt denetleyicisi bağlı olmadığı için fail-closed davranır; bayrağı kapatınca yanlış GO vermez. Mevcut kapsam tam bir canlı CMS içerik denetleyicisi değildir.
- `smoke`: HTTP durumları, robots/meta/sitemap politikası, admin noindex, health, güvenlik başlıkları, canonical, iç link/anchor ve sosyal URL kontrolleri. Salt okunur GET kullanır; form göndermez, sosyal profilleri veya gizli API'leri sorgulamaz. Production yönlendirmeleri yalnızca production kökü açıkça hedef verildiğinde denenir.
- `env:check` + `prestart`: SITE_URL canonical kökü denetlenir. Gelecekte Payload kurulunca secret/URI biçimi de denetlenir. Ortam değerleri yazdırılmaz; gerçek DB bağlantı testi eklenmiş sayılmaz.
- `secrets:audit`: izlenen/yok sayılmayan çalışma dosyaları ve varsa yerel Git geçmişi üzerinde sınırlı imza taraması; yalnızca kod/konum döner, değer yazdırmaz. Kapsamı profesyonel/tam bir sır veya kişisel veri denetimine eşdeğer değildir.
- Beş Node operasyon testi, genişletilmiş CI, npm/Actions için Dependabot tanımı ve dokuz bekleyen kararı tutan `ops/decisions.json`.
- Türkçe [ortam](env-reference.md), [DNS/TLS](domain-dns-runbook.md), [backup/restore](backup-restore-runbook.md), [işletim](ops-runbook.md), [yayın günü](launch-day-runbook.md), [maliyet/hesap](costs-and-accounts.md) ve [teknik gizlilik](privacy-notes.md) kılavuzları.

## Sürümler ve kaynak doğrulaması

Kurulu: Node **24.20.0**, Next.js **16.4.6**, React/React DOM **19.3.1**, TypeScript **6.0.3**, Tailwind **4.3.5**. Yeni runtime bağımlılığı kurulmadı; araçlar Node built-in modüllerini ve mevcut test araçlarını kullanır. Mevcut paket sürümleri `package.json`/lock'ta tam sabitlenmiştir. Node dosyaları yalnızca `24` yazar; kesin yama sabitlemesi yayın engeli olarak bırakılmıştır.

Payload **kurulu değildir**. npm yayımlama metadatasında güncel **3.94.1** ve Node `^22.23.5 || ^24.22.3 || >=26.13.1` gereksinimi tekrar görüldü. Node 24.20.0 bu şartı karşılamıyor. [Payload kurulum gereksinimleri](https://payloadcms.com/docs/getting-started/installation), [production/storage](https://payloadcms.com/docs/production/deployment), [migration](https://payloadcms.com/docs/database/migrations), [Next headers](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers), [self-hosting](https://nextjs.org/docs/app/guides/self-hosting), [PostgreSQL backup](https://www.postgresql.org/docs/current/backup-dump.html), [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html), [Dependabot](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference) ve [TRABİS](https://www.trabis.gov.tr/content/Acilis) kaynakları kontrol edildi. Next API'leri ayrıca kurulu paketin yerel resmî belgelerinden okundu.

## Çalıştırılan doğrulamalar

| İşlem                                    | Sonuç              | Kanıt/sınır                                                                                                                                  |
| ---------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm ci`                                 | Yapıldı, geçti     | Kilit dosyasıyla ayrı `.reports/repro-install` klasöründe; 373 paket kuruldu. Root'taki çalışan dev servisin node_modules'u silinmedi.       |
| `npm run check`                          | Yapıldı, geçti     | ESLint ve TypeScript; sıfır hata/uyarı.                                                                                                      |
| `npm run build`                          | Yapıldı, geçti     | Production build; sıfır hata/uyarı. SITE_URL doğru build değeriyle verildi.                                                                  |
| `npm run test:ops`                       | Yapıldı, geçti     | 5 test: URL/secret koruması, env önceliği, örnek işaretleri, güvenli smoke URL'si, redakte sır bulgusu.                                      |
| `npm run test:e2e`                       | Yapıldı, geçti     | Mevcut 10 Chromium testi; yeni çalıştırma mevcut yerel dev sunucusunda. Production sonucu olarak sunulmaz.                                   |
| Responsive/erişilebilirlik               | Yapıldı, geçti     | 320/390/768/1440 px, tek h1, bölümler, görsel yükleme, mobil menü, hedef, hesaplayıcı, SSS, süreç, yorum sürükleme, azaltılmış hareket, axe. |
| `npm audit`                              | Yapıldı, geçti     | Bilinen açık 0; high/critical 0.                                                                                                             |
| `npm run secrets:audit`                  | Yapıldı, bulgu yok | İmza kapsamındaki çalışma dosyalarında bulgu yok. Yerel commit sayısı 0 olduğu için Git geçmişi denetimi yapılmış sayılmaz.                  |
| Env negatif/pozitif denemesi             | Yapıldı, geçti     | SITE_URL yokken açık hata ve exit 1; doğru canonical değer verildiğinde exit 0.                                                              |
| `npm run launch:audit`                   | Yapıldı, kaldı     | 5 kontrol geçti, **34 engel**. Ortamında SITE_URL yoktu; diğer bulgular da yayını engeller.                                                  |
| `npm run smoke -- http://127.0.0.1:3000` | Yapıldı, kaldı     | 6 geçti, 13 kaldı, 3 yapılamadı. Ayrıntılar aşağıda.                                                                                         |
| Yeni production sunucusu                 | Yapılamadı         | Otomatik güvenlik denetimi başlatma komutunu reddetti; araç yalnızca `blocked by policy` gerekçesi verdi. Başlatma başka yoldan denenmedi.   |
| Staging/production smoke ve TLS          | Yapılamadı         | Seçilmiş sağlayıcı, staging adresi veya DNS kesimi yok. Canlı domaine istek yapılmadı.                                                       |
| DB migration/restore/rollback            | Yapılamadı         | Payload/DB/şema/yedek yok; Docker daemon'a erişilemedi, psql/pg_dump PATH'te yok.                                                            |
| Medya yedeği/retention job               | Yapılamadı         | Upload deposu ve cleanup:requests henüz yok; scheduler seçilmedi.                                                                            |
| Gerçek form/e-posta/PII scrub            | Yapılamadı         | Faz 4 uygulanmadı ve e-posta/izleme sağlayıcısı seçilmedi.                                                                                   |
| Yeni Lighthouse                          | Yapılamadı         | İstenen staging/production URL'si yok; yerel production başlangıcı reddedildi. Dev puanı production puanı gibi ölçülmedi.                    |
| Önceki Lighthouse                        | Tarihsel kanıt     | Faz 1 raporundaki yerel mobil 91 / erişilebilirlik 100 / best practices 100 / SEO 63 bu çalışmanın yeni ölçümü değildir.                     |
| Safari/iOS/Firefox/Edge/fiziksel cihaz   | Yapılamadı         | Bu çalışma Chromium dışı sürüm/cihaz doğrulaması yapmadı; OWNER ACTION smoke listesinde kalır.                                               |
| JSON-LD / iç sayfa Lighthouse            | Yapılamadı         | Blog/recipe/JSON-LD sayfaları bulunmuyor; uydurma içerikle başarı kanıtı üretilmedi.                                                         |

`npm ci` sırasında mevcut ESLint **9.39.5** için destek süresi uyarısı geldi. Check/build'de uyarı yoktur; kurulum uyarısı saklanmadı. Next ESLint peer/API uyumluluğu doğrulanıp ayrı güncelleme yapılması bakım işi olarak bekliyor. Açık bulunmaması bu kullanım ömrü uyarısını çözmez.

## Mevcut koda etkisi

Değişen uygulama ayarı yalnızca `next.config.ts` içindeki üç başlıktır: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`. Yerel dev yanıtlarında gerçekten görüldüler; staging/production'da doğrulanmış sayılmazlar. CSP yoktur; HSTS, canonical redirect ve Payload uyumluluğu karar/test bekler. Çalışır CSP varmış gibi raporlanmadı ve gevşek CSP istisnası eklenmedi.

`package.json` başlangıç/denetim komutları, `.env.example` açıklamaları, CI, Dependabot ve belgeler güncellendi. Ana sayfanın görsel bileşenleri, gerçek alıcılar, indexing, analytics ve form davranışı değiştirilmedi. Deploy workflow'u/hesap/satın alma/DNS işlemi yapılmadı; admin/health/scheduler için sahte stub eklenmedi.

## Teknik önkoşullar ve OWNER ACTION sırası

1. Node uyumluluğunu çözün ve doğrulanmış kesin yama sürümünü sabitleyin; Faz 2 CMS/admin/DB, Faz 3 içerik ve Faz 4 talep/consent akışlarını tamamlayın.
2. `ops/decisions.json` içindeki dokuz kararı verin: hosting, DB, storage, e-posta, analytics veya none, DNS, monitoring, bütçe, tarih. Hesap sahibi ve kurtarma kişisini belirleyin; sırları Git dışında tutun.
3. Onaylı unvan/biyografi, hizmet, paket, yorum, portre, telefon/e-posta/adres/saat, sosyal hesaplar ve hukuk metinlerini hazırlayın. Mevcut örneklerin hiçbiri gerçek içerik kabul edilmez.
4. Sağlayıcıların resmî özellik/fiyatlarıyla DNS, TLS, deploy, pool/storage, migration, yedek/PITR ve rollback adımlarını kesinleştirin. Sayısal DNS ve fiyat değerleri bilinmeden doldurulmadı.
5. Gerçek CMS audit'ini, şifreli dış yedeği ve temiz hedef restore provasını bağlayın. App silmeleri ile yedek/PITR saklama penceresini hukuk danışmanıyla inceleyin; 180/30 gün planı uygulanmış veya hukuken onaylanmış değildir.
6. Staging ve production doğrulamaları geçtikten sonra [yayın günü sırasını](launch-day-runbook.md) izleyin. İndeksleme ancak kullanıcı bu görevde **“indexlemeyi aç”** derse veya sahibi manuel yaparsa açılabilir; bu çalışma açmadı.

Takvim, ödeme, danışan paneli, bülten, çok dilli içerik, A/B ve içerik takvimi yalnızca yayın sonrası adaylardır.

## launch:audit engellerinin tam listesi

- [ ] **DECISION_HOSTING**: hosting: karar bekliyor
- [ ] **DECISION_DATABASE**: database: karar bekliyor
- [ ] **DECISION_STORAGE**: storage: karar bekliyor
- [ ] **DECISION_EMAIL**: email: karar bekliyor
- [ ] **DECISION_ANALYTICS**: analytics: karar bekliyor
- [ ] **DECISION_DNS**: dns: karar bekliyor
- [ ] **DECISION_MONITORING**: monitoring: karar bekliyor
- [ ] **DECISION_MONTHLYBUDGET**: monthlyBudget: karar bekliyor
- [ ] **DECISION_LAUNCHDATE**: launchDate: karar bekliyor
- [ ] **PAYLOAD_RUNTIME**: Planlanan Payload 3.94.1 için doğrulanmış Node 24 minimumu 24.22.3; kurulu runtime ayrıca yükseltilmeli.
- [ ] **PINNED_NODE**: Node yama sürümü iki dosyada kesin olarak sabitlenmeli; mevcut 24 ana sürümü tek başına yeterli değil.
- [ ] **PRODUCTION_ENV**: SITE_URL: production için zorunlu ve geçerli bir mutlak URL olmalı.
- [ ] **MOCK_FLAG_OFF**: Örnek içerik bayrağı kapatılmalı ve gerçek veri kaynağı bağlanmalı.
- [ ] **REAL_PORTRAIT**: İzinli gerçek portre dosyası gerekli.
- [ ] **CMS_INSTALLED**: Payload ve PostgreSQL adapteri kurulu ve doğrulanmış olmalı.
- [ ] **ROUTE\_/blog**: /blog: production route'u gerekli.
- [ ] **ROUTE\_/blog/[slug]**: /blog/[slug]: production route'u gerekli.
- [ ] **ROUTE\_/tarifler**: /tarifler: production route'u gerekli.
- [ ] **ROUTE\_/tarifler/[slug]**: /tarifler/[slug]: production route'u gerekli.
- [ ] **ROUTE\_/api/health**: /api/health: production route'u gerekli.
- [ ] **ROUTE\_/robots.txt**: /robots.txt: production route'u gerekli.
- [ ] **ROUTE\_/sitemap.xml**: /sitemap.xml: production route'u gerekli.
- [ ] **ROUTE\_/blog/rss.xml**: /blog/rss.xml: production route'u gerekli.
- [ ] **ADMIN_ROUTE**: Yönetici giriş route'u gerekli.
- [ ] **SAMPLE_RECORD**: Derlenmiş ana sayfada örnek içerik bulundu; eşleşen değerler yazdırılmadı.
- [ ] **SAMPLE_ACCOUNT**: Derlenmiş ana sayfada örnek içerik bulundu; eşleşen değerler yazdırılmadı.
- [ ] **SAMPLE_PHONE**: Derlenmiş ana sayfada örnek içerik bulundu; eşleşen değerler yazdırılmadı.
- [ ] **PENDING_APPROVAL**: Derlenmiş ana sayfada örnek içerik bulundu; eşleşen değerler yazdırılmadı.
- [ ] **SAMPLE_COPY**: Derlenmiş ana sayfada örnek içerik bulundu; eşleşen değerler yazdırılmadı.
- [ ] **PLACEHOLDER_PORTRAIT**: Derlenmiş ana sayfada örnek içerik bulundu; eşleşen değerler yazdırılmadı.
- [ ] **CMS_CONTENT_AUDIT**: Canlı kayıt denetleyicisi bağlı değil: Site Ayarları zorunlu alanları, örnek kayıtlar, yayın metadatası ve medya alt metinleri doğrulanamadı.
- [ ] **LEGAL_PAGES**: KVKK/gizlilik CMS kayıtları ve gerçek içerikleri doğrulanamadı.
- [ ] **BACKUP_RESTORE_PROVEN**: Şifreli yedek hedefi ve temiz DB'ye başarılı geri yükleme kanıtı bekleniyor.
- [ ] **STAGING_VERIFIED**: Sağlayıcı, staging adresi ve staging smoke/rollback sonuçları bekleniyor.

## Yerel smoke ayrıntıları

| Kontrol                       | Sonuç      | Açıklama                                                                                                                    |
| ----------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| HTTP_/                        | GEÇTİ      | /: HTTP 200                                                                                                                 |
| HTTP_/blog                    | KALDI      | /blog: HTTP 404                                                                                                             |
| HTTP_/tarifler                | KALDI      | /tarifler: HTTP 404                                                                                                         |
| HTTP_/admin                   | KALDI      | /admin: HTTP 404                                                                                                            |
| HTTP_/api/health              | KALDI      | /api/health: HTTP 404                                                                                                       |
| HTTP_/robots.txt              | KALDI      | /robots.txt: HTTP 404                                                                                                       |
| HTTP_/sitemap.xml             | KALDI      | /sitemap.xml: HTTP 404                                                                                                      |
| INDEXING_META                 | GEÇTİ      | Beklenen indeksleme modu: off.                                                                                              |
| ROBOTS_POLICY                 | KALDI      | robots.txt indeksleme ve /admin politikasına uymalı.                                                                        |
| SITEMAP_POLICY                | KALDI      | Sitemap yalnızca izinli yayın URL'lerini içermeli; indeksleme kapalıyken boş olmalı.                                        |
| ADMIN_NOINDEX                 | KALDI      | Admin giriş sayfası erişilebilir ve noindex olmalı.                                                                         |
| HEALTH                        | KALDI      | Uygulama + DB hazır olmalı; sağlık yanıtının içeriği yazdırılmadı.                                                          |
| HEADER_x-content-type-options | GEÇTİ      | x-content-type-options: beklenen başlık var.                                                                                |
| HEADER_referrer-policy        | GEÇTİ      | referrer-policy: beklenen başlık var.                                                                                       |
| HEADER_x-frame-options        | GEÇTİ      | x-frame-options: beklenen başlık var.                                                                                       |
| CSP                           | KALDI      | CSP politikası ve Payload uyumluluğu ayrıca doğrulanmalı.                                                                   |
| CANONICAL                     | KALDI      | Ana sayfa canonical adresi doğrulanmalı.                                                                                    |
| INTERNAL_ANCHORS              | GEÇTİ      | Sayfa içi eksik hedef: 0; taranan sayfa: 1.                                                                                 |
| SOCIAL_LINKS                  | KALDI      | Güvensiz/örnek sosyal bağlantı: 20. Haricî hesaplara istek yapılmadı; hesap sahipliği/erişilebilirlik doğrulanmış sayılmaz. |
| post                          | YAPILAMADI | Gerçek yayındaki örnek içerik yolu sağlanmadı.                                                                              |
| recipe                        | YAPILAMADI | Gerçek yayındaki örnek içerik yolu sağlanmadı.                                                                              |
| PRODUCTION_REDIRECTS          | YAPILAMADI | Yerel/staging testinde production alan adına istek yapılmadı; DNS kesimi sonrası ayrıca çalıştırılmalı.                     |
