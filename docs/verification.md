# Yeni tasarım ve admin revizyonu — doğrulama

24 Kasım 2026. Yerel geliştirme ortamında uygulandı. Canlı yayın yapılmadı.

## Son kabul sonucu

- Yeni admin ve ana sayfa için **20 Playwright testi geçti**: 7 admin/CMS akışı ve 13 ön yüz kabul testi. Son birleşik koşu 1,6 dakika sürdü.
- Sabit Node 24.22.3 Docker ortamında npm run check başarılı: ESLint sıfır hata/uyarı, Next typegen ve TypeScript geçti.
- npm run build, `docker build --target builder --tag diyet-admin:verified .` içinde başarılı. Yeni uygulama paketi kurulmadı.
- Site 320, 390, 768 ve 1440 px; panel 390 ve 1440 px genişlikte kontrol edildi. Yatay taşma ve WCAG A/AA taramalarında ihlal yok. Site kontrolleri WCAG 2.1 A/AA kurallarını da kapsar.
- Native panel formundan kaydedilen h1, halka açık sayfaya yansıdı.
- Slayt, pano, hedef kitle başlığı, biyografi, hizmet kapsamı, sistem adımı, etkinlik, tarif sırası/kategorisi/görseli, sosyal kart, medya başlığı, yorum, SSS ve iletişim başlığı CMS kaydından doğrulandı.
- Kart gizleme ve bölüm/pano kapatma test edildi; kayıtlar korunurken görünümden kaldırıldı.
- Görsel editörde slayt seçimi, taslak değişikliği, geri alma, fotoğraf yükleme, mobil/masaüstü önizleme ve Kaydet sonrası yayın test edildi.
- Gizli ilk slayttan sonraki kayıt doğru seçilip düzenlendi. Başka sekmede güncellenen belge, görsel editörün kaydetme öncesi kontrolünü tetikledi ve taslak diğer içeriği ezmedi.
- Anonim yazma, HTML metni, yinelenen hizmet kimliği ve tüm slaytları kapatma reddedildi. Admin girişi ve mevcut erişim kuralları korunur.
- Ana sayfa testleri tek h1, zoom, klavye, swipe, otomatik slayt duraklatma/durdurma, reduced-motion, tarif filtresi, mobil menü ve üçüncü taraf script/iframe olmamasını doğrular. noindex korunur.

## Veri geçişi ve kalıcılık

Önce PostgreSQL custom dump ve medya tar yedeği Git dışındaki `.reports/diyet-before-sports-admin.dump` ve `.reports/diyet-before-sports-admin-media.tar` dosyalarına alındı. Binary dosyalar PowerShell metin yönlendirmesiyle yazılmadı; konteyner içinde oluşturulup kopyalandı.

`20261124_083825_sports_homepage` migration'ının UP bölümü incelendi: eski tablo veya sütun silme yok. 16 yeni tablo, ek marka alanları ve ek menü değerleri oluşturuldu. Tüm yeni tablolarda RLS açık; eksik foreign key indeksi sorgusu sıfır satır verdi. Yönetici sayısı 1, eski homepage kayıt sayısı 1 olarak korundu.

Bir test metni ve yüklenen test fotoğrafı kaydedildi. Geliştirme web/tooling imajları güncel kaynaklardan yeniden oluşturuldu; cms-init migration ve idempotent seed tekrar çalıştı. Sonrasında test metni, medya kaydı/dosyası ve yönetici girişi korunmuştu. Test içeriği eski haline getirildi ve yalnız teste ait fotoğraf silindi. Kalıcılık sonucu `.reports/sports-persistence-result.json` dosyasındadır. Bu kontrol ayrı bir boş hedefe tam yedek restore provası değildir.

## Kullanım ve kapsam

Yeni form `/admin/globals/sports-homepage`, görsel editör `/admin/visual-editor`, ortak ayarlar `/admin/globals/site-settings` adresindedir. [Türkçe kullanım kılavuzu](admin-guide-tr.md).

Yeni ana sayfa CMS kaynağını kullanır; eski homepage kayıtları Arşiv altında tutulur. `USE_MOCK_CONTENT` kod anahtarı kaldırılmıştır; örnek durumları paneldedir. Eski tasarımın tüm testlerinin geçtiği iddia edilmez. Mevcut analiz altyapısı korunur; yeni tasarıma analiz bölümü eklenmedi.

Görsel editörün updatedAt kontrolü, iki Global arasında atomik sunucu transaction'ı değildir. Metin/görsel taslağı yalnız tarayıcıda tutulur; native panel formunun Kaydet işlemi doğrudan yayınlar. Görünürlük anahtarları özel belge erişim kontrolü değildir.

Yeni içerikler gerçek portre/iletişim ve onaylı metinlerle değiştirilmelidir. Randevu kaydı, ödeme, çalışan iletişim formu ve ayrıntı sayfaları bu revizyonun kapsamında değildir. Kaynak sürümler, görseller ve önceki Lighthouse ölçümü tasarım belgelerinde kayıtlıdır.

## Önceki statik tasarım ölçümü

