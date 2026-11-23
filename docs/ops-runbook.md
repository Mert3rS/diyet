# İşletim ve acil durum kılavuzu

**Gerçek sunucu yayını henüz doğrulanmadı.** Yerelde site, `/admin`, görsel düzenleyici ve DB'yi denetleyen `/api/health` çalışır. Ücretsiz ilk yayın için Render + Supabase yapılandırması hazırdır; hesap/proje bağlantısı ve gerçek deploy sonucu beklenir. [Yayın kılavuzu](render-supabase.md). E-posta, izleme, blog/tarif ayrıntıları ve randevu kayıt sistemi henüz tamamlanmadı.

Yerel çalışma Docker Compose ile, ücretsiz ilk uzak yayın Render Node servisi ve Supabase ile yapılır. Konteyner durumu için `docker compose ps`, log için `docker compose logs --follow web`, güncelleme için `docker compose up --build --detach --wait` kullanılır. Geliştirme projesinde `-f compose.dev.yaml` eklenir. Healthcheck gerçek DB erişimini denetler. Ayrıntılar [Docker kılavuzunda](docker.md). Uzak ortamda servis durumunu ve loglarını Render panelinden izleyin.

## Bir sayfalık acil durum

1. Canlı site ileride açıldıktan sonra erişim sorunu görülürse önce hosting durum panelini ve erişim uyarısını kontrol edin. Şimdilik panel adresi ve sorumlu kişi **karar bekliyor**.
2. Teknik sorumluya yalnızca olay zamanı, hata kodu, etkilenen genel sayfa ve release ID'sini iletin. Danışan adı/telefonu/form ekran görüntüsü göndermeyin.
3. `npm run smoke -- <staging-veya-production-kök-adresi>` çalıştırın. `.reports/smoke.json` dosyasını paylaşmadan önce inceleyin. Araç form göndermez; API'lerde yalnızca `/api/health` kontrol eder.
4. Son yayın sonrası bozulduysa önceki release'i geri getirme planını uygulayın. Git geçmişi vardır; henüz başarılı uzak deploy kaydı bulunmadığından çalışan bir uzak rollback noktası olduğu varsayılmaz.
5. DB veya medya sorunuysa yeni yazmaları durdurma prosedürünü teknik sorumlu yürütmeli. Production DB'yi silmeyin; eski yedeği üzerine geri yüklemeyin. Ayrı temiz hedefte restore ve veri uzlaştırma gerekir.
6. Sır sızıntısında sağlayıcıdaki sırrı iptal edin/döndürün, erişimleri gözden geçirin. Değeri destek mesajına veya loga yapıştırmayın.
7. KVKK/veri olayı şüphesini site sahibine ve belirleyeceği hukuk danışmanına bildirin. Bu kılavuz bildirim süresi veya hukuki uyum kararı vermez.

## Hesaplar ve erişim

1. Hesapların envanteri [costs-and-accounts.md](costs-and-accounts.md), seçim kaydı `ops/decisions.json` dosyasındadır.
2. **OWNER ACTION:** Site sahibi, teknik destek rolü ve yedek kurtarma kişisini belirleyin. Gerçek ad/e-posta/telefon bilgilerini Git yerine güvenli hesap envanterinde tutun.
3. **OWNER ACTION:** Seçilen sağlayıcının paneli, destek adresi ve kurtarma prosedürünü parola kasasına kaydedin. Paylaşılan yönetici parolası yerine ayrı roller kullanın.
4. Payload kurulmadığından ilk admin oluşturma ve güvenli parola sıfırlama prosedürü henüz uygulanmadı. Public sign-up açmayın; bootstrap, yetkisiz kullanıcı oluşturma ve login rate limit kontrolleri Faz 2 testleriyle kanıtlanmalı. Payload 2FA desteği bu çalışmada doğrulanmış/kurulmuş değildir.

## Log, izleme ve uyarılar

