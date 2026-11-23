# Türkçe yönetim kılavuzu

Geliştirme paneli **http://localhost:3001/admin** adresindedir; ayrı port kullanmaz. İlk hesap ve şifre `.reports/admin-credentials.txt` dosyasındadır. İlk girişte profilinizden şifrenizi değiştirin. Bu dosya ve `.env.cms.*` Git'e eklenmez. Şifre sıfırlama e-postası henüz etkin değildir.

## Görsel düzenleyici

Panelin ana sayfasındaki **Ana sayfayı görerek düzenle** düğmesini veya sol menüdeki **Görsel düzenleyici** bağlantısını açın: `/admin/visual-editor`.

1. Önizlemede değiştirmek istediğiniz yazıya ya da fotoğrafa tıklayın. Seçili alan çerçeveyle belirtilir; sağdaki düzenleme alanı açılır. Bölüm ve alan listelerinden de seçim yapabilirsiniz.
2. Metni yazarken değişiklik gerçek sayfa yerleşiminde görünür. Masaüstü ve Mobil düğmeleriyle iki görünümü inceleyin. Soru yanıtı seçildiğinde ilgili soru açılır; yorum seçildiğinde o yorum gösterilir.
3. Fotoğrafı kütüphaneden seçin veya görsel açıklamasını doldurup yeni dosya yükleyin. Yükleme kütüphaneye hemen eklenir; sayfadaki fotoğraf değişimi kaydedene kadar yayınlanmaz. Aynı fotoğraf alanını paylaşan bölümler birlikte güncellenir.
4. **Bu alandaki değişikliği geri al**, seçili alanı son kaydedilmiş haline döndürür. **Değişiklikleri kaydet**, değişen metinleri ve fotoğraf seçimlerini sitede yayınlar. Kaydetmeden önce yaptığınız değişiklikler ziyaretçilere görünmez.

Başka sekmede içerik güncellendiyse düzenleyici o güncellemenin üzerine yazmaz; taslağı koruyarak haber verir. Liste satırı ekleme, kaldırma, sıralama, görünürlük ve bağlantı ayarları için mevcut **Ana sayfa**, **Site ayarları** ve **Vücut analizi ayarları** formlarını kullanın. Görsel düzenleyici yönetici girişi gerektirir.

## Site ayarları

- **Marka ve düğmeler:** isim, isim altı yazı, açıklama, randevu düğmesi, footer metinleri.
- **İletişim:** doğrulanmış telefon, e-posta, adres, çalışma saatleri ve başlangıç WhatsApp mesajı. Gerçek bilgileri girdikten sonra “İletişim bilgileri örnektir” işaretini kaldırın. Yönetici hesabının e-postası buraya otomatik aktarılmaz.
- **WhatsApp ve Instagram:** bu iki hesabın kart açıklamalarını ve görünürlüğünü yönetin. Telefon iletişim sekmesinden alınır; Instagram için HTTPS profil adresini girin ve “adres örnektir” işaretini kaldırın. Ayarlar sağ alt düğmeler, hakkımda, iletişim kartları ve footer'a birlikte uygulanır. Randevu düğmeleri iletişim akışını kullanmaya devam eder.
- **Fotoğraflar:** portre ve dört yemek fotoğrafını seçin. Önce “Görseller” bölümünden yükleyebilir veya alandan yeni kayıt açabilirsiniz. Alt metni doldurun. Portre boşsa kişi fotoğrafı yerine mevcut yer tutucu gösterilir.
- **Menü:** bağlantıları sürükleyerek sıralayın, metinlerini değiştirin veya gizleyin.

## Ana sayfa

Sekmelerde bölüm başlıklarını, biyografiyi, hizmetleri, süreç adımlarını, hedefleri, paketleri, yorumları, blog kartlarını ve SSS'yi düzenleyin. Liste satırları eklenebilir, kaldırılabilir ve sıralanabilir. Hizmetlerin kimliklerini hedef eşleşmeleriyle uyumlu tutun. İsim için ana kaynak Site ayarlarıdır. Tüm gerçek metinleri onayladıktan sonra “Bu sayfa örnek içerik içeriyor” işaretini kaldırın. Bu işlem tek başına yayın onayı değildir.

**Kaydet** sonrasında yeni bir site sekmesi açın veya sayfayı yenileyin. Yeniden Docker build gerekmez. Paneldeki değişiklikler mevcut veritabanına yazılır; geliştirme ve üretim ayrı veritabanlarıdır. İlk kurulum verileri sonraki açılışlarda düzenlemelerinizi ezmez.

## Vücut analizi ayarları

Aracı açıp kapatabilir, başlık ve düğmeleri değiştirebilir, en fazla sekiz hizmet belirleyebilir ve isteğe bağlı çevre ölçülerini gizleyebilirsiniz. Üretimde ilk kurulumda kapalıdır. Hizmet kimliklerini koruyun ve tek varsayılan seçin.

Mesaj şablonu yalnız `{ad}`, `{cinsiyet}`, `{yas}`, `{boy}`, `{kilo}`, `{vki}`, `{yag_orani}`, `{hizmet}` alanlarını kabul eder. Açıklayıcı cümleyi ve cm/kg birimlerini koruyun. “Örnek değerlerle önizleme” gerçek ziyaretçi verisi kullanmaz. “Şablonu varsayılana sıfırla” ardından Kaydet ile uygulanır. Özel numara boşsa onaylı genel numara kullanılır.

Formüller, yaş sınırı, tahmini aralık etiketi, uyarı ve onay metni panelden değiştirilemez. Ölçümler veritabanına kaydedilmez; mesaj ancak ziyaretçinin kendi eylemiyle WhatsApp'a açılır. Gerçek numara, uzman/hukuk incelemesi ve gizlilik metni tamamlandıktan sonra aracı yayın için etkinleştirin.

## Hesaplar ve görseller

Yeni yöneticiyi yalnız mevcut yönetici oluşturabilir; açık kayıt yoktur. Son hesap silinemez. Görseller JPEG/PNG/WebP/AVIF ve en fazla 8 MB olmalıdır; SVG kabul edilmez. Kullanılan bir görseli silmeden önce ilgili alanlardan kaldırın. Volume silmek içerik ve fotoğrafları kaybettirir; [Docker kılavuzuna](docker.md) bakın.