Admin bağlanmadan önceki yerel standalone sürümde Lighthouse 13.6.0 mobil sonucu: performans 85, erişilebilirlik 100, en iyi uygulamalar 100, SEO 63; FCP 1,1 sn, LCP 3,2 sn, TBT 340 ms, CLS 0. Bu önceki koşuda 90+ performans hedefi karşılanmamıştı. Admin revizyonu için yeni Lighthouse sayısı üretilmedi; eski sonuç güncel CMS sürümünün ölçümü olarak sunulmaz. SEO puanı noindex nedeniyle düşüktür.

---

# Doğrulama raporu

## Render ve Supabase yayın hazırlığı — 23 Kasım 2026

Render Blueprint resmi JSON şemasına göre doğrulandı. S3 depolama ve tablo RLS migration'ları yerel verileri koruyarak uygulandı; ortam doğrulama testleri 6/6 geçti. Güncel uygulamada 38 Playwright testi geçti. Ayrıca 512 MB bellek sınırındaki üretim konteynerinde S3 uyumlu test deposuyla 6 admin/görsel düzenleyici testi geçti. Yüklenen görselin uygulama yeniden başlatıldıktan sonra aynı içerikle indirildiği doğrulandı. PostgreSQL'de salt SELECT izni verilen geçici bir anonim rol, RLS korumalı `users` ve `homepage` tablolarında sıfır satır gördü; rolü oluşturan işlem geri alındı.

S3 testi yerel S3 uyumlu test servisiyle yapıldı; gerçek Supabase projesine bağlantı ve Render'da gerçek deploy, hesap erişimi bekliyor. Bu kontroller uzakta çalışan bir site olduğu anlamına gelmez. [Ücretsiz yayın kılavuzu](render-supabase.md).

## Önceki yerel kurulum

23 Kasım 2026, Windows ve Docker Desktop Linux motoru. Canlı alan adına yayın yapılmadı.

| Kontrol                                     | Sonuç                                                                                                                                |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| ESLint sıfır uyarı eşiği ve Next/TypeScript | Docker Node 24.22.3 ile geçti                                                                                                        |
| Üretim build                                | DB/sır olmadan standalone derlendi                                                                                                   |
| Geliştirme/üretim Compose                   | DB + init + web sağlıklı                                                                                                             |
| Playwright                                  | 31 test geçti; 320/390/768/1440 px, klavye, azaltılmış hareket, axe, analiz ve CMS                                                   |
| Panel                                       | Türkçe giriş, dashboard ve ana sayfa editörü geliştirme/üretimde açıldı; üretim tarayıcı hatası 0                                    |
| İçerik kaydetme                             | Panelde değişen hero başlığı halka açık sayfada görüldü; geri alındı                                                                 |
| Medya                                       | Yönetici yükleme, CMS fotoğraf seçimi, halka açık okuma ve Next optimizasyonu geçti; test kaydı temizlendi                           |
| Yetkiler                                    | Anonim users/liste/yazma/ilk-kayıt 403; son yönetici silme 400                                                                       |
| Alan doğrulama                              | HTML başlık ve harici Instagram domain'i 400                                                                                         |
| Sosyal görünürlük                           | Panelden iki hesabı gizleyince küçük/footer/kart/sabit çift düğme kayboldu; geri alındı                                              |
| Kalıcılık                                   | Geçici içerik ve görsel kaydedildi, DB/web yeniden başlatıldı, aynı içerik/medya ve admin oturumu korundu; test verileri geri alındı |
| Üretim HTTP                                 | Health/DB, admin giriş ekranı, yetki, 12 statik dosya, optimize görsel, güvenlik başlıkları, 404 ve analiz kapalı durumu geçti       |
| Operasyon birim testleri                    | 5 geçti                                                                                                                              |
| Bağımlılık denetimi                         | Lock çözümlemesinde npm audit 0 güvenlik bulgusu; dompurify ve esbuild transitive düzeltmeleri dahil                                 |

Masaüstü çift düğme ve üretim paneli `.reports/` ekran görüntüleriyle incelendi. Sosyal responsive ekran görüntüleri `test-results/socials-*.png` altındadır. Bu klasörler ve yönetici giriş bilgileri Git'e eklenmez.

Aynı iki CMS testi üretim runner'ında da geçti: kaydetme, yetki, görsel yükleme/optimizasyon, sosyal görünürlük ve mesaj önizleme/sıfırlama. Her iki portun halka açık HTML'inde yönetici e-postası, ilk şifre ve ortam sırları için eşleşme bulunmadı. Git aday dosyalarında da bu özel değerler bulunmadı.

Docker volume kalıcılığı dış yedek/restore testi değildir. Gerçek mesaj gönderilmedi, e-posta servisi yapılandırılmadı. Sunucu/DNS/TLS, gerçek içerik, hukuk ve randevu akışı yayın için hâlâ eksiktir. CI'nin yerel kontrolle aynı sonucu vermesi push sonrasında ayrıca doğrulanır.

Kurulum mevcut ESLint 9 ve bazı transitive paketler için destek/deprecation uyarıları verebilir; check/build başarısı bunların giderildiği anlamına gelmez. [Yayın durumu](launch-readiness.md), [Docker](docker.md), [admin kullanımı](admin-guide-tr.md).
