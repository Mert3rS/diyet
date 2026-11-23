# İçerik ve sayfa planı

Bu belge ileride değerlendirilebilecek geniş CMS modelini tarif eder. Aşağıdaki koleksiyonlar ve ayrı sayfa route'ları henüz oluşturulmamıştır. Faz 1 tek sayfadır; örnek kayıtlar `mock-data.ts`, sosyal erişim `getSocialLinks()` üzerinden gelir. Kullanıcı “Phase 2” demeden admin geliştirmesi başlamaz; Faz 2'nin ilk kapsamı yalnızca sosyal hesaplar ve iletişim için Site Ayarları global'idir. Geniş blog/tarif koleksiyonları ayrıca planlanacaktır.

## Hedef sayfalar

| Route                             | İçerik                                             |
| --------------------------------- | -------------------------------------------------- |
| `/`                               | Ana sayfa, yaklaşım, öne çıkan hizmet ve içerikler |
| `/hakkimda`                       | Doğrulanmış uzman biyografisi, eğitim ve yaklaşım  |
| `/hizmetler`                      | Gerçek hizmet listesi                              |
| `/hizmetler/[slug]`               | Hizmet kapsamı, süreç, ilgili sorular              |
| `/blog` ve `/blog/[slug]`         | Uzman tarafından incelenmiş yazılar                |
| `/tarifler` ve `/tarifler/[slug]` | Malzemeler, adımlar, görseller                     |
| `/iletisim`                       | Onaylı iletişim bilgileri ve çalışan talep formu   |
| `/randevu`                        | Seçilen randevu kanalına uygun akış                |
| `/gizlilik`, `/cerez-politikasi`  | Gerçek veri akışına göre hazırlanan metinler       |
| `/admin`                          | Kimliği doğrulanmış içerik yönetimi                |

Online danışmanlık ilk aşamada bir hizmet olarak ele alınır. Spor kulüpleri, kurumsal danışmanlık ve etkinlikler gerçek hizmet kapsamı doğrulanırsa eklenir.

## Önerilen CMS koleksiyonları

| Koleksiyon   | Başlıca alanlar                                                                | Public erişim                                        |
| ------------ | ------------------------------------------------------------------------------ | ---------------------------------------------------- |
| `users`      | E-posta, kimlik doğrulama, rol                                                 | Kapalı                                               |
| `media`      | Dosya, alt metin, kaynak/izin notu                                             | Yayındaki içeriklerde kullanılan medya politikasıyla |
| `services`   | Başlık, slug, özet, detay, görsel, sıra, SEO, yayın durumu                     | Yalnızca yayınlanan kayıtlar                         |
| `posts`      | Başlık, slug, özet, metin, yazar, inceleyen uzman, kapak, kategori, tarih, SEO | Yalnızca yayınlanan kayıtlar                         |
| `recipes`    | Başlık, slug, porsiyon, süre, malzemeler, adımlar, görsel, SEO                 | Yalnızca yayınlanan kayıtlar                         |
| `categories` | Ad, slug, içerik türü                                                          | Aktif ve yayınlanan içeriklerle ilişkili olanlar     |
| `faqs`       | Soru, yanıt, ilgili hizmet, sıra, yayın durumu                                 | Yalnızca yayınlanan kayıtlar                         |
| `inquiries`  | Ad, iletişim kanalı, kısa mesaj, hizmet tercihi, işleme durumu                 | Kapalı; yetkili kullanıcılar                         |

Danışan dosyaları, tahliller, ölçüm geçmişi, beslenme planları ve ödemeler başlangıç CMS kapsamına dahil değildir. Kesin randevu yönetimi seçilen takvim çözümüne göre ayrıca modellenir.

## Önerilen global ayarlar

- `site-settings`: Marka, logo, iletişim, sosyal bağlantılar, gezinme ve varsayılan SEO.
- `homepage`: Açılış metni/görseli, yaklaşım, seçili hizmetler, süreç ve iletişim çağrısı.
- `about`: Uzman biyografisi, portre, doğrulanmış eğitim ve mesleki bilgiler.

## Vücut Analizi Ayarları — Faz 2 için hazır sözleşme

Payload kurulu olmadığı için bu Global ve `/admin` ekranı **oluşturulmadı**. Mevcut kaynak `getBodyAnalysisSettings()` ve `src/content/body-analysis.ts`; allowlist doğrulayıcısı `src/lib/body-analysis/settings.ts` içindedir. Faz 2 kapsamına bu Global de eklenecek.

| Planlanan alan                  | Hazır frontend sınırı                                                                   |
| ------------------------------- | --------------------------------------------------------------------------------------- |
| Aracı sitede göster             | Development açık; production kapalı varsayılan                                          |
| Başlık / alt başlık / açıklama  | 60 / 100 / 300 karakter, düz metin, kısıtlı içerik                                      |
| Hesapla / gönder etiketleri     | 40 karakter                                                                             |
| Hizmetler                       | En fazla 8, benzersiz kimlik, 80 karakter etiket, tek varsayılan                        |
| Boyun / bel / kalça görünürlüğü | Bağımsız boolean; kalça yalnız kadın seçiminde                                          |
| Mesaj şablonu                   | En fazla 800 karakter, trim, yalnız izinli alanlar, HTML yok, bağımsız açıklayıcı cümle |
| VKİ / yağ aralığı mesaj satırı  | Yalnız mesajı etkiler, hesabı etkilemez                                                 |
| Araç WhatsApp override          | Boşsa ana onaylı numara; E.164 biçim normalizasyonu                                     |

İzinli alanlar: `{ad}`, `{cinsiyet}`, `{yas}`, `{boy}`, `{kilo}`, `{vki}`, `{yag_orani}`, `{hizmet}`. Çevre ölçüleri/pregnancy satırı builder tarafından eklenir; yeni placeholder açılmaz. Sabit formüller, hata payları, 18 yaş sınırı, tahmini aralık etiketi, plausibility sınırı, uyarı ve onay metinleri panel alanı değildir. `analysisCopy` geliştirme kaynak kodudur, yöneticiye açılan ayar nesnesi değildir.

Faz 2'de public read / yalnız oturumlu admin write sunucuda uygulanmalı; frontend allowlist'i bunun yerine geçmez. Bilinmeyen alan hatası Türkçe olmalı, sıfırlama varsayılan şablonu getirmeli, “Örnek değerlerle önizleme” hazırlanmalı. Boş/erişilemeyen DB'de production güvenli kapalı davranışı ve kişisel veri içermeyen hata kaydı; kaydetme sonrası resmî Payload/Next API'leriyle revalidation ayrıca uygulanıp test edilmeli. Mevcut kod bu işlemleri yapmış sayılmaz.

## Yayın ilkeleri

- Taslaklar public sorgularda dönmez. Yönetici yetkisi public sorgulara taşınmaz.
- Slug benzersizdir; adres değişiminde yönlendirme planlanır.
- Görsel için alternatif metin, yazı için yazar/uzman ve güncelleme tarihi tutulur.
- Tarif besin değerleri ancak doğrulanmış hesaplama kaynağıyla eklenir.
- Yorum ve başarı hikâyesi modeline gerçek içerik ve yayın izni olmadan ihtiyaç yoktur.
- Randevu talepleri ve iletişim kayıtları blog/veri API'leri üzerinden okunamaz.

CMS geliştirilirken erişim kuralları ve yayın davranışı entegrasyon testleriyle doğrulanır. Koleksiyonlar gerçekten eklendikten sonra bu belge güncel şema ve admin kullanım kılavuzuna dönüştürülür.
