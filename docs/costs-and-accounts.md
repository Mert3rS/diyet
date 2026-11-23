# Hesaplar, maliyetler ve bekleyen kararlar

Kontrol tarihi: **23 Kasım 2026**. Kullanıcı ücretsiz ilk yayın istedi: **Render Free + Supabase Free** seçildi. Kullanıcının Supabase hesabı var; Render hesabı ve her iki hizmetin bu projeye bağlantıları bekleniyor. Ücretli işlem yapılmadı. [Kurulum ve kota bilgileri](render-supabase.md) hazırdır; gerçek deploy sonucu henüz yoktur. Ücretsiz kotaların aşılması veya sürekli açık çalışma gereksinimi için ücretli plan ayrıca değerlendirilir.

Kararların makinece okunur kaydı `ops/decisions.json` dosyasındadır. `null` “karar bekliyor” demektir; sır veya hesap parolası bu dosyaya yazılmaz. Analytics istenmiyorsa kullanıcı kararıyla `none` yazılabilir; kod bunu kendiliğinden seçmez.

| Kalem                   | Durum                                    | Aylık maliyet                     | Sahip/yenileme   |
| ----------------------- | ---------------------------------------- | --------------------------------- | ---------------- |
| Node uygulama hosting'i | Render Free; hesap bağlantısı bekliyor   | $0 plan; uyuma/kota sınırları var | Kullanıcı hesabı |
| Managed PostgreSQL      | Supabase Free; proje bağlantısı bekliyor | $0 plan; 500 MB                   | Kullanıcı hesabı |
| Medya depolama          | Supabase Storage; bucket bekliyor        | Free kotasında 1 GB               | Kullanıcı hesabı |
| E-posta                 | Karar bekliyor                           | Gönderim kotası doğrulanmadı      | OWNER ACTION     |
| Analitik                | Sağlayıcı veya `none` kararı bekliyor    | Doğrulanmadı                      | OWNER ACTION     |
| Registrar ve DNS        | Karar/sahiplik doğrulaması bekliyor      | Domain yenileme bedeli bilinmiyor | OWNER ACTION     |
| Hata/uptime izleme      | Karar bekliyor                           | Saklama/uyarı planı doğrulanmadı  | OWNER ACTION     |
| Bütçe üst sınırı        | Kullanıcı ücretsiz başlangıç seçti       | 0; ücretli kaynak açılmaz         | Kullanıcı kararı |
| Yayın tarihi            | Belirtilmedi                             | —                                 | OWNER ACTION     |

## Seçeneklerin farkları

- Uzun yaşayan managed Node: süreç ve restart yönetimi daha kolay olabilir; seçilen planın Node 24, persistent disk ve rollback özellikleri doğrulanmalı.
- VPS/container: disk, süreç ve ağ kontrolü daha fazladır; patch, TLS, yedek, izleme ve nöbet sorumluluğu ekibe aittir.
- Serverless Next.js: otomatik ölçeklenebilir; kalıcı medya için haricî object storage, DB bağlantı pool'u ve migration/revalidation koordinasyonu gerekir. Destek ve limitler sağlayıcı seçilmeden varsayılamaz.
- DB'de yönetilen yedek/PITR operasyonu azaltabilir; sürüm, restore süresi, export ve retention seçilen plana göre teyit edilmeli. Kendi dump job'ı şifreleme/rotasyon/restore sorumluluğunu size bırakır.
- Medyada object storage ile kalıcı sunucu diski farklı kurtarma modelleri gerektirir; ephemeral disk uygun kalıcı yükleme hedefi değildir.
- E-postada SMTP adapteri taşınabilirlik, HTTP API adapteri sağlayıcıya özgü hata/teslim raporları sunabilir. Bunların hiçbiri kurulmadı; geliştirme console adapteri production bildirimi sayılmaz.
- Analitik tamamen kapalı kalabilir. Açılacaksa consent ve kişisel veri göndermeme akışı staging'de doğrulanmalı. İzleme için managed hizmet ile self-hosted araçların bakım/erişim/retention sorumlulukları farklıdır.

## OWNER ACTION — hesap güvenliği ve takvim

1. Hesap sahipliği Günay Turan'ın kontrolündeki hesaplarda olsun. Teknik destek için ayrı, sınırlı yetkili kullanıcı açın.
2. Güvenilen ikinci kişinin kurtarma erişimini sahibin onayıyla belirleyin; kurtarma kodlarını parola kasasında tutun. Kişisel parolayı geliştiriciye vermeyin.
3. Domain yenileme tarihi, ücretli plan yenilemeleri, manuel sertifika varsa bitiş tarihi ve yedek anahtarı kurtarma provasını takvime kaydedin. Bu çalışma takvim bildirimi oluşturmadı.
4. Aylık bütçe tavanını ve aşım uyarısını kararlaştırın; ücretsiz planı production için yeterli varsaymayın.
5. Seçilen her hizmet için resmî destek/ücret/backup bağlantılarını ekleyin. Henüz seçilmeyen sağlayıcının özelliği doğrulanmış sayılmaz.
