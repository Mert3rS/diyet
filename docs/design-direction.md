# Tasarım yönü — spor ve beslenme

24 Kasım 2026. Ana sayfa, canlı mavi ve beyaz üzerine kuruludur. Marka dili: açık, enerjik, bilimsel ve sonuç vaat etmeyen. Bu sürüm yerel tasarım önizlemesidir; yayın ve yeni backend çalışması içermez.

## Değişkenler ve fontlar

Tüm palet `src/styles/globals.css` içindedir: navy-950 #050B24, navy-800 #0B1F5C, blue-700 #1440D6, blue-600 #1E5BFF, blue-500 #3B82FF, sky-400 #5BB8FF, cyan-300 #4FE3FF, ice-100 #E8F3FF, mist #F5F9FF, white #FFFFFF. Gradientler ve saydam yüzeyler yalnız bu değişkenlerden türetilir. Eski bileşenler için kalan renk takma adları da bu palete bağlanır.

Başlık ve gövde: projedeki Türkçe karakter destekli, değişken ağırlıklı Geist dosyası; `next/font/local`, swap ve font preload kullanılır. Yeni Google fontu indirilmedi. Büyük başlıklarda sıkı harf aralığı ve akışkan clamp ölçeği; sayaçlarda tabular-nums kullanılır.

## Hesaplanan WCAG kontrastları

sRGB bağıl parlaklık formülüyle hesaplandı. Normal metin için en az 4.5:1:

| Ön plan / arka plan | Oran    |
| ------------------- | ------- |
| Beyaz / blue-600    | 5.26:1  |
| Beyaz / blue-700    | 7.68:1  |
| Beyaz / navy-800    | 15.39:1 |
| Beyaz / navy-950    | 19.45:1 |
| navy-950 / sky-400  | 9.02:1  |
| navy-950 / cyan-300 | 12.75:1 |
| navy-800 / ice-100  | 13.70:1 |
| blue-700 / mist     | 7.27:1  |
| cyan-300 / blue-700 | 5.03:1  |

Açık zemindeki başlık gradienti blue-700 → blue-600 olarak sınırlandı; istenen cyan bitişi açık zeminde metin kontrastını düşüreceği için metinde kullanılmadı. Cyan ve sky, açık zeminde dekorasyon olarak kullanılır. Koyu zemindeki gradient beyaz → cyan'dır. Fotoğraflardaki yazı alanlarına koyu mavi scrim uygulanır. Saydam yüzeylerde temel zemin koyu tutulur. Otomatik axe taraması fotoğraf/gradient piksellerindeki her olası karşıtlığı kanıtlamaz; tabloda sabit eşleşmeler ve gradient uçları doğrulanır.

## Hero ve etkileşimler

Tek h1 slaytların dışındadır. Dört hizmet slaydının başlıkları h2'dir. Görseller: lisansı doğrulanmış yerel koşu fotoğrafı, mevcut yemek fotoğrafları ve özgün SVG pist kompozisyonu. İlk slayt eager yükleme ve yüksek fetchPriority alır ve ilk metin paint sırasında gizlenmez; sonraki metinlerde maskeli yükselme ve görselde diagonal clip-path geçişi vardır.

Geçiş yaklaşık 6 saniyedir. Hover ve odak sırasında durur; slayt seçimi, ok tuşu, swipe ve CTA etkileşimi otomatiği kapatır. Yalnız açık Oynat düğmesi yeniden başlatabilir. Duraklat kontrolü hero içindeki sürekli dekoratif animasyonları da durdurur. Sekme gizlendiğinde geçiş bekler. aria-live otomatikte off, duraklatıldığında polite olur.

Bilgi Al, ilgili hizmet kapsamını açıp oraya kaydırır. Hedef kitle kartı ek olarak ilk mesajı yalnız React belleğinde hazırlar; sayfa yenilenince kaybolur. Doğrulanmış WhatsApp numarası yokken dış alıcıya gönderilmez. Tarif filtreleri yereldir. Native details ve dialog klavye davranışlarını korur.

Performans panosu yalnız illüstrasyondur. Gerçek ölçüm, yüzde, gram, saat, kalori veya sonuç göstermez. Mobilde göstergeler ve zaman çizelgesi yatay kaydırılır; bu alanlar klavye odağı alır.

## Hareket ve mobil performansı

