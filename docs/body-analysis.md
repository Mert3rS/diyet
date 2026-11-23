# Vücut analizi — uygulama ve doğrulama

23 Kasım 2026. Payload / PostgreSQL / admin bulunmadığı doğrulandı. Bu isteğin fallback'i uygulandı: ek CMS kurulmadan `getBodyAnalysisSettings()` ve güvenli yerel varsayılanlar. Mevcut sosyal/iletişim getter'ları hâlâ örnek içerik okur. Analytics yoktur; analiz tıklama olayı eklenmedi.

## Kaynak doğrulaması

- Deurenberg, Weststrate ve Seidell (1991), _Body mass index as a measure of body fatness: age- and sex-specific prediction formulas_. Yazar kurumunun [yayın/özet kaydı](https://research.vu.nl/en/publications/body-mass-index-as-a-measure-of-body-fatness-age-and-sex-specific/) yetişkin formülünü ve **SEE 4,1 yüzde puan** değerini birlikte verir; [DOI](https://doi.org/10.1079/BJN19910073), [PubMed](https://pubmed.ncbi.nlm.nih.gov/2043597/). PubMed açık sayfası araçta sınırlı görüntülendiğinden kurum kaydıyla karşılaştırıldı.
- Hodgdon ve Beckett (1984), NHRC 84-11, _Prediction of Percent Body Fat for U.S. Navy Men from Body Circumferences and Height_: özgün raporun [taranmış kopyası](https://archive.org/details/DTIC_ADA143890) ve [OCR metni](https://archive.org/download/DTIC_ADA143890/DTIC_ADA143890_djvu.txt). Nihai yoğunluk katsayıları ve **SEE 3,52 yüzde puan** doğrulandı. Örneklem 602 erkek, 18–56 yaş.
- Aynı yazarlar, NHRC 84-29, kadın raporu: [taranmış kopya](https://archive.org/details/DTIC_ADA146456), [OCR metni](https://archive.org/download/DTIC_ADA146456/DTIC_ADA146456_djvu.txt). Nihai yoğunluk katsayıları, Siri dönüşümü ve **SEE 3,72 yüzde puan** doğrulandı. Örneklem 214 kadın, 18–44 yaş. Raporun dış doğrulama örneklemlerinde 4,04 ve 4,36 puanlık hatalar da vardır; geliştirme SEE'si kişiye garanti değildir.

Resmî DTIC PDF uçları bu oturumda erişilemedi; arşivdeki **özgün rapor metinleri** kontrol edildi. [National Academies tablosu](https://www.nationalacademies.org/read/6104/chapter/12) hata payları için çapraz kontrol sağlar, ancak kadın çevre toplamında `+ neck` yazımı vardır. Bu nedenle tam katsayılar ve eksi boyun işareti için özgün NHRC raporu esas alındı. Web hesaplayıcılarından katsayı kopyalanmadı.

## Sabit hesap

Tüm uzunluklar cm, kilo kg, yaş yıl; `sex=1` erkek, `0` kadın. Katsayılar ve sınırlar `src/lib/body-analysis/calculations.ts` içindedir; ayarlardan değiştirilemez.

```text
VKİ = kilo / (boy / 100)²
Deurenberg = 1.20 × VKİ + 0.23 × yaş − 10.8 × sex − 5.4

Navy erkek yoğunluk = 1.0324 − 0.19077 × log10(bel − boyun) + 0.15456 × log10(boy)
Navy kadın yoğunluk = 1.29579 − 0.35004 × log10(bel + kalça − boyun) + 0.22100 × log10(boy)
Navy yağ % = 495 / yoğunluk − 450
```

Kadında boyun+bel+kalça, erkekte boyun+bel tamamlanınca Navy kullanılır; eksikse Deurenberg. Erkekte bel göbek deliği hizası, kadında belin en dar yeri; kalça en geniş yer, boyun gırtlağın altıdır. İpuçları metin ve basit SVG ile verilir. Tutarsız/bozuk dolu çevre ölçüsü sessizce diğer yönteme düşmez: sayı gösterilmez. Sayısal olarak okunamayan çevreler mesaja alınmaz; karşılaştırması tutarsız ama okunabilir ham değerler ziyaretçi tarafından gönderilebilir.

18–80 tam yaş, 120–220 cm boy, 30–250 kg kilo sabittir. Çevreler için 0'dan büyük/en fazla 300 cm geniş bir giriş sınırı vardır; bu bir klinik referans aralığı değildir. Bel ≤ boyun reddedilir. Merkezi yağ tahmini %3'ün altında/%60'ın üstünde veya sonlu değilse hiçbir tahmin/VKİ gösterilmez; ham ölçülerle mesaj hazırlanabilir. Hamilelik/emzirmede de tahmin/VKİ gösterilmez. 18 yaş altı araçtan mesaj hazırlayamaz, normal iletişim seçeneklerini görür.

Sonuç aralığı `[floor(merkez − SEE), ceil(merkez + SEE)]`, fiziksel %0–100 sınırına kırpılmıştır. Yuvarlama dışa doğrudur; **tek bir kesin yağ oranı gösterilmez**. Aralığın uçları %3–60 merkez guard'ını aşabilir. Bu SEE bandı kişisel güven aralığı değildir, gerçek sapma daha büyük olabilir. VKİ yalnız bir ondalık ve kategorisizdir. Çıktı reçete veya hedef içermez.

## Mesaj, ayar ve mahremiyet sınırı

Varsayılan görünürlük geliştirmede açık, üretimde kapalıdır. Araç kapalıysa bölüm ve hero linki render edilmez; yeni menü maddesi eklenmedi. Açıkken eski `#hesaplayici` çapasının yeri korunur. Hedef seçimi context ile hizmeti önceden seçer; ölçü taşımaz. `metabolik` seçimi `bireysel`e, eşleşmeyen hizmet varsayılana döner.

Sabit uyarı/onay/etiketler dahil varsayılan metinler `src/content/body-analysis.ts` içindedir. `analysisCopy` panel sözleşmesinin dışındadır. `settings.ts` yalnız izinli anahtarları birleştirir; HTML, uzun/geçersiz metin ve kısıtlı ifadeler güvenli varsayılana düşer. Bu filtre uzman editör incelemesinin yerini tutmaz. CMS erişim kontrolü/revalidation/örnek admin önizlemesi yoktur; [planlanan model](content-model.md) ve [düzenleme kılavuzu](admin-guide-tr.md) ayrıntılıdır.

İzinli 8 placeholder dışındakiler reddedilir; builder boş veya bilinmeyen alan içeren satırları atlar. Ad ayrı “Adım” satırıdır. cm/kg template satırlarında, çevre ölçüleri ve hamilelik bilgisi ayrı browser satırlarında bulunur. Yağ satırı yalnız “tahmini aralık” taşır. VKİ/yağ mesaj anahtarları hesap yöntemini değiştirmez. Metin `Intl.NumberFormat('tr-TR')` ile hazırlanır. Şablon en fazla 800 karakter; URL için 2000 karakterlik **uygulama uyumluluk bütçesi** kullanılır (WhatsApp için evrensel sınır iddiası değildir). Otomatik taslak gerekirse önce ad/yağ/VKİ, ardından diğer isteğe bağlı satırları çıkarır; kullanıcıya kısaltıldığı gösterilir. Elle düzenlenen mesaj sonradan kesilmez: çok uzunsa gönderim kapanır ve kopyalama açık kalır.

Numara sırası: geçerli araç override → onaylı ana iletişim kaydı → site fallback'i. Placeholder/boş numara gerçek alıcıya dönüşmez. Biçim doğrulaması E.164 sözdizimidir, sahiplik/reachability doğrulaması değildir. Gerçek numara ve gerçek KVKK sayfası yoktur; telefon/e-posta alternatifleri şimdilik iletişim bölümüne gider, bu durum arayüzde açıklanır.

Hesap/önizleme/onay sadece component belleğindedir; sunucu/ağ/depolama/site URL'si kullanılmaz. Değişiklik sonucu ve mesaj onayını düşürür. Yalnız ziyaretçinin boş başlayan onayı ve kendi tıklamasıyla haricî `wa.me` URL'si açılır; WhatsApp'ta son gönderim de kullanıcıya aittir. Bu haricî URL **mesaj verisini içerir**. Hukuk ve klinik veri sorumluluğu incelemesi [gizlilik notlarında](privacy-notes.md) yayın engeli olarak yer alır.

## Bağımsız referans değerleri

Sabit test fixture'ları .NET `Math.Log10` ve PowerShell aritmetiğiyle, uygulamanın JS işlevlerini çağırmadan yukarıdaki yayımlanmış denklemlere yerleştirilerek hesaplandı. Bunlar kaynakta hazır vaka sonucu iddiası değildir.

| Yöntem           | Girdiler                           | Merkezi referans (yalnız test, UI'da gösterilmez) |
| ---------------- | ---------------------------------- | ------------------------------------------------- |
| VKİ              | 65 kg, 170 cm                      | 22.49134948096886                                 |
| Deurenberg kadın | Aynı ölçüler, 30 yaş               | 28.489619377162633                                |
| Deurenberg erkek | 80 kg, 180 cm, 40 yaş              | 22.629629629629626                                |
| Navy erkek       | 180 cm, boyun 38, bel 90           | 19.811988411785478                                |
| Navy kadın       | 165 cm, boyun 34, bel 75, kalça 95 | 26.40588214290193                                 |

Testler ayrıca Türkçe ondalığı, sınırları, eksik/tutarsız çevreleri, gebelik/18 yaş altını, encoding ve boş alanları, telefon biçimini, URL bütçesini ve unsafe ayarları kapsar. Ölçüler, ad ve telefon fixture'ları test verisidir; site iletişim bilgisi değildir ve gerçek WhatsApp mesajı gönderilmez.

E2E: 320/390/768/1440 px form ve önizleme, klavye akışı, axe, yasak ifadelerin görünmemesi, onayın tekrar boşalması, clipboard fallback ve hesap/önizleme/onay sırasında **sıfır ağ isteği/depolama yazımı/URL değişikliği** doğrulanır. Güncel test sonucu aşağıdaki teslim doğrulamasına kaydedilir. Mevcut genel yayın NO-GO durumu ve diğer fazların eksikleri devam eder.

## Teslim doğrulaması

- `npm run check` ve `npm run build`: sıfır hata/uyarı.
- Playwright: **24/24** (7 saf araç testi, 8 araç tarayıcı testi, 9 mevcut sayfa/veri kontrolü). Operasyon testleri: **5/5**.
- Üretim statik HTML'i: araç, hero bağlantısı ve eski araç çapasının varsayılan olarak bulunmadığı doğrulandı. Yeni production sunucusu başlatılmadı; tarayıcı kontrolleri mevcut geliştirme sunucusundadır.
- Ekran görüntüleri: `test-results/analysis-{320,390,768,1440}.png`; gerçek mobil cihaz ve gerçek WhatsApp hesabı denenmedi. Lighthouse yeniden ölçülmedi.

Değişen mevcut kod: ana sayfa sırası/getter çağrısı (`page.tsx`); hero'ya koşullu bağlantı; GoalPicker'a yalnız bellek içi hizmet aktarımı; `closing-sections.tsx` içinden eski araç, eski 3 hesaplayıcı dosyası ve kullanılmayan mock/CSS kuralları kaldırıldı; `site.ts` içine boş numara fallback'i, `site-settings.ts` içine getter eklendi; mevcut testler yeni araca geçirildi. Diğer bölümler yeniden tasarlanmadı. Yeni dosyalar: `content/body-analysis.ts`, `lib/body-analysis/{types,calculations,messages,settings}.ts`, `components/home/body-analysis*.tsx`, `styles/body-analysis.css`, iki araç test dosyası ve bu belge/Türkçe yönetim kılavuzu. README, tasarım, mimari, içerik modeli, gizlilik, yayın listesi, yol haritası ve doğrulama raporu güncellendi. Yeni bağımlılık eklenmedi.

Sahibinin kararları: doğrulanmış WhatsApp/telefon/e-posta; hangi hizmetlerin gerçekten sunulduğu; mesaj şablonu ve uyarıların uzman/hukuk onayı; gerçek KVKK sayfası ve aktarım değerlendirmesi; ardından üretimde aracı açma kararı. Formüller için ayrı bir editör ayarı gerekmiyor. Genel site hâlâ örnek içeriklidir ve yayın engelleri sürer.
