# Doğrulama raporu

Tarih: 23 Kasım 2026. Yerel Windows, Node.js 24, Chromium ve production Next.js çıktısı kullanıldı. Public yayın yapılmadı.

## Sosyal medya tasarım revizyonu

İletişimde asimetrik sosyal panel, footer'da isimli bağlantılar, sol kenarda çerçeveli ikon şeridi ve yeni yuvarlak WhatsApp düğmesi uygulandı. Link getter/HTTPS filtresi ve örnek hesap durumu korundu. Yüzen düğme, iletişim/footer görünürken gizlenir; tooltip klavye odağı ve Escape ile çalışır. 320/390/768/1440 px sosyal panel ekran görüntüleri `test-results/socials-*.png` altındadır. Desktop hero/panel ve mobil görünüm ayrıca incelendi.

Docker geliştirme sunucusuna karşı **29/29 test** (önceki 24 + sosyal düzen/tooltip için 5) geçti. axe WCAG ve görünür etiket/erişilebilir ad eşleşmesi sıfır ihlal; lint/tip başarılı. Docker üretim imajı derlenip healthy duruma getirildi. Sonuçlar yerel Windows Chromium + Linux uygulama konteynerine aittir; gerçek sosyal hesaplar/telefonlar eklenmedi. Önceki Docker/GitHub ilk commit CI çalışması başarıyla tamamlandı; yeni revizyonun uzak workflow'u push sonrası ayrıca izlenmelidir.

## Docker çalışma ortamı doğrulaması

Üretim ve geliştirme imajları Windows host bağımlılıkları kopyalanmadan Linux'ta `npm ci` ile üretildi. Resmî Node digest'i ve `node --version` **v24.22.3** olarak doğrulandı. Dockerfile lint/check sıfır uyarı; iki Compose dosyası geçerli. Üretim konteyneri non-root uid 1000, read-only kök, yazılabilir cache volume ile healthy duruma geldi. HTTP smoke: ana sayfa, 16 JS/CSS/font varlığı, gerçek `next/image` optimizasyonu, güvenlik başlıkları ve 404 geçti. Yanlış SITE_URL ile entrypoint hata kodu 1 döndürdü.

Geliştirme konteynerinde `npm run check` ve beş operasyon testi geçti. Compose Watch ile geçici bir kaynak dosyasının oluşturulup konteynere aktarılması/silinmesi denendi; probe dosyası repoda tutulmadı. İlk Docker tarayıcı testi Next'in geliştirme origin engelini yakaladı; resmî yerel dokümana göre yalnız `127.0.0.1` allowlist'e eklendi. Docker CI bu akışı yeniden çalıştıracak; uzaktaki sonuç yerel başarıdan ayrı izlenmeli. Yerel servisler geliştirmede 3001, üretim önizlemesinde 3002 portuna bağlıdır (3000 host geliştirme sunucusu korunmuştur).

Origin düzeltmesinden sonra **24/24 Playwright testi Docker geliştirme sunucusunda geçti**. Üretim imajı yeniden derlenip healthy duruma getirildi; sayfa/varlık/görsel smoke kontrolü tekrar geçti. Kaynak sır taramasında bulgu yoktur. GitHub workflow'u push sonrasında ayrıca izlenmelidir; yerel başarı uzak job'ın tamamlandığı anlamına gelmez.

Kurulumda mevcut ESLint 9.39.5 için önceden bilinen destek süresi uyarısı görülür; lint/tip/build sonucu bu uyarıyı çözmüş sayılmaz. Yeni npm runtime bağımlılığı eklenmedi. Public domain/TLS, CMS/DB ve tam yayın hazırlığı ayrı bekleyen işlerdir. Ayrıntılar [Docker kılavuzunda](docker.md).

## Güncel vücut analizi teslimi

Eski enerji aracı değiştirildi. Güncel sonuçlar: `npm run check` ve `npm run build` sıfır hata/uyarı; Playwright **24/24**, operasyon **5/5**. Playwright mevcut `http://127.0.0.1:3000` geliştirme sunucusunda `TEST_BASE_URL` ile çalıştı; production tarayıcı testi veya yeni Lighthouse ölçümü yapıldığı iddia edilmez. Üretim statik `index.html` çıktısında `#analiz`, hero analiz bağlantısı ve eski hesaplayıcı çapasının varsayılan olarak bulunmadığı ayrıca kontrol edildi.

Yeni kapsam: bağımsız formül referansları, Türkçe ondalık, 18–80 sınırı, gebelik ve tutarsızlık guard'ları, ayar allowlist'i, boş/yanlış telefon, mesaj özel karakter/encoding/uzunluk sınırı, kapalı bölüm/link render'ı. 320/390/768/1440 px'de **form ve mesaj önizlemesi** yatay taşmıyor; klavye akışı ve axe kontrolü geçti. Hesap/önizleme/onay sırasında sıfır ağ isteği, storage/cookie yazımı ve site URL değişimi test edildi. Mesaj değişince onay kaldırılıyor; clipboard kullanılamadığında seçme/elle kopyalama alternatifi çalışıyor.

Formül kaynakları ve sınırlar [araç belgesinde](body-analysis.md). Gerçek alıcı olmadığından WhatsApp'a gerçek gönderim, fiziksel iOS/Android ve Safari testi yapılmadı. Bu sonucun önceki performans ölçümlerini güncellediği veya genel yayın NO-GO durumunu kaldırdığı düşünülmemeli.

## Önceki Faz 1 ölçümü — tarihsel kayıt

