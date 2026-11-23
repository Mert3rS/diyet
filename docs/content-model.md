# İçerik modeli

Çalışan Payload şeması `src/cms/globals/`, üretilen tipler `src/payload-types.ts`, ilk migration `src/migrations/` altındadır.

| Kaynak                 | Alanlar                                                                                            | Erişim                                           |
| ---------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Site ayarları          | Marka, iletişim, WhatsApp/Instagram, beş fotoğraf alanı, menü                                      | Herkese okuma, yönetici yazma                    |
| Ana sayfa              | Bölüm metinleri, biyografi, hizmetler, süreç, hedefler, paketler, yorumlar, blog önizlemeleri, SSS | Herkese okuma, yönetici yazma                    |
| Vücut analizi ayarları | Görünürlük, metinler, hizmetler, alan anahtarları, mesaj şablonu, özel numara                      | Herkese okuma, yönetici yazma                    |
| Görseller              | Dosya, zorunlu alt metin, dosya ölçüleri                                                           | Herkese okuma, yönetici yükleme/değiştirme/silme |
| Yöneticiler            | E-posta, parola hash'i, isim, admin rolü                                                           | Yalnız yönetici                                  |

`initialized` bootstrap durumudur ve panelden değiştirilemez. Örnek içerik işaretleri ana sayfa, iletişim ve Instagram için ayrı yönetilir. Telefon ve Instagram hesabı doğrulanmadan gerçek bağlantı olarak kullanılmamalıdır. Sayfadaki isim Site ayarları kaydından alınır.

Metinler düz metindir; HTML ve uzunluk ihlalleri reddedilir. Mesaj şablonu izinli token'ları ve güvenli metin kurallarını uygular. Instagram yalnız HTTPS instagram.com/www.instagram.com kabul eder; örnek modda ayrılmış example.invalid adresi kullanılabilir. Menü yalnız mevcut bölüm anchor'larını seçebilir.

Liste satırları sıralanabilir. Hedeflerde hizmet anahtarı ilgili hizmete, görsel seçimleri Site ayarlarındaki fotoğraflara bağlanır. Paket kapsamları metin satırlarıdır. Blog kayıtları bugün yalnız ana sayfa kartlarıdır; ayrıntı yazısı/SEO koleksiyonu değildir. Randevu/consent ve hukuk metni kayıt modelleri henüz eklenmedi.
