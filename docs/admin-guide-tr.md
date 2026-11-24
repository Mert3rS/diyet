# Türkçe yönetim kılavuzu — yeni tasarım

Panel: **http://localhost:3001/admin**. Yönetici hesabınız ve parolanız korunmuştur. İlk kurulum bilgileri Git dışındaki `.reports/admin-credentials.txt` dosyasındadır.

## Yeni ana sayfanın içerik formu

Yönetim merkezindeki **Yeni ana sayfa** kartını veya sol menüdeki **Ana sayfa · Spor ve beslenme** bağlantısını açın. Doğrudan adres: `/admin/globals/sports-homepage`.

| Sekme                       | Yönetilen alanlar                                                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Açılış ve slider            | Ana başlık, düğmeler, alt not, görsel açıklaması, otomatik geçiş; slayt metinleri, sırası, görünürlüğü, hizmet eşleşmesi ve özel görseller |
| Bölüm metinleri             | Tüm bölüm başlıkları ve açıklamaları; biyografi, yaklaşım, mesleki bilgi notu; sistem ve yorum bölümü metinleri                            |
| Hizmetler ve hedef kitleler | Hizmet adları, açıklamalar, simgeler, kapsam maddeleri ve ilk görüşme notları; hedef kitle kartları ve mesajları; sistem adımları          |
| Etkinlikler ve tarifler     | Etkinlik türü, tarih metni ve başlığı; tarif başlıkları, açıklamaları, kategorileri, hazırlık süreleri ve görselleri                       |
| Sosyal, medya ve yorumlar   | Sosyal paylaşım kartları, video/podcast/blog önizlemeleri, baş harfli yorumlar ve SSS                                                      |
| Pano ve görünürlük          | Örnek performans panosu metinleri, gösterge etiketleri, zaman çizelgesi, kısa notlar, spor branşları ve bölüm görünürlüğü                  |

Kart satırlarını açıp düzenleyebilir, ekleyebilir, kaldırabilir ve sürükleyerek sıralayabilirsiniz. **Sitede göster** işareti bir kartı silmeden gizler. **Bölüm görünürlüğü** bir bölümün tamamını kapatır. Gizlenen kayıtlar panelde korunur; bu seçenek gizli belge/draft erişim kontrolü değildir.

Slaytlarda en az bir görünür kayıt olmalıdır. Hizmet kimlikleri benzersiz olmalıdır. Bir hizmet kimliğini değiştirirseniz ilgili slayt ve hedef kitle kartlarındaki hizmet kimliğini de güncelleyin. Metinlerde HTML kullanılmaz; alan uzunluğu ve seçim değerleri sunucuda doğrulanır.

**Kaydet** sonrasında yeni bir site sekmesi açın veya sayfayı yenileyin. Değişiklikler mevcut veritabanına kaydedilir ve yeni istekte görünür; yeniden build gerekmez. Panel formunda kaydetmek doğrudan yayınlar. Kaydedilmemiş form değişiklikleri ziyaretçiye gösterilmez.

Örnek içerik işaretlerini yalnız doğrulanmış içeriklerle değiştirin. Pano bir illüstrasyondur; gerçek ölçüm olmadığına ilişkin notu koruyun. Video, tarif, blog ve etkinlik kartları bu aşamada ayrıntı sayfası veya oynatıcı oluşturmaz; Yakında durumundadır.

## Görsel düzenleyici

Yönetim merkezindeki **Ana sayfayı görerek düzenle** düğmesini veya **Görsel düzenleyici** kartını açın: `/admin/visual-editor`.