Mevcut Node çıktısı yerel terminaldedir. Hosting panelindeki log konumu ve log saklama süresi sağlayıcı seçimi bekler. Yeni operasyon araçları sır veya form içeriğini yazdırmaz; hata raporlarına yalnızca kontrol kodu ve durum koyar. Henüz production formu olmadığı için runtime kişisel veri scrubbing'i denenmiş değildir.

**OWNER ACTION:** İzleme aracında ana sayfa, admin giriş sayfası ve sadece sağlık kontrolü için DB readiness ucu tanımlanmalı. Health yanıtı yalnızca genel `ok/not_ready` durumunu vermeli; URI, kullanıcı, sürüm, tablo veya hata yığını içermemeli. Health route'u bu depoda henüz yoktur; örnek başarılı yanıt eklenip DB kontrolü varmış gibi gösterilmedi.

Uyarı alıcısı site sahibi + belirleyeceği teknik sorumlu olacaktır; adresler ve eşikler **karar bekliyor**. Önerilen olaylar: üst üste erişim hataları, DB readiness hatası, yedek job başarısızlığı, depolama kapasitesi, sertifika süresi ve bildirimin gönderilememesi. Sıklık, sessiz saatler ve escalation seçilen araç üzerinde sahibiyle netleştirilmeli; otomatik uyarı kurulmadı.

Hata izleme aracı bağlanmadan env bayrağı/SDK adı uydurulmadı. Seçilince request body, query, cookie, authorization, ad/telefon/e-posta ve form alanlarını event oluşmadan önce silen allowlist yaklaşımı kullanılmalı. Uydurma verili test hatasıyla dışarı giden payload incelenmeden etkinleştirilmemeli. CSP istisnaları sağlayıcı domain'leri doğrulanınca eklenmeli; analitik/indexleme açılmadı.

## Bildirim e-postası başarısızsa

Randevu kaydı ve adapter henüz bulunmuyor. Faz 4'te kayıt, e-posta sonucundan bağımsız saklanmalı; yönetici `emailStatus` üzerinden başarısız bildirimi görmeli. Kurulduktan sonra alıcı ayarı, provider durum paneli, gönderici doğrulaması ve hata kodu incelenmeli; kişisel alanlar konu satırına/loga taşınmamalı. Yapılandırılmamış sağlayıcıyı başarılı teslim gibi göstermeyin.

## Yedek ve geri dönüş

1. [Yedek/restore kılavuzunu](backup-restore-runbook.md) izleyin. Önce temiz staging hedefinde prova yapın.
2. Deploy öncesinde commit/release ID, migration listesi, yedek zamanı/checksum ve medya sürümünü güvenli operasyon kaydına alın.
3. Sağlayıcı kararı sonrası gerçek rollback komutlarını, yetkili kişiyi ve ölçülmüş süreyi ekleyin. DB migration uygulanmışsa otomatik rollback'e güvenmeyin.
4. [Ortam kılavuzundaki](env-reference.md) sır döndürme sırasını staging'de doğrulayın; eski anahtarı/kurtarma erişimini doğrulamadan yok etmeyin.

## CI ve güncelleme

GitHub Actions tanımı `npm ci`, `check`, operasyon testleri, sır imza taraması ve `build` içerir. Bu dosyalar henüz GitHub'da çalışmış sayılmaz; push sonrası sonucu inceleyin. Deploy workflow'u sağlayıcı seçilmediği için eklenmedi. Dependabot haftalık npm ve Actions güncellemesi önermek üzere dosya olarak hazırdır; hesapta çalışması commit/push gerektirir.

Güncellemede resmî release/compatibility belgelerini okuyun, tam sürümleri pinleyin, `npm ci`, audit, check/build/test ve staging prova yapın. Major yükseltmeleri veya Payload paketleri arasındaki sürüm farklarını otomatik birleştirmeyin. `npm audit fix --force` ile körlemesine güncelleme yapmayın. ESLint 9 için kurulumda gelen kullanım ömrü uyarısı ayrıca takip edilmeli; sıfır audit bulgusu bakım uyarısını ortadan kaldırmaz.
