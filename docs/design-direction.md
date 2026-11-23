# Tasarım yönü — Faz 1

Günay Turan, `gunayturan.com.tr`. Görsel dil bir wellness dergisinin ferah ve kişisel hissini taşır: büyük serif başlıklar, organik kompozisyon, gerçek yemek fotoğrafları, kontrollü hareket ve açık gezinme.

## Tasarım değişkenleri

| Rol                 | Değer                                   |
| ------------------- | --------------------------------------- |
| Ana yüzey           | Sıcak krem `#F6F1E7`                    |
| Metin/koyu bölümler | Orman yeşili `#10261E`                  |
| Tek canlı vurgu     | Lime `#C6E04A`                          |
| İkincil ton         | Adaçayı `#9DB5A0`                       |
| Başlıklar           | Fraunces 450; seçili sözcüklerde italik |
| Gövde               | Geist, Latin Extended                   |
| Kartlar             | 24–32 px köşe, geniş iç boşluk          |

Değişkenler `globals.css`, fontlar kök layout, marka ve menü `site.ts` içindedir. Anlamlı metinler ve örnek kayıtlar `mock-data.ts` içinde düzenlenir. Adaçayı küçük metin olarak açık yüzeyde kullanılmaz; metinler koyu yeşil veya kontrastı yüksek ikincil tondadır.

## Sayfa sırası

Header → hero → marquee → hakkımda → altı hizmet → yapışkan süreç → hedef seçimi → vücut analizi (açıksa) → paketler → örnek yorumlar → bağlantısız blog önizlemesi → SSS → iletişim → büyük kelime işaretli footer.

Menü yalnızca `#hakkimda`, `#hizmetler`, `#surec`, `#sss`, `#iletisim` hedeflerine gider. Blog, tarif ve hukuk sayfaları bağlantısız “Yakında” durumundadır. Randevu CTA'sı header'da, mobil alt çubukta ve yüzen WhatsApp alanında bulunur; örnek iletişim kaydı alıcıya yönlenmez.

`#analiz` açıkken hero'ya “Vücut analizini dene” bağlantısı eklenir; kapalıyken bölüm ve bağlantı render edilmez. Eski `#hesaplayici` bağlantıları açık araç içinde bir çapa ile korunur. Menüye yeni madde eklenmedi. Diğer bölümlerin düzeni değiştirilmedi.

Araç masaüstünde form/sonuç olarak iki sütun, 900 px altında tek sütundur. Mobilde bölüm sınırları içinde üstte kalan kısa sonuç özeti vardır. Krem form, adaçayı sonuç yüzeyi, Fraunces başlık ve yumuşak SVG aralık bandı kullanılır. Tek bir kesin yağ oranı göstermeme kuralı nedeniyle sayım animasyonu aralığın **iki ucuna** uygulanır. Animasyonlar opacity/transform/clip-path ile sınırlıdır; azaltılmış harekette son değerler hemen görünür. Mesaj ayrı bir adımda düzenlenir; değişiklik onayı kaldırır.

## Sosyal medya ve yüzen iletişim

Sosyal alan, krem bir panel içinde serif başlık ve ilk hesabın iki satır boyunca öne çıktığı asimetrik bir düzendir. Diğer platformlar ikon, açık platform adı ve kısa açıklama taşır. Mobilde iki/sırasıyla tek sütuna geçer; ilk kart yataylaşır. Footer'da yalnız ikon yerine platform adları bulunan ince kapsüller, masaüstü sol kenarda tek bir yumuşak çerçeveli ikon şeridi kullanılır. Yeni görseller veya takipçi/başarı sayıları eklenmez. Örnek hesap ibareleri ve gerçek veri kaynağının HTTPS/görünürlük/sıra filtresi korunur.

Platform adları ve açıklama fallback'leri `src/content/socials.ts`, mevcut kayıt etiketleri `mock-data.ts` içindedir; varsa `SocialLink.label` kart açıklamasında kullanılır. Sosyal linkler sunucuda normal anchor olarak render edilir; manyetik hareket/klik efekti için ek client component gerekmez. İkonlar currentColor SVG'dir. CSS yalnız transform/opacity geçişleri kullanır; azaltılmış hareket saygıyla korunur.

Sağ alttaki büyük yazılı WhatsApp kapsülü yerine 62 px, mobilde 56 px, çift yüzeyli yuvarlak bir düğme vardır. Açıklaması hover/klavye odağında görünür, Escape ile kapanır; açıklama üzerine gelince açık kalır. Gerçek numara yoksa iletişim bölümüne gider ve erişilebilir adı bunu söyler. İletişim veya footer görünürken yüzen grup gizlenerek bağlantıların üstünü örtmez. Mobil sabit randevu çubuğunun üzerinde güvenli boşluk bırakılır.

## Üç ana hareket

1. Hero: 700 ms atlanabilir dekoratif giriş şeridi; maskeli başlık, tek sefer çizilen alt çizgi, organik şekil, iki fotoğraf ve masaüstü imleç/kaydırma paralaksı. Şerit tam ekranı veya ana fotoğrafı gizlemez.
2. Süreç: masaüstünde sol anlatım/görsel yapışır; sağdaki adımlar kaydırma ilerlemesine göre vurgulanır. İlerleme çizgisi transform ile dolar, görseller opacity ile değişir, koyu yüzeyin ton katmanı yumuşak geçiş yapar.
3. Hedef seçimi: seçilen kartın fotoğrafı açılır, ilgili hizmet bağlantısı ve WhatsApp mesaj taslağı güncellenir. Hizmete geçiş açık bir kullanıcı eylemidir; seçim sırasında otomatik kaydırma odağı kaçırmaz.

Destekleyici hareketler: görünümde reveal, yavaş marquee, kart lift/ikon dönüşü, masaüstü manyetik bağlantı ve tıklama dalgası; sürüklenebilir/duraklatılabilir yorumlar; SSS clip geçişi. Layout ölçüleri animasyonla değiştirilmez. Marquee hover'da durur; yavaşlatmanın daha güçlü ve okunabilir alternatifidir.

## Mobil, erişilebilirlik ve görseller

320, 390, 768 ve 1440 px hedeflenir. Mobilde menü ayrı açılır; Escape kapatır, odak düğmeye döner. Dokunmatik kullanımda parallax/manyetik hareket kapalıdır. Başlıklar ve satırlar akışkan boyutlanır; uzun kart başlıkları taşmaz.

Azaltılmış harekette giriş şeridi, marquee, yorum autoplay, parallax ve scroll/reveal animasyonları kapatılır. İlk sunucu HTML'i ile ilk tarayıcı çizimi aynı yapıyı kullanır. Ana içerikte tek h1, semantik başlıklar, görünür odak ve atlama bağlantısı korunur. Native SSS `summary` klavye ile açılabilir.

Stok fotoğraflar yalnızca yemek/mutfak sahnesidir. Günay Turan portresi için yer tutucu vardır; gerçek dosya eklendiğinde build sırasında otomatik kullanılır. Fotoğraf envanteri ve lisanslar [görsel kaynaklarında](image-credits.md), gerçek içeriğe geçiş [yayın kontrol listesinde](launch-checklist.md) bulunur.
