# Yayın öncesi kontrol listesi

Hedef alan adı: **https://gunayturan.com.tr**. Bu liste tamamlanmadan örnek içerikle public yayın yapılmamalıdır. Faz 1 önizlemesi indekse kapalıdır; `noindex` erişim kontrolü değildir.

## Kimlik ve içerik

- [ ] Günay Turan'ın mesleki unvanını doğrula. Şu anki `Dyt.` ve biyografi örnektir; “Unvan onay bekliyor” notunu yalnızca doğrulamadan sonra kaldır.
- [ ] Biyografi, yaklaşım, slogan ve tüm bölüm metinlerini sahibinin onayladığı metinlerle değiştir.
- [ ] Altı hizmetin gerçekten sunulduğunu, kapsamını ve uygun ifadelerini doğrula.
- [ ] Süreç adımlarını, online/yüz yüze seçeneklerini ve görüşme kapsamını doğrula.
- [ ] Üç örnek paketi gerçek kapsam ve fiyat iletişim yöntemiyle değiştir.
- [ ] “En çok tercih edilen” örnek etiketini kaldır veya yalnızca doğrulanabilir gerçek bilgi varsa yeniden değerlendir.
- [ ] Baş harfli dört örnek yorumu kaldır. Gerçek yorum eklenirse izin ve doğruluk kontrolünü tamamla; sağlık sonucu/önce-sonra anlatısı ekleme.
- [ ] Okuma süreleri dahil tüm örnek sayıları gerçek içerikle doğrula. Sayısal başarı iddiası ekleme.
- [ ] Blog kartları için gerçek yazılar hazır değilse “Yakında” ve bağlantısız davranışı koru.

## İletişim ve sosyal hesaplar

- [ ] `+90 5XX XXX XX XX` yerine doğrulanmış telefon numarasını ekle.
- [ ] `info@gunayturan.com.tr` adresinin varlığını, sahipliğini ve mesaj kabul ettiğini doğrula.
- [ ] Örnek Mahallesi/Örnek Şehir adresini gerçek ve yayın izni bulunan adresle değiştir.
- [ ] Örnek çalışma saatlerini gerçek saatlerle değiştir.
- [ ] `example.invalid` sosyal bağlantılarının tamamını kaldır; platform hesabının Günay Turan'a ait olduğunu doğrula.
- [ ] Sosyal hesapların sıra, görünürlük ve boş liste durumlarını doğrula.
- [ ] Onaylı iletişim kaydında `isMock: false` kullan; `getContactLinks()` çıktısını gerçek `wa.me`, `tel:` ve `mailto:` alıcılarıyla kontrol et.
- [ ] Hedef seçiminin hazırladığı mesajı gerçek numaraya bağlı WhatsApp akışında doğrula; otomatik gönderim olmamalı.
- [ ] Mobil sabit çubuk, header CTA ve yüzen WhatsApp bağlantısının doğru kanala gittiğini kontrol et.

## Görsel, hesaplayıcı ve hukuk metinleri

- [ ] Günay Turan'ın izinli portresini `public/images/portrait.jpg` konumuna ekle ve yeniden derle.
- [ ] Örnek stok fotoğraflarını onayla veya izinli gerçek varlıklarla değiştir; kaynak ve Türkçe alt metinleri güncelle.
- [ ] Vücut analizi formüllerini, hata paylarını, sınırlı örneklemlerini ve bilgilendirme notunu uzman incelemesinden geçir. Araç kişisel plan veya tüketim hedefi sunmaz.
- [ ] Aracı açmadan önce mesaj şablonunu ve uyarı metnini kontrol et; gerçek telefon sahipliğini ve WhatsApp alıcısını doğrula. Production'da varsayılan kapalı anahtarı yalnız inceleme tamamlandıktan sonra açıp yeniden derle.
- [ ] Ölçülerin tarayıcıda kaldığını ve yalnız ziyaretçinin düzenleyip onayladığı haricî WhatsApp URL'sine aktarıldığını hukuk danışmanına incelet. Boy/kilo/hamilelik sağlıkla ilişkili veri olabilir; mesajı alan kliniğin KVKK yükümlülükleri de değerlendirilmelidir. Bu teknik açıklamadır, hukuki görüş değildir.
- [ ] Boş onay, mesaj düzenleme sonrası onayın kalkması, 18 yaş altı engeli, hamilelikte tahmin olmaması, hatalı ölçü ve numarasız durumları kontrol et. Açık araçla gerçek cihazda WhatsApp akışını sahibiyle dene.
- [ ] Gerçek veri akışına uygun KVKK/gizlilik metnini hazırlat; şu anki “Yakında” etiketine uydurma hukuk metni ekleme.
- [ ] Gerçekte kullanılan çerez/depolama/üçüncü taraf araçlarını tespit edip çerez metnini buna göre hazırla. Faz 1'de analytics, takip çerezi ve kullanıcı verisi saklama yoktur.

## Teknik yayın

- [ ] `ops/decisions.json` içindeki bekleyen sağlayıcı/bütçe/tarih kararlarını tamamla; sır ekleme.
- [ ] `npm run env:check`, `npm run test:ops`, `npm run secrets:audit` ve build sonrası `npm run launch:audit` çalıştır. NO-GO varken yayın yapma.
- [ ] Gerçek CMS içerik denetimini bağla; mevcut audit'in yalnızca kaynak/build kontrolleri yaptığını unutma.
- [ ] Şifreli DB + medya yedeğini temiz staging hedefinde geri yükleyip admin/içerik/medya ile kanıtla.
- [ ] [Yayın günü](launch-day-runbook.md) ve [işletim](ops-runbook.md) sırasını uygula; staging/production smoke sonuçlarını kaydet.
- [ ] İndekslemeyi yalnızca kullanıcı açıkça “indexlemeyi aç” derse veya sahibi panelden manuel açarsa değiştir; bu hazırlıkta kapalı kaldı.

- [ ] `USE_MOCK_CONTENT` bayrağını kapat ve onaylı içerik kaynağını bağla. Şu anda kapatılması bilinçli olarak “İçerik hazırlanıyor” ekranı ve boş sosyal liste verir.
- [ ] Gerçek içerik bağlı olmadan örnek etiketlerini kaldırma. Development rozetinin production'da gizlenmesi içeriği gerçek yapmaz.
- [ ] `SITE_URL=https://gunayturan.com.tr` ayarla; HTTPS, DNS ve barındırma kararını tamamla.
- [ ] `npm ci`, `npm run check`, `npm run build` ve `npm run test:e2e` çalıştır.
- [ ] 320, 390, 768 ve 1440 px; klavye, azaltılmış hareket ve dokunma davranışlarını kontrol et.
- [ ] Gerçek production adresinde Lighthouse mobil ölçümünü tekrarla; yerel laboratuvar puanı saha performansı değildir.
- [ ] Canonical, sitemap, robots ve paylaşım görsellerini gerçek içerikle hazırla; `noindex` politikasını ancak yayın kararıyla değiştir.
- [ ] Randevu talebi kaydı ile kesinleşmiş randevuyu ayır. Faz 1'de kayıt, ödeme ve danışan paneli yoktur.

Faz 2 talebi alındı; Node/Payload uyumluluğu ve eksik altyapı nedeniyle kurulmadı. Bu kontrol listesi backend'in hazır olduğu veya yayın onayı verildiği anlamına gelmez.
