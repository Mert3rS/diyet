# Yayın günü sırası — henüz uygulanmadı

**NO-GO:** Faz 2–4 ve sağlayıcılar tamamlanmadı. Bu belge ileride yapılacak işlerin sırasıdır. Gerçek DNS, deploy, e-posta, geri yükleme veya indeksleme işlemi yapılmadı. Alan adı sahipliği/müsaitliği doğrulanmadı.

1. **OWNER ACTION:** [Hesaplar/bütçe](costs-and-accounts.md) kararlarını tamamlayın; hosting, DB, storage, email, analytics/none, DNS, monitoring, bütçe ve tarih alanlarını `ops/decisions.json` içinde kaydedin. Sırları buraya yazmayın.
2. Node uyumluluğunu düzeltin; Payload, PostgreSQL, admin ve gerçek içerik/form altyapısını ilgili fazlarında uygulayıp test edin. Gerçek KVKK/gizlilik metinleri olmadan production formu açılmamalı.
3. Sağlayıcı seçilince resmî Next.js/Payload/Node desteği, build/start komutları, disk/pool limitleri, migration, backup/PITR ve rollback özelliklerini tarihleriyle doğrulayın. Çelişki varsa bu noktada durun.
4. İçeriği dondurun; örnek kayıtların listesini çıkarın. Kullanım izinli portre/görselleri ve gerçek iletişim/sosyal hesaplarını doğrulayın. Hukuk metni yazmayın; sahibinin onaylı metnini CMS'ye girin.
5. Gerçek yayın içeriğini bağlayın. Örnek silme script'i henüz yoktur; geliştirildiğinde önce dry-run ve açık onayla yalnızca `isSample` kayıtlarını silmelidir. Mevcut kaynak dosyalarını veya gerçek kayıtları topluca silmeyin. Örnek etiketini silmek, örnek veriyi gerçeğe dönüştürmez.
6. **OWNER ACTION:** Production sırlarını üretin/döndürün; `SITE_URL=https://gunayturan.com.tr` değerini build ve runtime'a girin. `npm run env:check` çalıştırın. Development sırlarını kullanmayın.
7. `npm ci`, `npm run check`, `npm run test:ops`, `npm run secrets:audit`, `npm run build` ve `npm run launch:audit` çalıştırın. Audit NO-GO veriyorsa ilerlemeyin. CMS denetleyicisi henüz bağlı olmadığından araç şu an bilinçli olarak yayın onayı vermez.
8. Şifreli son DB/medya yedeğini doğrulayın. Temiz staging DB'ye restore edin; admin, yayın içerikleri ve medya testlerini geçirin. Prova yapılmadan yedeği yeterli saymayın.
9. Staging'de yeni uygulama/migration'ı doğrulayın. Form teslimi ve gerçek bildirim e-postası için sahibin izin verdiği test verisini kullanın. Log/analytics/URL/konu satırında kişisel veri bulunmadığını kontrol edin. Cookie/analytics özelliği yoksa varmış gibi test sonucu yazmayın.
10. Sağlayıcı kararı sonrası eklenecek deploy pipeline'ında önce geriye uyumlu migration, sonra sağlık kontrolü, sonra trafik geçişi uygulayın. Önceki release'i ve yedek referansını kaydedin.
11. **OWNER ACTION:** [DNS kılavuzuyla](domain-dns-runbook.md) alan adını bağlayın, TLS ve yenileme davranışını doğrulayın. HTTP/www yönlendirmelerini test edin. HSTS'yi HTTPS tüm kullanılan alt alanlarda doğrulanmadan açmayın.
12. `npm run smoke -- https://gunayturan.com.tr --post /blog/gercek-slug --recipe /tarifler/gercek-slug` çalıştırın; komuttaki slug'ları gerçek yayın kayıtlarıyla değiştirin. Script form göndermez; form/e-posta ve admin işlemleri ayrıca elle uçtan uca denenmelidir. Mobil/masaüstü Lighthouse, klavye, gerçek cihaz ve yapılandırılmış veri kontrollerini staging/production üzerinde yapın.
13. Örnek içerik kalmadığını, erişim/retention/backup job'larını ve alert alıcılarını son kez doğrulayın. Başarısızlıkta trafik geçişini durdurup rollback planını uygulayın.
14. **İndeksleme kapalı kalır.** “Siteyi arama motorlarına aç” ayarı henüz yoktur. Kurulduktan sonra ancak kullanıcı bu repo görevinde açıkça **“indexlemeyi aç”** derse veya site sahibi runbook'u izleyerek panelden kendisi açarsa değiştirilebilir. Bu çalışma `noindex` ayarını değiştirmedi.
15. **OWNER ACTION:** İndeksleme açıldıktan sonra Google Search Console ve Bing Webmaster Tools'ta alan adını sahibin hesabına ekleyin. Araçların verdiği gerçek DNS TXT doğrulamasını DNS paneline girin; kayıt değeri uydurmayın. Doğrulama sonrası gerçek sitemap adresini gönderin ve kapsam/hata raporlarını kontrol edin. Bu kayıtlar/hesaplar oluşturulmadı.
16. **OWNER ACTION:** Google Business Profile varsa onaylı marka, adres, telefon ve URL'yi siteyle tutarlı tutun. Gerçek bilgiler doğrulanmadan profil alanlarını doldurmayın.

## İlk 7 gün

Her gün sorumlu kişi uptime, hata kodları, form teslimleri ve e-posta durumları, DB/medya yedeği, cleanup job son başarısı, sertifika ve Search Console hatalarını kontrol eder. Raporlarda danışan bilgileri yer almaz. Alarm eşikleri ve sorumlu kişi seçilmediği için bu nöbet planı henüz aktif değildir.

## 30 gün sonra

Maliyet/aşım, gerçek cihaz performansı, erişilebilirlik, kırık bağlantı, yedek geri yükleme, sır/erişim izinleri, retention ve içerik güncelliğini gözden geçirin. Takvimli randevu, ödeme, danışan paneli, bülten, çok dilli içerik, A/B ve içerik takvimi yalnızca sonraki kapsam adaylarıdır; bu çalışmada eklenmedi.
