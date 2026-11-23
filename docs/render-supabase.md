# GitHub'dan ücretsiz tam sürüm yayını

Bu kurulum GitHub'daki `main` dalını Render'da bir Node web servisi olarak çalıştırır. PostgreSQL ve fotoğraflar Supabase'de kalır. `/admin` ve görsel düzenleyici aynı sitede çalışır. GitHub Pages sunucu çalıştırmadığı için bu uygulamanın yayın hedefi değildir.

[Render'da kurulumu aç](https://render.com/deploy?repo=https://github.com/Mert3rS/diyet)

## 1. Supabase hazırlığı

1. [Supabase hesabında](https://supabase.com/dashboard) bu siteye özel, **Free** bir proje açın. Render servisinin Frankfurt bölgesine yakın bir bölge seçin. Veritabanı şifresini hesabınızın güvenli alanında saklayın.
2. Projenin **Connect → Session pooler** bağlantısını alın. IPv4 destekli, `5432` portlu bağlantıyı kullanın; `6543` transaction pooler adresini kullanmayın. Bağlantıdaki şifreyi URL biçimine uygun kodlayın. Bu değer Render'da `DATABASE_URI` olacak; GitHub'a veya sohbete yazılmaz.
3. **Storage → New bucket** ile `site-media` adında, **private** bir bucket oluşturun. İzin verilen dosyalar `image/jpeg`, `image/png`, `image/webp`, `image/avif`; boyut sınırı en az 8 MB olmalı. Herkese yükleme izni vermeyin.
4. Storage'ın **S3 configuration** bölümünden endpoint, region, Access Key ID ve Secret Access Key oluşturun. Anahtarlar sadece Render'ın sunucu ortamına girilir. `anon` veya `publishable` API anahtarı, S3 anahtarı değildir.

Uygulama açılırken sürümlü migration'lar ve ilk içerik kurulumu çalışır. Payload tablolarında RLS açılır; Supabase Data API üzerinden bu tablolara anonim erişim verilmez. Uygulama tablo sahibi PostgreSQL hesabıyla bağlanır. Supabase Auth kullanıcısı oluşturmanız gerekmez; admin oturumunu Payload yönetir.

## 2. Render servisini oluşturma

1. [Render](https://dashboard.render.com/) hesabını GitHub ile açın ve `Mert3rS/diyet` deposuna erişim verin.
2. Yukarıdaki kurulum bağlantısını veya **New → Blueprint** ekranını kullanın. Depodaki `render.yaml` otomatik olarak **Free**, Node 24.22.3, Frankfurt ve `/api/health` ayarlarını seçer. Ücretli servis, Render PostgreSQL veya persistent disk eklemeyin.
3. Kurulumda aşağıdaki alanları doldurun:

| Render değişkeni       | Değerin kaynağı                           |
| ---------------------- | ----------------------------------------- |
| `CMS_ADMIN_EMAIL`      | İlk yönetici için kendi e-posta adresiniz |
| `DATABASE_URI`         | Supabase Session pooler bağlantısı        |
| `S3_ENDPOINT`          | Supabase S3 configuration endpoint'i      |
| `S3_REGION`            | Aynı ekrandaki region                     |
| `S3_ACCESS_KEY_ID`     | Supabase S3 Access Key ID                 |
| `S3_SECRET_ACCESS_KEY` | Supabase S3 Secret Access Key             |

`S3_BUCKET=site-media`, `MEDIA_STORAGE=s3` ve diğer ayarlar dosyada hazırdır. `PAYLOAD_SECRET` ile `CMS_ADMIN_PASSWORD` Render tarafından rastgele oluşturulur. İlk yayında `SITE_URL` eklemeyin; uygulama Render'ın kendi HTTPS adresini kullanır.

4. **Apply / Deploy** ile yayını başlatın. Build ve ilk kurulum tamamlanınca Render'ın verdiği gerçek `https://….onrender.com` adresini açın. Servisin ismine bakarak URL tahmin etmeyin.
5. Aynı adresin `/api/health` yolu `{"status":"ok"}` döndürmeli. `/admin` üzerinden `CMS_ADMIN_EMAIL` ve Render **Environment** ekranındaki oluşturulmuş `CMS_ADMIN_PASSWORD` ile giriş yapın. Bu canlı hesabın şifresi yerel geliştirme hesabıyla aynı değildir. İlk girişten sonra profilinizden şifreyi değiştirin; başlangıç betiği mevcut hesabın şifresini ezmez.
6. **Görsel düzenleyici** içinde bir metin ve fotoğraf değiştirip kaydedin. Yeni sekmede sonucu doğrulayın. Yeniden deploy sonrasında aynı içeriklerin ve görsellerin kaldığını da kontrol edin.

GitHub CI kontrolleri geçtikten sonra `main` dalındaki değişiklikler Render'a otomatik yayınlanır. İlk Blueprint kurulumu ayrıca deploy başlatır. Migration başarısız olursa sunucu başlamaz; `push:false` korunur ve şema kendiliğinden değiştirilmez.

## 3. GitHub Pages ve alan adı

Çalışan adres doğrulandıktan sonra GitHub deposunun **Settings → Pages** bölümünden README yayınını kapatın. Bu işlem depoyu veya Render servisini silmez. README'ye gerçek Render adresi eklenebilir.

`gunayturan.com.tr` alan adı bağlanacağı zaman Render'ın Custom Domains ekranından gerçek DNS kayıtlarını alın; DNS'i ayarladıktan ve HTTPS çalıştıktan sonra `SITE_URL=https://gunayturan.com.tr` ekleyin. Render adresi admin ve önizleme için izinli origin olarak korunur.

## Ücretsiz planın sınırları

Kontrol tarihi: 23 Kasım 2026. [Render Free](https://render.com/docs/free) boşta 15 dakika sonra uyur; ilk istek yaklaşık bir dakika bekleyebilir. Yerel dosyalar uyuma veya yeniden deploy sırasında silinebildiğinden yüklemeler Supabase'e gider. Render ücretsiz planını üretim uygulamaları için önermiyor; bu kurulum ücretsiz bir ilk yayın/deneme içindir.

[Supabase Free](https://supabase.com/pricing) 500 MB veritabanı ve 1 GB dosya alanı içerir; bir hafta hareketsizlikte proje duraklatılabilir. Sağlayıcı kotaları ve hesap durumları panelden izlenmelidir. Sürekli açık işletme sitesi ve yedekleme gereksinimi için ücretli plan ayrı bir karardır; bu yapılandırma ücretli kaynak oluşturmaz.

Sunucuya kopyalanmış mevcut bir yerel veritabanı veya fotoğraf arşivi yoktur. Yeni boş proje ilk örnek içeriklerle kurulur; gerçek içerikler panelden düzenlenir. İletişim ve unvan onayları, hukuk metinleri ve e-posta ile şifre kurtarma ayrıca tamamlanmalıdır.

Kaynaklar: [Render Blueprint](https://render.com/docs/blueprint-spec), [Render Next.js](https://render.com/docs/deploy-nextjs-app), [Supabase PostgreSQL bağlantıları](https://supabase.com/docs/guides/database/connecting-to-postgres), [Supabase S3 anahtarları](https://supabase.com/docs/guides/storage/s3/authentication).
