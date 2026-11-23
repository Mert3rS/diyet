# Teknik veri ve gizlilik notları

Bu dosya mevcut teknik durum ve gelecekteki operasyon gereksinimlerini açıklar; **hukuki görüş veya KVKK uyum beyanı değildir.** Hukuk metni üretilmedi. Nihai veri akışı ve metinler hukuk danışmanı tarafından incelenmelidir.

## Mevcut durum

- Faz 1 ana sayfası vardır. Randevu formu, backend kayıtları, admin, DB, e-posta gönderimi, analytics ve cookie banner yoktur.
- Vücut analizi değerleri tarayıcı belleğinde işlenir; hesaplama veya önizleme sırasında sunucuya gönderim yapılmaz. Haricî WhatsApp aktarımı yalnızca aşağıdaki ziyaretçi eylemiyle gerçekleşir.
- Sosyal ve iletişim kayıtları örnektir. Gerçek alıcılar doğrulanana kadar CTA'lar iletişim bölümüne gider; sosyal örnekler ayrılmış `.invalid` alan adını kullanır.
- Hosting henüz seçilmediği için proxy/CDN erişim loglarının içeriği, IP kaydı ve retention politikası doğrulanmadı. App'in veri toplamaması, altyapının hiç log tutmadığı anlamına gelmez.
- Operasyon araçları URL içine gömülü kimlik bilgisi ve sorgu içeren smoke kök adresini reddeder. Sır taraması değerleri yazdırmaz. Raporlar `.reports/` içinde Git dışında tutulur; paylaşmadan önce incelenmelidir.

## Vücut analizi ve ziyaretçinin WhatsApp aktarımı

Bu bölüm teknik açıklamadır, hukuki görüş değildir. Araç cinsiyet, yaş, boy, kilo; isteğe bağlı boyun/bel/kalça, ad, hizmet tercihi ve hamilelik/emzirme seçimini component belleğinde işler. VKİ ve yağ oranı aralığı da burada türetilir. Veriler fetch/XHR/beacon ile uygulama sunucusuna yollanmaz; DB, analytics, hata kaydı, local/sessionStorage, cookie veya **site URL'sine** yazılmaz. Sayfa yenileme/kapatma ile state kaybolur. Tarayıcı/cihazın kendi işleyişine dair veri saklamama garantisi verilmez.

Ziyaretçi “Mesajı gözden geçir” adımında içeriği düzenler/siler. Hamilelik satırı da silinebilir. Boş başlayan sabit onay kutusu işaretlenmeden WhatsApp açılmaz; metni değiştirmek onayı kaldırır. Ziyaretçi gönder düğmesini seçtiğinde mesaj `encodeURIComponent` ile **haricî `https://wa.me/...?...` URL'sine** eklenir ve WhatsApp'a aktarılır. Mesajın URL'de yer alması WhatsApp/cihaz/tarayıcı geçmişi gibi haricî bağlamları etkileyebilir. Sitede saklanmaması, haricî sağlayıcının veya alıcının saklamadığı anlamına gelmez. WhatsApp içinde son gönderimi de ziyaretçi yapar. Kopyalama ayrıca ziyaretçinin eylemiyle cihaz panosuna yazar; bu bir sunucu aktarımı değildir.

**Yayın engeli / hukuk incelemesi:** Boy/kilo, vücut tahmini ve hamilelik bilgisi sağlıkla ilişkili kişisel veri olabilir. Kliniğin mesajı almasıyla oluşan KVKK yükümlülükleri, işleme amacı/dayanağı, aydınlatma/onay metni, uluslararası aktarım ve WhatsApp sağlayıcısı ayrıca hukuk danışmanı tarafından incelenmelidir. Buradaki teknik onay kutusu hukuki uyum beyanı değildir. Gerçek KVKK sayfası yoktur; arayüz “yakında” gösterir. Onaylı telefon, uzman yöntem/metin incelemesi ve hukuk değerlendirmesi olmadan production anahtarı açılmamalı.

## Faz 4 için planlanan talep formu

Planlanan talep formu henüz uygulanmadı. Uygulanırsa yalnızca ad/soyad, gerekli iletişim bilgisi, iletişim/zaman tercihi, genel konu ve kısa not alınmalı; sağlık bilgileri için alan açılmamalı. Consent sürümü/zamanı, admin erişimi ve production'da gerçek KVKK metni olmadan formun kapalı kalması ayrı test edilmelidir.

Varsayılan planlanan uygulama saklama süresi 180 gündür; bu süre uygulanmış değildir. Randevu silme job'ı mevcut değil. Yedek için operasyon hedefi 30 gündür; seçilen DB/PITR/medya sisteminin gerçek süresi doğrulanmalıdır. Uygulamadan silinen kayıt, daha önce alınmış yedeklerde pencere sonuna kadar kalabilir; tipik plan hedefi en fazla 30 ek gündür, gerçek sağlayıcı/PITR ayarı bunu belirler. Restore sonrası süresi dolmuş kayıtların yeniden silinmesi ve suppression kaydının nasıl tutulacağı hukuk/teknik incelemeye dahildir.

## Hukuk danışmanına sorulacaklar

1. Gerçek form alanları, serbest not alanında istenmeyen sağlık verisi riski, işleme amacı/dayanağı ve aydınlatma/onay akışı.
2. Hosting, DB, e-posta, izleme ve yedek bölgeleri; üçüncü taraf erişimi ve aktarım koşulları.
3. Uygulama/yedek/PITR/log saklama süreleri, silme talepleri ve geri yükleme sonrası tekrar silme yöntemi.
4. Teknik destek erişimi, yetki kayıtları ve gerçek izleme/analitik kurulursa consent gereksinimleri.

Production loglarına form gövdesi, ad, telefon veya e-posta gönderilmemeli. E-posta konusu yalnızca nötr başlık ve iç kayıt ID'si içermeli. Bu kontroller ilgili özellikler kurulmadığından henüz production'da test edilmiş değildir.