1. Önizlemedeki yazıya veya görsele dokunun. Bölüm/alan listeleriyle de seçim yapabilirsiniz. Başka bir slaydın alanını seçince ilgili slayt açılır. Hizmet kapsamı ve soru seçildiğinde açılır alan görünür hale gelir.
2. Metni yazarken değişiklik yalnız sizin önizlemenizde görünür. **Bu alandaki değişikliği geri al**, alanı son kaydedilmiş haline döndürür.
3. Bir fotoğraf alanını seçip kütüphaneden görsel seçin veya alt metin girerek yeni dosya yükleyin. Yeni yükleme kütüphaneye hemen eklenir; karttaki fotoğraf değişimi **Değişiklikleri kaydet** düğmesine basılana kadar ziyaretçiye görünmez.
4. **Masaüstü** ve **Mobil** düğmeleriyle iki yerleşimi kontrol edin. Önizlemede slayt otomatiği ve kayan dekorasyonlar durdurulur.
5. **Değişiklikleri kaydet** ile taslağı yayınlayın. Başka sekmede belge güncellenmişse kaydetme durdurulur ve taslak korunarak uyarı gösterilir; güncel içeriği kontrol edin.

Kart ekleme, sıralama, kaldırma, seçim türleri ve görünürlük için içerik formunu kullanın. Önizlemede gizli bir bölümün metinlerini düzenlemek için de aynı form kullanılabilir. Yan panelin altında içerik formuna ve site ayarlarına bağlantılar bulunur.

## Ortak site ayarları

**Site ayarları**: `/admin/globals/site-settings`.

- **Marka ve düğmeler:** isim, isim altı tanım, mesleki unvan, onay notları, açıklama, ortak randevu düğmesi, footer metinleri ve isteğe bağlı HTTPS online randevu bağlantısı. Slider'ın kendine ait düğme metinleri ana sayfa formundadır.
- **İletişim:** telefon, e-posta, adres, saatler ve ilk WhatsApp mesajı. Gerçek alıcı bilgileri doğrulanmadan örnek işaretini kaldırmayın. Örnek iletişim bilgileri arama/mesaj başlatmaz.
- **WhatsApp ve Instagram:** hesap görünürlüğü ve bağlantıları. Instagram yalnız geçerli HTTPS Instagram adresi kabul eder. Görünürlük ortak sosyal alanlara uygulanır; WhatsApp gizlendiğinde yüzen WhatsApp düğmesi de kalkar.
- **Fotoğraflar:** portre ve paylaşılan yemek/meyve/mutfak fotoğrafları. Slayt veya kartın özel fotoğrafı varsa o görsel kullanılır; özel görsel boşsa paylaşılan alan ve son olarak tasarım görseli kullanılır. Portre boşsa kişi fotoğrafı uydurulmaz; ayrılmış alan gösterilir.
- **Menü:** bölüm bağlantılarını sıralayın, adlarını değiştirin veya gizleyin. Hizmetler, Hakkımda, Kimler için, Sistem, Tarifler, SSS ve İletişim desteklenir.

## Görseller, hesaplar ve arşiv

Görsel kütüphanesi JPEG, PNG, WebP ve AVIF dosyalarını, zorunlu alt metinle ve en fazla 8 MB boyutla kabul eder. SVG yüklenmez. Kullanılan fotoğrafı silmeden önce ilgili kartlardan kaldırın. Veriler ve yüklemeler Docker volume'lerinde kalır; `down -v` kullanmayın.

Yeni yönetici yalnız mevcut yönetici tarafından eklenebilir. Açık hesap kaydı ve anonim içerik yazma yoktur. Son yönetici silinemez. Şifre kurtarma e-postası henüz etkin değildir.

**Eski ana sayfa · Arşiv**, önceki tasarımın kayıtlarını korur. Buradaki değişiklikler yeni ana sayfaya yansımaz. Mevcut vücut analizi ayarları da korunmuştur; yeni tasarımın bu çalışma kapsamında eklenmiş bir analiz bölümü yoktur.

Geliştirme ve üretim veritabanları ayrıdır. Bu revizyon yerel geliştirme ortamında uygulanmıştır; canlı yayın yapılmamıştır. [Docker işletimi](docker.md) ve [yedekleme kılavuzu](backup-restore-runbook.md).
