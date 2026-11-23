# Görsel kaynakları

Faz 1'de kullanılan dört örnek fotoğraf kaynak sayfaları üzerinden doğrulandı ve `public/images/` altına WebP olarak indirildi. Kullanılan görseller Unsplash+ içeriği değildir; kaynakların lisans alanı [Unsplash License](https://unsplash.com/license) olarak doğrulandı. Bu lisans ticari kullanıma ve görsellerin düzenlenmesine izin verir; görselleri ayrı bir stok koleksiyonu olarak yeniden satma hakkı vermez.

| Yerel dosya        | Fotoğrafçı             | Kaynak                                                                                                                                                                                | Kullanım                                     |
| ------------------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `salad.webp`       | Anna Pelzer            | [Sebzeli salata kâsesi](https://unsplash.com/photos/bowl-of-vegetable-salads-IGfIGP5ONV0)                                                                                             | Hero, süreç, hedef ve yazı önizlemesi        |
| `preparation.webp` | Maarten van den Heuvel | [Sebzelerle mutfak hazırlığı](https://unsplash.com/photos/person-slicing-green-vegetable-in-front-of-round-ceramic-plates-with-assorted-sliced-vegetables-during-daytime-EzH46XCDQRY) | Süreç, hedef ve yazı önizlemesi              |
| `fruit.webp`       | Brooke Lark            | [Dilimlenmiş meyveler](https://unsplash.com/photos/variety-of-sliced-fruits-08bOYnH_r_E)                                                                                              | Hero kolajı, süreç, hedef ve yazı önizlemesi |
| `breakfast.webp`   | Brooke Lark            | [Sebzeli yumurta tabağı](https://unsplash.com/photos/poached-egg-with-vegetables-and-tomatoes-on-blue-plate-jUPOXXRNdcA)                                                              | Süreç ve hedef kartı                         |

Dosya yolları, Türkçe alt metinler, kaynak ve fotoğrafçı bilgileri `src/content/images.ts` içinde tutulur. Statik import, Next.js'in otomatik boyut ve bulanık önizleme üretmesini sağlar. `EditorialImage`, `next/image` üzerinden responsive boyutlar sunar; hero ana görseli öncelikli, diğer görseller varsayılan lazy yüklenir. Ziyaret sırasında Unsplash'a istek yapılmaz.

## Portre ve çizimler

Stok bir kişi fotoğrafı Günay Turan olarak gösterilmez. Portre alanı kodla çizilmiş temsili bir siluet ve “Fotoğraf yakında” etiketi içerir. İzinli gerçek portre `public/images/portrait.jpg` konumuna eklendiğinde sonraki sayfa üretiminde/derlemede otomatik algılanır. Production'da yeniden derleme gerekir. Portre Türkçe alt metni ve beklenen dosya yolu da `images.ts` içindedir.

Blob, organik çerçeve, yıldız, alt çizgi ve geçici GT simgesi bu proje için SVG/CSS ile çizildi. Sosyal platform işaretleri `social-icons.tsx` içindeki özgün inline SVG eşlemeleridir; platform kimliğini belirtir, ortaklık veya onay ifade etmez. Diğer çizgi ikonları ISC lisanslı [Lucide](https://lucide.dev/license) paketindendir.

## Tipografi

[Fraunces](https://fonts.google.com/specimen/Fraunces) ve [Geist](https://fonts.google.com/specimen/Geist) Google Fonts'un [resmî font deposundan](https://github.com/google/fonts) indirildi. Lisanslar `public/fonts/OFL-fraunces.txt` ve `OFL-geist.txt` konumundadır. Üç yerel WOFF2 dosyası `next/font/local` ile sunulur; geliştirme, derleme veya ziyarette Google Fonts bağlantısı gerekmez.

FontTools 4.68.0 ve Brotli 1.2.1 ile Latin/Türkçe (`U+0020–024F`), noktalama (`U+2000–206F`) ve seçili semboller korundu. Türkçe ç/Ç, ğ/Ğ, ı/İ, ö/Ö, ş/Ş, ü/Ü karakterlerinin CMAP kayıtları tek tek doğrulandı. Fraunces normal/italik için `wght=450`, `opsz=72`, `SOFT=0`, `WONK=1` örnekleri üretildi; Geist değişken ağırlığını korur. Toplam font boyutu yaklaşık 87 KB'dir; başlangıçtaki altı alt küme yaklaşık 204 KB idi. Normal npm kurulumu için Python gerekmez.

Resmî kaynak dosyalar: `ofl/fraunces/Fraunces[SOFT,WONK,opsz,wght].ttf`, `ofl/fraunces/Fraunces-Italic[SOFT,WONK,opsz,wght].ttf`, `ofl/geist/Geist[wght].ttf`. Unicode kapsamı genişletilecekse orijinal kaynaklardan yeni WOFF2 üretip lisansları koruyun.

Kaynak doğrulama ve indirme sırasında Node fetch bağlantı zaman aşımı verdi; aynı doğrulanmış kaynaklar `curl` ile indirildi. Eksik fotoğraf yerine uydurulmuş URL veya isim kullanılmadı.