Orkestrasyon mevcut motion paketiyle, basit animasyonlar CSS ile yapılır. Yalnız transform, opacity ve clip-path hareket eder; blur yarıçapı animasyonu yoktur. Tek backdrop-filter katmanı masaüstü panosundadır; mobilde ve reduced-motion'da opak yüzeye dönüşür. Mobilde parallax, tilt, Ken Burns ve aurora drift devre dışıdır. Kart glow ve tilt yalnız hassas masaüstü işaretçisinde çalışır.

Lenis masaüstünde dinamik import edilir; azaltılmış harekette veya editör önizlemesinde başlatılmaz. Footer'daki düğmeyle kapatılabilir. prefers-reduced-motion; slayt ve yorum otomatiğini, marquee, halka, aurora ve kaydırma animasyonlarını kapatır. İçerik sunucu HTML'inde okunabilir; Reveal görünür içerikten başlar.

## Kapsam ve düzenleme

Marka ve menü varsayılanları `src/config/site.ts`; Örnek modu paneldeki isMock alanları belirler. Görseller `src/content/images.ts`; tüm yeni örnek kayıtlar `src/content/mock-data.ts` içindeki sports* exportlarındadır ve isMock:true taşır. Ortak animasyonlar `src/components/ui/sports-motion.tsx` içindedir.

Sayfa sırası: bilgi barı/header → hero/pano/marquee → hedef kitle → hakkımda → hizmetler → dört adımlı sistem → etkinlikler → tarifler → sosyal/video/blog önizlemesi → örnek yorumlar → SSS → iletişim → footer. Menü ana sayfa çapalarına gider. İç sayfalar bağlantısız Yakında durumundadır.

Yeni ana sayfa sports-homepage CMS kaydından render edilir. Metinler, listeler, özel görseller ve görünürlük panelden yönetilir. Ortak marka/menü/iletişim/portre site-settings kaydından gelir. Görsel editör yeni tasarıma bağlandı; eski homepage kayıtları arşiv olarak korunur. Kodda USE_MOCK_CONTENT anahtarı yoktur.

## Sürüm ve dokümantasyon kaydı

Yeni uygulama paketi kurulmadı; package.json ve package-lock.json içindeki sabit sürümler korundu: Next 16.4.6, React/React DOM 19.3.1, motion 14.14.0, Lenis 1.3.27, Tailwind 4.3.5, TypeScript 6.0.3, Lucide React 1.78.0. Kontroller Docker'ın sabit Node 24.22.3 imajında yürütüldü. Lighthouse 13.6.0 yalnız npm önbelleğinden geçici CLI olarak çalıştırıldı; proje bağımlılığı yapılmadı.

Uygulama öncesi depoya kurulu Next rehberleri okundu: `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`, `13-fonts.md`, `03-api-reference/02-components/image.md`. Özellikle priority deprecation'ı ve preload/eager/fetchPriority seçimi bu sürümün rehberinden doğrulandı.

Resmî referanslar: [Next font](https://nextjs.org/docs/app/api-reference/components/font), [Motion AnimatePresence](https://motion.dev/docs/react-animate-presence), [Motion useReducedMotion](https://motion.dev/docs/react-use-reduced-motion), [Lenis API](https://github.com/darkroomengineering/lenis#settings), [Lighthouse CLI](https://github.com/GoogleChrome/lighthouse#using-the-node-cli).

Cursor glow, Tilt kapsayıcısında CSS değişkenleriyle uygulanır; ayrı bir global işaretçi katmanı oluşturulmadı. İsteğe bağlı giriş perdesi eklenmedi. Gerçek portre, biyografi, unvan, iletişim, sosyal bağlantılar, tarifler, etkinlikler ve yorumlar yayın öncesi değiştirilmelidir. İkinci spor fotoğrafı güvenilir biçimde indirilemediği için takım slaydında özgün SVG pist yer tutucusu kullanıldı.

Son performans düzenlemesinde Motion özellikleri LazyMotion ile hydration sonrasında ayrı parçadan yüklenir. Mobil hero'da gren ve yörünge çizimleri kaldırılır; fotoğraf üstünde tek mavi gradient ve statik görüntü kalır. Koşu görseli responsive sizes ve quality=60 ile sunulur. Ekran dışındaki uzun içerik bölümleri content-visibility:auto ile ertelenir. API doğrulaması: [Motion LazyMotion](https://motion.dev/docs/react-lazy-motion).
