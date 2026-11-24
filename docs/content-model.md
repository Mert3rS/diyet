# İçerik modeli

Yeni tasarımın ana kaynağı Payload **sports-homepage** Global'idir. Site ayarları ve medya mevcut kaynaklardan gelir. Eski homepage verileri ayrı tutulur.

| Kaynak                       | Alanlar                                                                                                                                                                | Erişim                                           |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Ana sayfa · Spor ve beslenme | Hero ve slaytlar; bölüm metinleri; hizmet/kapsam; hedef kitle; sistem; etkinlik; tarif; sosyal kart; medya önizlemesi; yorum; SSS; pano; branşlar ve bölüm görünürlüğü | Herkese okuma, yalnız yönetici yazma             |
| Site ayarları                | Marka, tanım ve unvan onay notları, iletişim, WhatsApp/Instagram, paylaşılan görseller, menü, footer ve isteğe bağlı HTTPS randevu bağlantısı                          | Herkese okuma, yönetici yazma                    |
| Eski ana sayfa · Arşiv       | Önceki tasarımın metinleri, listeleri ve paketleri                                                                                                                     | Kayıtlar korunur; yeni sitede kullanılmaz        |
| Vücut analizi ayarları       | Önceki araç için korunan ayarlar                                                                                                                                       | Herkese okuma, yönetici yazma                    |
| Görseller                    | Dosya, Türkçe alt metin, ölçüler                                                                                                                                       | Herkese okuma, yönetici yükleme/değiştirme/silme |
| Yöneticiler                  | E-posta, parola hash'i, isim ve rol                                                                                                                                    | Yalnız yönetici                                  |

Şema `src/cms/globals/sports-homepage.ts`, tipler `src/payload-types.ts`, başlangıç içeriği `src/content/sports-defaults.ts` içindedir. Varsayılanlar yalnız initialized:false kayda yazılır. Örnek metinleri değiştirmek için kaynak seed dosyasını değiştirmek mevcut CMS kaydını güncellemez; panel kullanılmalıdır.

`src/content/sports-home.ts` yalnız bilinen alanları ve aynı-origin medya URL/alt metnini aktarır. Kartlar visible:false olduğunda render listesinden çıkarılır; veritabanından silinmez. Bölümler ayrı anahtarlarla gizlenir. Liste sırası CMS sırasıdır. Tarif kategorileri Ana yemek, Tatlı ve Tuzlu'dur; video/podcast/blog kartları önizleme durumundadır.

Örnek içerik durumu paneldeki isMock alanlarıyla yönetilir. Kodda ayrı USE_MOCK_CONTENT geçişi yoktur. İletişim ve Instagram örnek işaretleri ayrı kalır. Gerçek iletişim doğrulanmadan dış alıcıya yönlendirme yapılmaz.

Özel slayt/tarif/sosyal fotoğrafı, paylaşılan site fotoğrafından önce gelir. Bunlar media upload ilişkileridir; düz dış görsel URL'si kabul edilmez. Portrait alanı site ayarlarındadır.

Sürümlü migration `20261124_083825_sports_homepage` 16 yeni tablo ve ek marka/menü alanları oluşturur. UP bölümünde eski tablo/sütun silme yoktur. Yeni tabloların tümünde RLS açıktır ve ilişki indeksleri vardır. Payload veritabanına mevcut sahibiyle bağlanır; HTTP yazma yetkisini yönetici erişim kuralları uygular. Otomatik şema push kapalıdır.
