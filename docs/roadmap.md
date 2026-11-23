# Güncel yol haritası

Bu plan son istekteki Faz 1/Faz 2 ayrımını kullanır. Önceki altyapı adımları Faz 1 kapsamına alınmıştır.

## Faz 1 — Örnek içerikli tek sayfa

- [x] A: Tasarım değişkenleri, Fraunces/Geist, header/footer, ortak görsel ve sosyal altyapı, hero.
- [x] A sonunda `npm run check`.
- [x] B: Altı hizmet, marquee, hakkımda, portre alanı, dört aşamalı yapışkan süreç ve paketler.
- [x] C: Hedef seçimi ve mesaj taslağı, dört örnek yorum, üç blog kartı, yedi SSS, iletişim ve mobil CTA.
- [x] Ek araç: eski BKİ/enerji hesabı yerine yerel Vücut analizi, Deurenberg/Navy tahmini aralıkları, koruyucu sınırlar, düzenlenen/onaylı WhatsApp mesajı; production varsayılan kapalı.
- [x] Tek `getSocialLinks()` kaynağı, on SVG platform simgesi ve dört sosyal yerleşim.
- [x] Merkezi örnek kayıtlar ve tek `USE_MOCK_CONTENT` bayrağı.
- [x] Dört lisanslı yerel fotoğraf ve kaynak envanteri.
- [x] Azaltılmış hareket, mobil parallax kapatma, dinamik Lenis/hesaplayıcı yükleme.
- [x] 320/390/768/1440 px tarayıcı kontrolleri, etkileşim ve axe testleri.
- [x] README, mimari, tasarım, görsel kaynakları ve yayın kontrol listesi.

Son kontrol çıktıları ve performans ölçümü [doğrulama raporunda](verification.md) kaydedilir. Faz 1 public yayın veya gerçek hizmet açılışı değildir.

## Docker ve GitHub çalışma ortamı

- [x] Node 24.22.3 resmî Linux imajını digest ile sabitle; Node dosyalarını/engines'ı eşleştir.
- [x] Çok aşamalı standalone üretim Dockerfile'ı, ayrı geliştirme Compose Watch yapısı ve build context/Git ignore kuralları.
- [x] Non-root/read-only üretim konteyneri, gerçek görsel optimizasyonu ve başlangıç env koruması.
- [x] GitHub CI'a Docker build/run/smoke ve Docker dev üzerinde Playwright adımları; Docker Dependabot tanımı.
- [ ] Gerçek sunucu sağlayıcısı, reverse proxy/TLS, registry/release/deploy ve domain yönlendirmesi.

## Faz 2 — CMS ve PostgreSQL entegrasyonu bekliyor

- [ ] Resmî kaynaklardan Payload / Next.js 16 / React 19 ve PostgreSQL adapter uyumluluğunu doğrula; uyumsuzsa dur ve uyumlu seçeneği sun.
- [ ] Mevcut uygulamada Türkçe `/admin`; e-posta/parola ile yönetici oturumu, public kayıt kapalı.
- [ ] “Site Ayarları” global'i: sıralanabilir platform, kullanıcı adı/URL, görünürlük, etiket ve iletişim alanları.
- [ ] “Vücut Analizi Ayarları” Global'i; hazır getter/tip/allowlist'i CMS'ye bağla, admin yetkileri, Türkçe alanlar, örnek önizleme, sıfırlama, DB hata politikası ve revalidation testlerini uygula. Bu araç isteğinde Payload kurulmadı.
- [ ] Sunucuda platform alan adı/protokol/telefon doğrulaması; yazma erişimi yalnızca yetkili yönetici.
- [ ] `getSocialLinks()` kaynağını CMS ile değiştir; production'da hata/boş DB için boş liste.
- [ ] Kaydetme sonrası revalidation, Türkçe açıklamalar ve geri bildirim.
- [ ] Güvenli ilk yönetici kurulumu, oturum politikası, giriş sınırlama, migration/yedekleme ve e-posta sıfırlama kararları.
- [ ] Yetkisiz yazma, geçersiz URL, gizlilik ve sıralama testleri; yerel PostgreSQL ile doğrulama.

Bu liste onay bekleyen kapsamdır; hiçbir Faz 2 servisi veya yönetim paneli kurulmadı.

## Faz 3 ve Faz 4 — Uygulanmadı

Faz 3 blog/tarif/medya/CMS Pages/SEO, Faz 4 randevu talepleri/e-posta/consent gerektirir. Docker Node minimum sürüm engelini çözdü; CMS/PostgreSQL entegrasyonu yapılmadı. Bu fazlar tamamlanmış kabul edilmez.

## Faz 5 — Sağlayıcı bağımsız hazırlık; tamamlanmadı

- [x] Env envanteri ve production başlangıç kontrolü.
- [x] Örnek/eksik altyapı bulgularını raporlayan yayın audit'i ve salt okunur smoke aracı.
- [x] Sınırlı sır imza taraması, operasyon testleri, CI ve Dependabot dosyaları.
- [x] DNS, backup/restore, işletim, yayın günü, hesap/maliyet ve teknik gizlilik kılavuzları.
- [ ] Node/Payload uyumluluğu, Faz 2–4 ve gerçek CMS içerik denetleyicisi.
- [ ] Sağlayıcı, DB/storage/e-posta/analytics/DNS/monitoring, bütçe ve tarih kararları.
- [ ] Staging/deploy/DB migration/şifreli backup/restore ve rollback provası.
- [ ] Sağlık ucu, CSP/TLS/redirect, gerçek form/e-posta, PII scrub ve staging/production smoke.
- [ ] Gerçek içerikle audit geçişi, cihaz/Lighthouse/yapılandırılmış veri kontrolü ve açık yayın kararı.

Phase 5 done olarak işaretlenmedi; yayın NO-GO. Sonraki adaylar: takvimli randevu, online ödeme, danışan paneli, bülten, çok dilli içerik, A/B ve içerik takvimi; hiçbiri eklenmedi.

Gerçek unvan/biyografi, hizmetler, fotoğraf, telefon/e-posta/adres/saat, yorumlar, sosyal hesaplar, hukuk metinleri ve hosting tamamlanmalıdır. Ayrıntılı [yayın kontrol listesi](launch-checklist.md) esastır. `gunayturan.com.tr` DNS ve deployment işlemi bu fazda yapılmaz.
