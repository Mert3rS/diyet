# Günay Turan — vücut analizi düzenleme kılavuzu

Şu anda Payload ve yönetim paneli yoktur. `/admin` üzerinden düzenleme yapılamaz. Bu dosya mevcut kaynak düzenlemesini ve Faz 2'de açılacak alanları ayırır; çalışan panel varmış gibi yönerge vermez.

## Bugün geliştiriciyle düzenleme

1. `src/content/body-analysis.ts` içindeki `defaultBodyAnalysisSettings()` nesnesinde başlık, alt başlık, açıklama ve düğme etiketlerini düzenleyin. Düz metin kullanın. Sınırlar: 60/100/300 ve düğmeler için 40 karakter. `analysisCopy` içindeki güvenlik metinlerini değiştirmeyin.
2. `services` listesinde hizmet kimliklerini koruyarak etiketleri ve sırayı değiştirin; en fazla 8 hizmet ve bir varsayılan bırakın. Hedef kartları `bireysel`, `sporcu`, `gebelik` ile eşleşir. `metabolik`, kişiye özel danışmanlığa eşlenir; bulunmayan hizmet varsayılana döner.
3. `fields` içinde çevre ölçülerini gösterip gizleyebilirsiniz. Gerekli çevre ölçülerinden biri gizliyse araç Deurenberg yöntemine döner. Bu anahtarlar yaş/boy/kilo sınırlarını değiştirmez.
4. `DEFAULT_MESSAGE_TEMPLATE` en fazla 800 karakter olmalı. İzinli alanlar yalnız `{ad}`, `{cinsiyet}`, `{yas}`, `{boy}`, `{kilo}`, `{vki}`, `{yag_orani}`, `{hizmet}`. Boy/kilo satırlarında cm/kg birimlerini koruyun. Bir satırın alanı boşsa satır atlanır. Açıklayıcı bir cümle bırakın; HTML, yeni alan veya vaat eklemeyin. Sıfırlamak için Git'teki varsayılan metne dönün. Hazır panel sıfırlama düğmesi henüz yoktur.
5. `includeBmi` ve `includeFat` yalnız mesajdaki satırları etkiler; hesabı değiştirmez. Çevre ölçüleri ve hamilelik satırı varsa ayrıca eklenir. Ziyaretçi hepsini önizlemede silebilir.
6. Sadece sahibi tarafından doğrulanmış WhatsApp numarasını `whatsappOverride` alanına ya da genel fallback için `src/config/site.ts` içindeki `bodyAnalysisWhatsapp` alanına ekleyin. Boş override, onaylı ana iletişim kaydını; o yoksa site fallback'ini kullanır. Türkçe 10 hane / başında 0 olan 11 hane +90'a çevrilir; uluslararası numarada ülke kodu kullanılmalıdır. Biçim doğrulaması sahiplik veya çalışan WhatsApp hesabı doğrulaması değildir. Belgelerde gerçek numara uydurulmamıştır.
7. `npm run dev` ile ana sayfada “Vücut analizini dene” bağlantısını seçin. Ölçüleri girin, hesaplayın, mesajı gözden geçirin. Varsayılan boş onayı, değişiklik sonrası onayın kalkmasını ve hamilelik/18 yaş altı durumlarını deneyin. Mesajı gerçek alıcıyla yalnız sahibinin denemesi sırasında açın.
8. `npm run check`, `npm run build` ve Playwright testlerini çalıştırın. Production varsayılanı `enabled: !production` ile kapalıdır. Uzman/hukuk incelemesi, onaylı alıcı ve gerçek KVKK sayfası tamamlandıktan sonra geliştirici bunu açıkça değiştirip yeniden derlemelidir. Bu anahtar diğer yayın NO-GO maddelerini kaldırmaz.

## Faz 2'de panelde sunulacak adımlar

Oturum açma ve Global kurulduktan sonra “Vücut Analizi Ayarları” altında aynı sınırlı metin/hizmet/alan/mesaj seçenekleri sunulacak. Kaydetme sonrası revalidation, “Örnek değerlerle önizleme”, “Sıfırla”, yetkisiz yazmayı reddetme ve boş DB davranışı o fazda uygulanacak. Şimdilik bu işlemler mevcut değildir.

Formüller, hata payları, minimum yaş, tahmini aralık etiketi, uyarı, onay kutusu ve gizlilik bildirimi panelde düzenlenmeyecek. Sağlık iddiası, tüketim hedefi veya kilo kategorisi oluşturacak metinler yayınlanmamalı. Teknik kurallar tek başına hukuk/mesleki inceleme yerine geçmez.
