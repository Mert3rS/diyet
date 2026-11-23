import type { BodyAnalysisSettings } from "@/lib/body-analysis/types";

// Sabit güvenlik metinleri ayar sözleşmesine dahil değildir; CMS bunları değiştiremez.
export const DISCLAIMER =
  "Bu değer bir tahmindir; sağlık durumunu değerlendirmez ve uzman görüşünün yerini tutmaz. Hamilelik, yoğun spor, kas kütlesi ve bazı sağlık durumlarında sapabilir.";
export const CONSENT =
  "Bu bilgileri diyetisyene WhatsApp ile göndermeyi kabul ediyorum.";
export const PRIVACY_NOTICE =
  "Bilgileriniz sitemizde saklanmaz; yalnızca sizin onayınızla WhatsApp üzerinden iletilir.";
export const UNDERAGE_NOTE =
  "Bu araç 18 yaş ve üzeri içindir. Görüşmek istersen iletişim seçeneklerinden bize ulaşabilirsin.";
export const UNRELIABLE_NOTE =
  "Bu değerler için hesaplama güvenilir değil. Ölçülerini kontrol edebilir veya tahmin eklemeden diyetisyene iletebilirsin.";
export const analysisCopy = {
  heroLink: "Vücut analizini dene",
  eyebrow: "Kendine bir alan aç",
  loading: "Vücut analizi hazırlanıyor…",
  deferred: "Analiz aracı bu bölüme yaklaştığında yüklenir.",
  noscript:
    "Vücut analizi için JavaScript gereklidir. İletişim seçeneklerinden bize ulaşabilirsin.",
  rangeLabel: "tahmini aralık",
  summaryLabel: "Tahmini aralık",
  summaryEmpty: "Ölçülerinden başlayalım",
  resultLabel: "Analiz sonucu",
  resultEyebrow: "Bir sayıdan fazlasısın",
  resultTitle: "Bir başlangıç noktası.",
  emptyTitle: "Bedeninin hikâyesi sana özel.",
  emptyResult:
    "Yaş, boy ve kilo ile başlayabilirsin. Bu araç bir tanı veya kişisel beslenme planı sunmaz.",
  initialAnnouncement: "Ölçülerini girdiğinde tahmini aralık burada görünür.",
  rangeAnnouncement: "Tahmini yağ oranı aralığı",
  bmiLabel: "Vücut kitle indeksi (VKİ)",
  standardError: "Standart tahmin hatası",
  percentagePoints: "yüzde puan",
  methodTitle: "Nasıl hesaplanıyor?",
  methodParagraphs: [
    "Çevre ölçüleri tamamlandığında US Navy, diğer durumlarda yetişkinler için Deurenberg yöntemi kullanılır. VKİ, kilogram cinsinden kilonun metre cinsinden boyun karesine bölünmesidir.",
    "Aralık, hesaplanan değerin etrafına araştırmada bildirilen standart tahmin hatası eklenip uçlar dışa doğru tam sayıya yuvarlanarak hazırlanır. Deurenberg: ±4,1; Navy erkek: ±3,52; Navy kadın: ±3,72 yüzde puan. Bu aralık kişiye özel bir güven aralığı veya garanti değildir; gerçek sapma daha büyük olabilir.",
    "Navy araştırmaları 18–56 yaşında 602 erkek ve 18–44 yaşında 214 kadın askerle yapılmıştır. Farklı yaşlarda, yoğun sporda, yüksek kas kütlesinde ve bazı sağlık durumlarında temsil gücü sınırlıdır. Evde ölçüm hataları da sonucu etkiler. Hamilelik ve emzirmede tahmin gösterilmez.",
  ],
  sourceLabel: "Kaynaklar",
  templateErrors: {
    length: "Şablon 1–800 karakter olmalı.",
    plain: "Şablonda yalnızca düz metin kullanılabilir.",
    unknown: "Geçersiz alan",
    braces: "Süslü parantezleri ve alan adlarını kontrol et.",
    sentence:
      "Şablona alan adlarından bağımsız en az bir açıklayıcı cümle ekle.",
  },
  sources: [
    {
      label: "Deurenberg ve arkadaşları, 1991",
      url: "https://research.vu.nl/en/publications/body-mass-index-as-a-measure-of-body-fatness-age-and-sex-specific/",
    },
    {
      label: "Hodgdon–Beckett, 1984 · erkek",
      url: "https://archive.org/details/DTIC_ADA143890",
    },
    {
      label: "Hodgdon–Beckett, 1984 · kadın",
      url: "https://archive.org/details/DTIC_ADA146456",
    },
  ],
  formStep: "Ölçülerinle başlayalım",
  localNote: "Ölçüler yalnızca bu tarayıcının belleğinde işlenir.",
  sex: "Cinsiyet",
  choose: "Seçiniz",
  female: "Kadın",
  male: "Erkek",
  optional: "İsteğe bağlı",
  pregnancy: "Hamileyim veya emziriyorum",
  measuresTitle: "Daha doğru sonuç için ölçülerini ekle",
  measuresNote:
    "Mezura yere paralel olsun; cildini sıkıştırmasın. Ölçüm yeri ve uygulama sonucu etkiler.",
  hints: {
    neck: "Başın dikken, gırtlağın hemen altından; mezurayı sıkmadan ölç.",
    hip: "Kalçanın en geniş yerinden, mezura yere paralel olacak şekilde ölç.",
    femaleWaist: "Belin en dar yerinden, nefesini tutmadan ölç.",
    maleWaist: "Göbek deliği hizasından, nefesini tutmadan ölç.",
  },
  name: "Adın",
  namePlaceholder: "Sana nasıl hitap edelim?",
  service: "İlgilendiğin hizmet",
  formNote:
    "18–80 yaş için bilgilendirme amaçlı tahmin. Sayfayı kapattığında girişlerin kaybolur.",
  prepare: "Mesajı gözden geçir",
  devPhoneWarning:
    "Geliştirme önizlemesi: numara girilmedi. WhatsApp gönderimi kapalı.",
  phoneWarning:
    "WhatsApp iletişimi şu an kullanılamıyor. Diğer iletişim seçeneklerinden ulaşabilirsin.",
  contactPending:
    "Telefon ve e-posta bilgileri onay bekliyor; bağlantılar iletişim bölümüne gider.",
  call: "Telefonla ara",
  email: "E-posta ile ulaş",
  previewStep: "Mesajın, senin kontrolünde",
  previewTitle: "Oku, düzenle, sonra karar ver.",
  previewNote:
    "İstemediğin satırları silebilirsin. WhatsApp açıldığında mesajı göndermeyi orada da sen seçersin.",
  previewLabel: "WhatsApp mesaj önizlemesi",
  shortened:
    "Bağlantı uzunluğunu sınırlamak için bazı isteğe bağlı satırlar çıkarıldı. Mesajı kontrol edebilirsin.",
  tooLong:
    "Mesaj bağlantı için çok uzun. Göndermek için metni kısaltabilir veya kopyalayabilirsin.",
  policy: "KVKK Aydınlatma Metni",
  policyPending: "KVKK Aydınlatma Metni: yakında.",
  copy: "Mesajı kopyala",
  copied: "Mesaj kopyalandı.",
  copyFallback: "Mesaj seçildi. Cihazının kopyalama komutunu kullanabilirsin.",
  consentPending: "Göndermeden önce mesajı okuyup onay kutusunu işaretle.",
  recipientPending: "Gönderim için doğrulanmış WhatsApp numarası bekleniyor.",
  ready: "Mesajı WhatsApp'ta açabilirsin.",
  errors: {
    underage: "Bu araç 18 yaş ve üzeri içindir.",
    sex: "Lütfen bir seçenek seç.",
    age: "Yaşı 18–80 arasında tam sayı olarak yaz.",
    height: "Boyu 120–220 cm arasında yaz.",
    weight: "Kiloyu 30–250 kg arasında yaz.",
    invalid: "İşaretli alanları kontrol edebilir misin?",
    circumference: "Çevre ölçüsünü 0'dan büyük, en fazla 300 cm olarak yaz.",
    inconsistent:
      "Bel ölçüsü boyun ölçüsünden büyük olmalı. Ölçüm yerlerini kontrol et.",
  },
  pregnancyNote:
    "Hamilelik ve emzirme döneminde bu tahmin uygulanmaz. Günay Turan sana kişisel görüşmede rehberlik edebilir.",
  navyNote: "Çevre ölçülerinle US Navy yöntemi kullanıldı.",
  deurenbergNote:
    "Çevre ölçüleri tamamlanmadığı için yaş, boy ve kiloya dayanan Deurenberg yöntemi kullanıldı.",
  messageMeasures: { neck: "Boyun", waist: "Bel", hip: "Kalça" },
  circumference: "çevresi",
  fieldInfo: {
    age: { label: "Yaş", unit: "yıl", placeholder: "Örn. 30" },
    height: { label: "Boy (cm)", unit: "cm", placeholder: "Örn. 170" },
    weight: { label: "Kilo (kg)", unit: "kg", placeholder: "Örn. 65,5" },
    neck: { label: "Boyun çevresi (cm)", unit: "cm", placeholder: "Örn. 34" },
    waist: { label: "Bel çevresi (cm)", unit: "cm", placeholder: "Örn. 75" },
    hip: { label: "Kalça çevresi (cm)", unit: "cm", placeholder: "Örn. 95" },
  },
} as const;

