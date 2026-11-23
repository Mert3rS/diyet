# Yedekleme, geri yükleme ve migration

**Durum: yapılandırılmadı ve geri yükleme testi yapılmadı.** Payload/DB/medya yükleme altyapısı yoktur. Docker CLI bulunsa da daemon çalışmıyor; `psql` ve `pg_dump` PATH'te bulunamadı. Bu belge bir plan ve kontrollü prova kılavuzudur; çalışır bir yedekleme sistemi olduğu anlamına gelmez.

## Karar verilecekler

1. **OWNER ACTION:** PostgreSQL sağlayıcısından sürümü, bağlantı/pool sınırını, günlük yedekleri, PITR penceresini, saklama süresini ve restore prosedürünü resmî belgesiyle doğrulayın.
2. Varsayılan operasyon hedefi: günlük DB yedeği, **30 gün** saklama; gerçek ayar sağlayıcıyla doğrulanacak. Şifreli, erişimi sınırlı ve app sunucusunun dışında bir hedef seçilmeden yedekleme hazır sayılmaz. Sağlayıcı, bölge ve anahtar kurtarma yöntemi seçim bekliyor.
3. Medya için object storage sürümleme/retention veya kalıcı diskten şifreli dış hedefe senkronizasyon seçin. DB yedeği fotoğrafları içermez; birbiriyle uyumlu DB + medya noktası gerekir.
4. Saklama silmeleri ve yedeklerde kalacak eski kişisel veriler [privacy-notes.md](privacy-notes.md) kapsamında hukuk incelemesine alınmalı.

[Payload production belgesi](https://payloadcms.com/docs/production/deployment), yüklemeler için kalıcı disk veya uygun depolama adapteri gerektirir. Geçici/serverless diski tek medya deposu yapmayın. [PostgreSQL SQL dump](https://www.postgresql.org/docs/current/backup-dump.html) ve [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html) resmî kaynakları kontrol edildi. Bu kaynaklardaki güncel sürüm, henüz seçilmemiş DB için otomatik sürüm seçimi değildir.

## Temiz staging/local geri yükleme provası

Yalnızca güvenilir yedek ve production'dan tamamen ayrı, boş bir hedef kullanın. Mevcut DB'yi düşürmeyin. Bağlantıları `pg_service.conf` ve izinleri kısıtlı parola dosyasında tanımlayın; parolayı komut satırına/URI argümanına koymayın. `gunay_source` ve `gunay_restore_test` burada yerel servis takma adlarıdır; gerçek hesap/DNS bilgisi değildir.

```text
pg_dump --dbname=service=gunay_source --format=custom --no-owner --no-privileges --file=backup.dump
pg_restore --list backup.dump
pg_restore --dbname=service=gunay_restore_test --no-owner --no-privileges --exit-on-error --single-transaction backup.dump
```

`gunay_restore_test` önceden boş ve yalnızca test için oluşturulmuş olmalıdır. Kaynak/hedef sürümlerini ve istemci uyumluluğunu doğrulayın. Dump kendi başına şifreli değildir; bu komut, şifrelenmemiş dosyayı dış hedefe yükleme talimatı değildir. Sağlayıcı yedeği veya seçilen şifreleme aracı doğrulanınca otomatik dump/şifreleme/rotasyon job'ı uygulanmalı. Şifreleme aracı ve scheduler seçilmediği için doğrulanmamış bir otomatik job eklenmedi.

Prova tamamlandığında kaydedilecek kanıtlar:

- Yedek zamanı, checksum, kaynak ve hedef PostgreSQL sürümü; parola/bağlantı URI'si yazılmaz.
- Ayrı test uygulamasında admin girişi, yayınlı içerik sayıları, sosyal sıra, medya okunması ve randevu kayıt erişim kuralları.
- Test ortamında gerçek alıcılara e-posta ve analitik gönderiminin kapalı olması.
- Geri yükleme süresi, uygulama sürümü ve `smoke` sonucu; test DB/medyanın güvenli imhası için sorumlu.

## Migration ve rollback

[Payload migrations](https://payloadcms.com/docs/database/migrations) belgesi doğrulandı. CMS kurulunca development schema push ile explicit migration akışını karıştırmayın. Şemadan üretilen ve incelenen migration dosyalarını commit edin. Henüz `payload` script'i/config/migration bulunmadığı için bu depoda migrate komutu eklenmiş veya çalıştırılmış değildir.

Güvenli sıralama: doğrulanmış yedek → staging restore → yeni sürümle migration provası → eski/yeni uygulama uyumluluğu kontrolü → production yedeği → incelemiş migration → yeni sürüm sağlık kontrolü → trafik geçişi. Tercih edilen şema değişimi önce geriye uyumlu ekleme, sonraki sürümde temizlemedir.

Uygulama rollback'i veritabanını otomatik geri almaz. Şema geriye uyumluysa önceki uygulama sürümünü yeniden etkinleştirin. Değilse yazmaları durdurup yeni kayıtların kaybı riskini değerlendirin; temiz hedefe restore edip veri uzlaştırma planı olmadan eski yedeği production üzerine yazmayın. `down` migration veri kaybı yaratabiliyorsa otomatik çalıştırmayın. Sağlayıcının gerçek release/rollback komutları ve staging süresi karar sonrası doldurulacak; dakikalar içinde geri dönüş henüz doğrulanmadı.

`npm run cleanup:requests` henüz mevcut değildir. Faz 4 tamamlanınca varsayılan 180 gün uygulama saklama politikasını kullanan job, seçilecek scheduler'a bağlanmalı. Son başarı zamanı ve silinen kayıt sayısı raporlanmalı; kayıt içeriği loglanmamalı.
