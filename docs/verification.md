# Doğrulama raporu

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