export const DEFAULT_MESSAGE_TEMPLATE = `Merhaba, web sitenizden ulaşıyorum. {hizmet} hakkında bilgi ve fiyat almak istiyorum.
Adım: {ad}

Bilgilerim:
- Cinsiyet: {cinsiyet}
- Yaş: {yas}
- Boy: {boy} cm
- Kilo: {kilo} kg
- VKİ: {vki}
- Tahmini yağ oranı: {yag_orani}

Müsait olduğunuzda fiyat ve süreç hakkında bilgi verir misiniz? Teşekkürler.`;

// CMS yoktur. Üretimde açılması, onaylı telefon ve metin incelemesinden sonra ayrı bir karardır.
export function defaultBodyAnalysisSettings(
  production: boolean,
): BodyAnalysisSettings {
  return {
    enabled: !production,
    title: "Vücut analizi",
    subtitle: "Bedenine merakla yaklaş.",
    description:
      "Birkaç ölçüyle tahmini bir aralık gör. İstersen bilgilerini gözden geçirip Günay Turan'a danışmanlık ve fiyat sormak için ilet.",
    calculateLabel: "Analizi hesapla",
    sendLabel: "WhatsApp'ta gönder",
    services: [
      { id: "fiyat", label: "Fiyat bilgisi", isDefault: true },
      { id: "bireysel", label: "Kişiye özel danışmanlık", isDefault: false },
      { id: "online", label: "Online danışmanlık", isDefault: false },
      { id: "sporcu", label: "Sporcu beslenmesi", isDefault: false },
      { id: "gebelik", label: "Gebelik ve emzirme dönemi", isDefault: false },
      { id: "cocuk", label: "Çocuk ve ergen beslenmesi", isDefault: false },
    ],
    fields: { neck: true, waist: true, hip: true },
    messageTemplate: DEFAULT_MESSAGE_TEMPLATE,
    includeBmi: true,
    includeFat: true,
    whatsappOverride: "",
  };
}
