# Alan adı, DNS, TLS ve e-posta — OWNER ACTION

**Durum: DNS ve hosting seçimi bekleniyor. Hiçbir DNS kaydı değiştirilmedi.** Hedef canonical adres kullanıcı tarafından verilen `https://gunayturan.com.tr` (apex) adresidir. www ve HTTP yönlendirmeleri henüz yapılandırılmadı; sağlayıcı doğrulandıktan sonra kalıcı yönlendirmeyle bu köke bağlanmalı.

23 Kasım 2026'da doğrulanan kaynaklar: [TRABİS açılış duyurusu](https://www.trabis.gov.tr/content/Acilis), [TRABİS güncel SSS](https://www.trabis.gov.tr/FAQ) ve [kayıt kuruluşları](https://www.trabis.gov.tr/page/2). Duyuru .com.tr için belgesiz tahsis sürecini açıklar; bu alan adının müsaitliğini, sahipliğini veya özel tahsis koşullarını bu çalışma doğrulamadı. Seçilecek kayıt kuruluşundan teyit alın. Kayıt ya da ödeme yapılmadı.

## Hazırlık sırası

1. **OWNER ACTION:** Alan adı sahibini ve mevcut kayıt kuruluşunu kendi hesabınızdan kontrol edin. Kayıt e-postası, kurtarma erişimi ve yenileme tarihini parola kasasına/takvime kaydedin.
2. **OWNER ACTION:** DNS sağlayıcısını belirleyin; mevcut zone'u dışa aktarın. MX/TXT gibi mevcut e-posta kayıtlarını silmeyin.
3. Önce uygulamayı staging'de doğrulayın. Hosting panelinin gösterdiği alan adı doğrulama ve yönlendirme belgelerini bu dosyaya tarihleriyle ekleyin.
4. **OWNER ACTION:** Aşağıdaki tablonun değerlerini sağlayıcının panelinden doldurun. Boş hücreler canlı DNS talimatı değildir; tahmini IP/CNAME kullanmayın.

| Ad                            | Olası tür                                              | Gerçek hedef/değer | Durum                        |
| ----------------------------- | ------------------------------------------------------ | ------------------ | ---------------------------- |
| `@`                           | Hosting'in desteklediği A/AAAA veya apex alias yöntemi | Belirlenmedi       | Hosting kararı bekliyor      |
| `www`                         | Hosting'in istediği CNAME veya A/AAAA                  | Belirlenmedi       | Hosting kararı bekliyor      |
| Panelin verdiği doğrulama adı | TXT/CNAME                                              | Belirlenmedi       | Panel talimatı bekliyor      |
| E-posta doğrulaması           | SPF TXT / DKIM TXT-CNAME / DMARC TXT                   | Belirlenmedi       | E-posta sağlayıcısı bekliyor |

5. **OWNER ACTION:** Sağlayıcının onayladığı TTL ve kayıt değerleriyle değişikliği yapın. Zone dışa aktarımını ve önceki değerleri geri dönüş kaydı olarak koruyun.
6. **OWNER ACTION:** Hosting üzerinde apex ve www için sertifika üretimini tamamlayın. Otomatik yenileme desteği ve başarısızlık uyarısının nereye gideceği sağlayıcı belgesinden doğrulanmalı.
7. **OWNER ACTION:** HTTP→HTTPS ve www→apex için 301/308 yönlendirmelerini sağlayıcının desteklediği katmanda kurun. Uygulama, CDN ve proxy arasında döngü oluşturmayın. HSTS'yi kullanılan tüm alt alanlarda HTTPS doğrulanmadan açmayın; preload başvurusu yapılmadı.
8. TLS doğrulandıktan sonra `npm run smoke -- https://gunayturan.com.tr` çalıştırın. Bu aşama kullanıcıya açık alana istek yapar; mevcut çalışmada production'a çalıştırılmadı.

## Kontrol komutları

PowerShell:

```powershell
Resolve-DnsName gunayturan.com.tr -Type A
Resolve-DnsName gunayturan.com.tr -Type AAAA
Resolve-DnsName www.gunayturan.com.tr -Type CNAME
curl.exe -I https://gunayturan.com.tr
curl.exe -I http://gunayturan.com.tr
curl.exe -I https://www.gunayturan.com.tr
```

Her kayıt türünün mutlaka bulunması gerekmez; seçilen hosting'in beklediği cevapla karşılaştırın. Tarayıcıda sertifika alan adını, geçerlilik tarihini, HTTPS uyarısı olmadığını ve son adresin apex olduğunu kontrol edin. Beklenen yönlendirme/TLS başarısızsa indekslemeyi açmayın.

## E-posta teslimi

**OWNER ACTION:** Sağlayıcı seçilip domain doğrulama paneli açılmadan SPF/DKIM/DMARC değerleri bilinmez. Bu belgede kayıt değeri uydurulmadı. Sağlayıcının gerçek değerlerini kopyalayın, mevcut SPF politikasını ikinci bağımsız SPF kaydı oluşturmadan değerlendirin ve DMARC politikasını alan adını kullanan diğer göndericilerle birlikte planlayın.

Önce kişisel veri içermeyen bir test gönderin; alıcıda ham başlıklardan SPF/DKIM/DMARC sonucunu ve From alanını kontrol edin. Gerçek randevu formu/e-posta adapteri henüz bulunmadığı için uygulama teslim testi yapılmadı. Bildirim başlığına ad, telefon veya e-posta koymayın.
