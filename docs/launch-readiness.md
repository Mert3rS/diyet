# Yayın hazırlığı

23 Kasım 2026: Docker'da çalışan site ve Türkçe Payload admin vardır. Geliştirme site/panel `localhost:3001` ve `/admin`; üretim imajının yerel önizlemesi 3002 kullanır. PostgreSQL, medya volume'ü, açık migration, ilk yönetici, içerik kaydetme ve yetki denetimi uygulanmıştır. Ayrıntılar [admin kılavuzu](admin-guide-tr.md) ve [doğrulama raporunda](verification.md).

**Canlı yayın kararı: NO-GO.** gunayturan.com.tr için DNS/TLS/sunucu kurulmadı. İçerik ve hesaplar örnektir; marka sahibinin gerçek portresi, unvanı, metinleri ve adresleri bekleniyor. Yönetici hesabı oluşturulması bu bilgilerin onaylandığı anlamına gelmez.

Blog/tarif ayrıntı sayfaları, KVKK/çerez metinleri, randevu kayıt/consent akışı ve e-posta servisi mevcut değildir. Şifre kurtarma maili kapalıdır. Şifreli dış yedekleme ve bağımsız restore provası yapılmadı. İndeksleme kapalı; analiz aracı üretim DB'sinde ilk kurulumda kapalıdır.

`launch:audit` mevcut dosya/route ve örnek işaret denetimidir; CMS'nin canlı kayıtlarını inceleyen adapter henüz bağlanmadığından fail-closed davranır. Gerçek içeriklerin panelde düzenlenmesi bu denetleyiciyi otomatik tamamlamaz. Eski kaynak örnekleri ilk kurulum için depoda durur; bunları silmek yerine canlı DB kayıt denetimi eklenmelidir.

Hosting/izleme/mail/bölge/bütçe kararları `ops/decisions.json` içinde hâlâ bekler. Yerel PostgreSQL seçimi, canlı sağlayıcı kararı değildir. Docker imajı ve GitHub CI, bir production deploy veya yayın onayı anlamına gelmez.