Aşağıdaki 10 test ve Lighthouse değerleri **eski hesaplayıcının bulunduğu önceki sürüme** aittir. Yeni aracın güncel performans ölçümü değildir.

## Kontroller

| Kontrol                            | Sonuç                                                                      |
| ---------------------------------- | -------------------------------------------------------------------------- |
| `npm run check`                    | ESLint ve TypeScript başarılı; sıfır hata/uyarı                            |
| `npm run build`                    | Statik ana sayfa, 404 ve site simgesi başarıyla üretildi; sıfır hata/uyarı |
| `npm run test:e2e`                 | 10 test; production sunucusuna karşı doğrulandı                            |
| axe WCAG A/AA                      | Test edilen sayfada ihlal yok                                              |
| Görünür etiket / erişilebilir isim | Ek axe kuralıyla kontrol edildi                                            |
| `npm audit`                        | Bilinen güvenlik açığı: 0                                                  |

## Tarayıcı kapsamı

- 320, 390, 768 ve 1440 px: yatay taşma, Türkçe HTML dili, tek h1, gerçek bölüm hedefleri, ana fotoğraf yükleme ve ekran görüntüleri.
- Mobil menüyü açma/Escape ile kapatma; hedef seçimi, seçili görsel ve mesaj, ilgili hizmet bağlantısı.
- Geçerli BKİ/enerji hesabı, eski sonucun girdi değişiminde temizlenmesi, geçersiz değer için Türkçe hata.
- SSS açılışı; örnek yorum önceki/sonraki geçişi, masaüstü sürükleme ve autoplay duraklatma düğmesi.
- Sürecin son adımına kaydırmada doğru adım/görsel vurgusu.
- Sosyal listelerin dört alanda aynı sırada gösterilmesi; HTTPS, dış sekme, rel ve erişilebilir isimler.
- Saf veri testinde HTTP/javascript, boş ve gizli sosyal kayıtların çıkarılması ve sıralamanın korunması.
- Azaltılmış hareket: giriş şeridi, marquee ve autoplay kapalı; hydration/console hatası yok.
- Hesaplama ve seçim sırasında POST isteği, localStorage kaydı veya cookie oluşmaması; örnek iletişimin gerçek alıcıya dönüşmemesi.

390 px'de döndürülmüş portre çerçevesinin 2 px taşması giderildi. Azaltılmış hareketin ilk sunucu/tarayıcı çiziminde farklı HTML üretmesi düzeltildi. Genel erişilebilirlik taramasına ek olarak görünür metnin erişilebilir ad içinde bulunması kontrol edildi.

## Mobil Lighthouse

Lighthouse 13.6.0, Chrome Headless Shell, varsayılan mobil ağ/CPU benzetimi ve `npm start` production çıktısı kullanıldı. Ölçüm sırasında diğer tarayıcı testleri çalıştırılmadı.

| Kategori/ölçüm         | Son ölçüm       |
| ---------------------- | --------------- |
| Performans             | 91 / 100        |
| Erişilebilirlik        | 100 / 100       |
| En iyi uygulamalar     | 100 / 100       |
| SEO                    | 63 / 100        |
| İlk içerik çizimi      | Yaklaşık 1,0 sn |
| En büyük içerik çizimi | Yaklaşık 3,4 sn |
| Toplam engelleme       | Yaklaşık 120 ms |
| Görsel kayma (CLS)     | 0               |

İlk mobil performans 86 idi. Fotoğraf kalitesi/öncelik ayarı ve fontların altı dosyadan üç yerel WOFF2 dosyasına düşürülmesi sonrasında 90+ hedefi karşılandı. Font aktarımı yaklaşık 204 KB'den 87 KB'ye indi. Türkçe karakterler dosya CMAP kayıtlarında doğrulandı.

SEO puanı, istenen `noindex, nofollow` önizleme politikası yüzünden düşüktür; puanı yükseltmek için indeksleme açılmadı. Raporlar Git dışındaki `.reports/` klasöründedir. Laboratuvar puanı gerçek alan adı, CDN ve fiziksel cihaz performansını garanti etmez; yayın ortamında yeniden ölçülmelidir.

## Sınırlar ve bilinçli tercihler

- Görsel yerleşim ekran görüntüleri incelendi; fiziksel iOS/Android cihaz, Firefox ve Safari ayrıca test edilmedi. Kesintisiz 60 fps için saha ölçümü yapılmadı.
- Unvan, biyografi, tüm hizmet/paket/yorum metinleri, iletişim ve sosyal kayıtlar örnektir. Portre yer tutucudur. Değiştirilecekler [yayın kontrol listesinde](launch-checklist.md).
- Telefon ve e-posta doğrulanana kadar CTA'lar iletişim bölümüne gider. `wa.me`, `tel:` ve `mailto:` üretimi onaylı veri için hazırdır; bu önizleme gerçek alıcı açmaz. Sosyal örnekler `example.invalid` üzerindedir.
- SSS'de layout/height animasyonu yerine native açılış ve clip/opacity geçişi kullanılır. Hedef kartından hizmete kaydırma açık bir bağlantıyla yapılır. Marquee hover'da durur.
- Gerçek portre dosyası production'da yeni derlemeyle algılanır.
- Admin, CMS, DB, API route'u, form kaydı, kesin randevu ve ödeme bu fazda yoktur. “Phase 2” talebi beklenir.

Görsel ve font kaynakları: [kaynak envanteri](image-credits.md). Uygulama ve veri sınırları: [mimari](architecture.md).
