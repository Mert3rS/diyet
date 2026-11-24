import type {
  BlogPreview,
  ContactSettings,
  Faq,
  Goal,
  Package,
  ProcessStep,
  Service,
  SocialLink,
  Testimonial,
  MockRecord,
} from "@/types/content";

// Spor odaklı ana sayfa için tek örnek içerik kaynağı. Sayısal sonuç iddiası içermez.
export const sportsSlides = [
  {
    isMock: true,
    service: "sporcu",
    kicker: "SPORCU BESLENMESİ",
    first: "Oyununun",
    accent: "bir parçası.",
    description:
      "Antrenmandan günlük yaşama. Beslenmeyi senin ritmin, branşın ve ihtiyaçlarınla birlikte düşünelim.",
    visual: "running",
    label: "Antrenman ritmi",
  },
  {
    isMock: true,
    service: "bireysel",
    kicker: "BİREYSEL BESLENME",
    first: "Senin hayatın.",
    accent: "Senin dengen.",
    description:
      "Sevdiğin tatlara ve günlük alışkanlıklarına yer açan, birlikte şekillenen bir beslenme yaklaşımı.",
    visual: "food",
    label: "Günlük denge",
  },
  {
    isMock: true,
    service: "takim",
    kicker: "KULÜPLER VE TAKIMLAR",
    first: "Aynı sahada,",
    accent: "birlikte.",
    description:
      "Takımın antrenman, seyahat ve sezon akışında beslenme üzerine ortak bir dil kuralım.",
    visual: "track",
    label: "Takımın ritmi",
  },
  {
    isMock: true,
    service: "kurumsal",
    kicker: "KURUMSAL VE ETKİNLİK",
    first: "Bilgiyi paylaş.",
    accent: "Alan aç.",
    description:
      "Beslenme okuryazarlığını gündelik hayatla buluşturan, katılıma açık eğitim ve buluşmalar.",
    visual: "kitchen",
    label: "Birlikte öğrenmek",
  },
] as const;

export const sportsServices = [
  {
    isMock: true,
    slug: "sporcu",
    title: "Sporcu Beslenmesi Danışmanlığı",
    tag: "ANTRENMANDAN GÜNLÜK YAŞAMA",
    description:
      "Branşın, antrenman düzenin ve gündelik hayatın odağında bir görüşme süreci.",
    icon: "activity",
    scope: [
      "Sezon ve antrenman düzenini birlikte tanıma",
      "Maç günü öğün düzenini ele alma",
      "Kamp ve seyahat dönemlerine hazırlık",
      "Toparlanma alışkanlıklarını değerlendirme",
      "Sıvı tüketimi farkındalığı",
      "Takviye kullanımının gerekliliğini değerlendirme",
      "Besin etiketi okuma çalışmaları",
      "Vejetaryen ve vegan tercihleri konuşma",
    ],
    note: "İlk görüşmede spor geçmişin, günlük düzenin ve beklentilerin üzerinden birlikte geçeriz.",
  },
  {
    isMock: true,
    slug: "bireysel",
    title: "Bireysel Beslenme Danışmanlığı",
    tag: "HAYATINA UYAN BİR YAKLAŞIM",
    description:
      "Hazır kalıplar yerine; tercihlerini, zamanını ve günlük ritmini konuşalım.",
    icon: "utensils",
    scope: [
      "Günlük öğün düzenini tanıma",
      "Besin tercihlerini ve alışkanlıkları konuşma",
      "Alışveriş ve mutfak rutinine bakış",
      "Dışarıda yemek seçeneklerini değerlendirme",
      "Çalışma düzenine uygun planlama",
      "Beslenme okuryazarlığı çalışmaları",
      "Günlük hareketle ilişkiyi ele alma",
      "Görüşme sıklığını birlikte belirleme",
    ],
    note: "İlk görüşme tanışmaya ve ihtiyaçlarını anlamaya ayrılır; hazır bir listeyle başlamayız.",
  },
  {
    isMock: true,
    slug: "takim",
    title: "Spor Kulüpleri ve Takımlar için Danışmanlık",
    tag: "ORTAK HEDEF, ORTAK DİL",
    description:
      "Sporcular, teknik ekip ve mutfak ekibi arasında beslenme iletişimine alan açalım.",
    icon: "users",
    scope: [
      "Takımın sezon akışını tanıma",
      "Kamp dönemi öğün organizasyonu",
      "Seyahat koşullarını değerlendirme",
      "Maç günü seçeneklerini ele alma",
      "Mutfak ekibiyle iletişim",
      "Altyapı için yaşa uygun eğitim planı",
      "Sporcu ve veli bilgilendirme buluşmaları",
      "Eğitim materyallerini birlikte tasarlama",
    ],
    note: "İlk görüşmede ekip yapısı, çalışma kapsamı ve iletişim biçimi netleştirilir.",
  },
  {
    isMock: true,
    slug: "kurumsal",
    title: "Kurumsal ve Etkinlik Danışmanlığı",
    tag: "MERAKTAN FARKINDALIĞA",
    description:
      "Gündelik sorulara yer veren, anlaşılır ve katılımcı beslenme buluşmaları.",
    icon: "mic",
    scope: [
      "Katılımcı ihtiyaçlarını dinleme",
      "Seminer içeriğini birlikte belirleme",
      "Besin etiketi okuma atölyesi",
      "İş yerinde öğün düzenini konuşma",
      "Etkinlik menüsüne genel bakış",
      "Soru ve paylaşım oturumları",
      "Çevrim içi eğitim seçenekleri",
      "Eğitim sonrasında kaynak paylaşımı",
    ],
    note: "İlk görüşmede konu, hedef kitle ve etkinliğin formatı birlikte belirlenir.",
  },
] as const;

export const sportsAudiences = [
  {
    isMock: true,
    title: "Profesyonel sporcu",
    subtitle: "Sezonun her ritminde.",
    description:
      "Antrenman, kamp ve maç takviminle birlikte şekillenen bir görüşme süreci.",
    service: "sporcu",
    icon: "trophy",
    message: "Profesyonel sporcu beslenmesi hakkında bilgi almak istiyorum.",
  },
  {
    isMock: true,
    title: "Altyapı sporcusu",
    subtitle: "7–18 yaş · aileyle birlikte",
    description:
      "Yaşa, günlük yaşama ve spor deneyimine uygun görüşme kapsamını aileyle birlikte konuşalım.",
    service: "takim",
    icon: "sprout",
    message:
      "Altyapı sporcularına yönelik danışmanlık hakkında bilgi almak istiyorum.",
  },
  {
    isMock: true,
    title: "Amatör ve yeni başlayan",
    subtitle: "Kendi başlangıç çizginde.",
    description:
      "Spora ayırdığın alanı, beslenme alışkanlıklarınla birlikte değerlendirelim.",
    service: "sporcu",
    icon: "footprints",
    message:
      "Spora yeni başlayanlar için danışmanlık hakkında bilgi almak istiyorum.",
  },
  {
    isMock: true,
    title: "Sağlık ve yaşam hedefleri",
    subtitle: "Hayatına alan aç.",
    description:
      "Tercihlerini ve günlük düzenini gözeten bir yaklaşımı birlikte düşünelim.",
    service: "bireysel",
    icon: "heart",
    message: "Bireysel beslenme danışmanlığı hakkında bilgi almak istiyorum.",
  },
] as const;

export const sportsMethod = [
  {
    isMock: true,
    title: "Anlama",
    word: "Önce seni dinliyoruz.",
    description:
      "Günlük hayatın, sporla ilişkin, tercihlerin ve soruların. Başlangıç noktamız her zaman senin hikâyen.",
    label: "SENİN HİKÂYEN",
  },
  {
    isMock: true,
    title: "Çözüm bulma",
    word: "Hayatında yer bulan bir yol.",
    description:
      "Seçenekleri birlikte değerlendirir, uygulanabilir bir yaklaşımı senin koşulların içinde düşünürüz.",
    label: "ORTAK BİR YOL",
  },
  {
    isMock: true,
    title: "Süreklilik",
    word: "Ritmin değişir. Yol da değişir.",
    description:
      "Antrenman takvimin, iş düzenin ve gündelik hayatın değiştiğinde süreci yeniden ele alırız.",
    label: "KENDİ RİTMİNDE",
  },
  {
    isMock: true,
    title: "İletişim",
    word: "Sorularına her zaman alan var.",
    description:
      "Görüşme sıklığını, iletişim kanallarını ve sürecin sınırlarını başlangıçta birlikte netleştiririz.",
    label: "AÇIK İLETİŞİM",
  },
] as const;

export const sportsEvents = [
  {
    isMock: true,
    type: "SEMİNER",
    title: "Spor ve beslenme üzerine bir buluşma",
    date: "Örnek · Tarih belirlenecek",
    icon: "mic",
  },
  {
    isMock: true,
    type: "PANEL",
    title: "Gündelik hayatta beslenme okuryazarlığı",
    date: "Örnek · Tarih belirlenecek",
    icon: "messages",
  },
  {
    isMock: true,
    type: "KULÜP EĞİTİMİ",
    title: "Altyapıda ortak bir beslenme dili",
    date: "Örnek · Tarih belirlenecek",
    icon: "users",
  },
] as const;

export const sportsRecipes = [
  {
    isMock: true,
    title: "Renkli nohut kâsesi",
    description: "Yeşillikler ve nohutla sofraya renkli bir ara.",
    category: "Ana yemek",
    time: "Örnek · 20 dk",
    image: "salad",
  },
  {
    isMock: true,
    title: "Sebzeli açık tabak",
    description: "Mevsimin sebzeleriyle sade bir mutfak fikri.",
    category: "Ana yemek",
    time: "Örnek · 25 dk",
    image: "breakfast",
  },
  {
    isMock: true,
    title: "Meyveli yoğurt kâsesi",
    description: "Taze meyvelerle kolay bir hazırlık fikri.",
    category: "Tatlı",
    time: "Örnek · 10 dk",
    image: "fruit",
  },
  {
    isMock: true,
    title: "Mutfaktan küçük atıştırmalıklar",
    description: "Elindeki malzemelerle yeni eşleşmeler.",
    category: "Tuzlu",
    time: "Örnek · 15 dk",
    image: "preparation",
  },
  {
    isMock: true,
    title: "Meyveyle küçük bir mola",
    description: "Mevsim meyvelerini bir araya getiren bir tabak.",
    category: "Tatlı",
    time: "Örnek · 10 dk",
    image: "fruit",
  },
  {
    isMock: true,
    title: "Yeşillikli mutfak tabağı",
    description: "Farklı dokularla gündelik bir sofra fikri.",
    category: "Tuzlu",
    time: "Örnek · 15 dk",
    image: "salad",
  },
] as const;

export const sportsSocialTiles = [
  {
    isMock: true,
    title: "Tabakta biraz renk.",
    topic: "MUTFAKTAN",
    image: "salad",
  },
  {
    isMock: true,
    title: "Her ritmin bir hikâyesi var.",
    topic: "HAREKETTEN NOTLAR",
    image: null,
  },
  {
    isMock: true,
    title: "Birlikte düşünelim.",
    topic: "BESLENME SOHBETLERİ",
    image: null,
  },
  {
    isMock: true,
    title: "Hazırlığın küçük keyifleri.",
    topic: "GÜNLÜK YAŞAM",
    image: "preparation",
  },
  {
    isMock: true,
    title: "Sofraya bir mola.",
    topic: "MEVSİMİN İÇİNDEN",
    image: "fruit",
  },
  { isMock: true, title: "Kendi ritminde.", topic: "BİRAZ İLHAM", image: null },
] as const;

export const sportsMedia = [
  {
    isMock: true,
    type: "VİDEO",
    title: "Antrenman gününü birlikte düşünmek",
    description: "Örnek içerik · Yayın hazırlığında",
  },
  {
    isMock: true,
    type: "PODCAST",
    title: "Beslenme üzerine gündelik sorular",
    description: "Örnek içerik · Yayın hazırlığında",
  },
  {
    isMock: true,
    type: "BLOG",
    title: "Bir öğünün etrafındaki alışkanlıklar",
    description: "Örnek yazı · Yakında",
  },
] as const;

export const sportsTestimonials = [
  {
    isMock: true,
    initials: "A. K.",
    label: "Örnek danışan yorumu",
    quote:
      "Görüşmelerde günlük düzenimi anlatabilmek ve sorularımı rahatça paylaşabilmek benim için değerliydi.",
  },
  {
    isMock: true,
    initials: "M. D.",
    label: "Örnek danışan yorumu",
    quote:
      "Antrenman programımla birlikte düşünmek ve farklı seçenekleri konuşmak süreci daha anlaşılır kıldı.",
  },
  {
    isMock: true,
    initials: "S. E.",
    label: "Örnek danışan yorumu",
    quote:
      "Sevdiğim tatlara ve alışkanlıklarıma da yer açılan bir görüşme deneyimi oldu.",
  },
] as const;

export const sportsFaqs = [
  {
    isMock: true,
    question: "İlk görüşmede neler konuşulur?",
    answer:
      "Günlük düzenin, sporla ilişkin, beslenme alışkanlıkların ve beklentilerin konuşulur. Görüşmenin kapsamı birlikte netleştirilir.",
  },
  {
    isMock: true,
    question: "Danışmanlık yalnızca profesyonel sporcular için mi?",
    answer:
      "Hayır. Amatör sporcular, spora yeni başlayanlar ve günlük beslenme alışkanlıkları üzerine konuşmak isteyenler de bilgi alabilir.",
  },
  {
    isMock: true,
    question: "Çevrim içi görüşme yapılabilir mi?",
    answer:
      "Görüşme biçimi ve uygunluk iletişim sırasında birlikte değerlendirilir. Bu önizlemede çevrim içi randevu sistemi bulunmuyor.",
  },
  {
    isMock: true,
    question: "Altyapı sporcularının görüşmesine aile katılır mı?",
    answer:
      "Çocuk ve ergenlerle yapılacak görüşmelerin kapsamı yaşa uygun biçimde, ebeveyn veya yasal temsilciyle birlikte belirlenir.",
  },
  {
    isMock: true,
    question: "Kulüp veya kurum olarak nasıl bilgi alabiliriz?",
    answer:
      "Katılımcı profili, takvim ve beklentilerinizi paylaşarak çalışma kapsamını konuşabilirsiniz. Örnek iletişim bilgileri yayından önce doğrulanacaktır.",
  },
  {
    isMock: true,
    question: "Takviye ürün önerisi bu sitede veriliyor mu?",
    answer:
      "Hayır. Buradaki içerikler tanıtım amaçlı örnektir; kişisel değerlendirme, tıbbi öneri veya ürün tavsiyesi içermez.",
  },
  {
    isMock: true,
    question: "Görüşme sıklığı ve ücret nasıl belirlenir?",
    answer:
      "Süreç, ihtiyaçlar ve görüşme kapsamı konuşulduktan sonra netleştirilir. Bu önizlemede fiyat veya paket satışı yer almıyor.",
  },
] as const;

export const sportsDashboard = {
  isMock: true,
  rings: ["Enerji dengesi", "Sıvı dengesi", "Toparlanma"],
  timeline: [
    "Maç öncesi öğün",
    "Maç öncesi atıştırmalık",
    "Maç arası sıvı",
    "Maç sonrası toparlanma",
  ],
  chips: [
    "Günlük ritim",
    "Birlikte planlama",
    "Beslenme farkındalığı",
    "Antrenman düzeni",
  ],
} as const;
export const sportsBranches = [
  "Futbol",
  "Basketbol",
  "Voleybol",
  "Yüzme",
  "Koşu",
  "Tenis",
  "Dövüş sporları",
  "Fitness",
  "Triatlon",
  "Yelken",
] as const;

export const sportsCopy = {
  audience: {
    isMock: true,
    eyebrow: "BAŞLANGIÇ NOKTAN NERESİ?",
    title: "Herkesin ritmi",
    accent: "kendine ait.",
    description:
      "Sporun neresinde olursan ol, sana ait bir başlangıç noktası var.",
  },
  about: {
    isMock: true,
    eyebrow: "MERHABA, BEN GÜNAY.",
    title: "Önce insan.",
    accent: "Sonra plan.",
    bio: "Beslenmeyi yalnızca tabaktakilerle değil; hareketle, günlük hayatla ve kişisel tercihlerle birlikte düşünmeyi önemsiyorum. Seni dinleyerek başlayan, sorularına alan açan bir süreç üzerine çalışıyorum.",
    philosophy:
      "Bilimsel bilgiyi gündelik hayatla buluşturan; hazır kalıplardan önce senin ritmine kulak veren bir yaklaşım.",
    note: "Örnek biyografi · Yayından önce doğrulanacak.",
    credential: "Eğitim, mesleki unvan ve uzmanlık bilgileri [ONAY BEKLİYOR]",
  },
  services: {
    isMock: true,
    eyebrow: "BİRLİKTE NELER YAPABİLİRİZ?",
    title: "Sana, takımına,",
    accent: "hayatına alan.",
    description:
      "İhtiyacın nerede başlıyorsa, oradan konuşalım. Her çalışma alanının kapsamını aşağıdan keşfedebilirsin.",
  },
  events: {
    isMock: true,
    eyebrow: "BİLGİ PAYLAŞTIKÇA",
    title: "Aynı merakta",
    accent: "buluşalım.",
    description:
      "Seminerler, eğitimler ve küçük buluşmalar. Aşağıdaki etkinlikler örnektir.",
  },
  recipes: {
    isMock: true,
    eyebrow: "MUTFAKTA BİRAZ İLHAM",
    title: "Sofrana renk,",
    accent: "gününe bir mola.",
    description:
      "Kolay fikirler, tanıdık malzemeler. Örnek tarif seçkisi; ayrıntılar yakında.",
  },
  social: {
    isMock: true,
    eyebrow: "EKRANIN ÖTEKİ TARAFINDA",
    title: "Biraz hareket.",
    accent: "Biraz hayat.",
    description:
      "Mutfaktan, antrenmandan ve gündelik meraklardan küçük notlar. Tüm paylaşımlar örnektir.",
  },
  faq: {
    isMock: true,
    eyebrow: "AKLINDAKİLER",
    title: "Önce birkaç",
    accent: "soruyu konuşalım.",
    description: "Birlikte başlamadan önce merak edebileceklerin.",
  },
  contact: {
    isMock: true,
    eyebrow: "BİR MERHABA İLE BAŞLAYALIM",
    title: "Senin ritmin.",
    accent: "Bizim başlangıcımız.",
    description:
      "Sorularını paylaş, sana uygun görüşme kapsamını birlikte konuşalım.",
    note: "İletişim bilgileri örnektir. Bu önizlemede mesaj veya randevu kaydı gönderilmez.",
  },
} as const;

export const mockIdentity = {
  isMock: true,
  name: "Günay Turan",
  title: "Dyt.",
  titleStatus: "Unvan onay bekliyor",
  slogan: "İyi beslen. Kendine iyi gel.",
  bio: "Merhaba, ben Günay. Beslenmenin yalnızca tabaktakilerden ibaret olmadığına inanıyorum. Günlük ritmin, sevdiğin tatlar ve sana ait alışkanlıklarla birlikte, hayatında yer bulabilen bir denge üzerine çalışmayı önemsiyorum.",
  approach:
    "Hazır kalıplardan önce seni dinlemek. Hayatına uyan bir yol haritasını birlikte düşünmek. Ve bu yolculukta, kendi ritmine alan açmak.",
} satisfies MockRecord & Record<string, string | boolean>;
export const mockCopy = {
  hero: {
    isMock: true,
    eyebrow: "Beslenme, hareket, biraz da sen.",
    first: "İyi beslen.",
    second: "Kendine",
    accent: "iyi gel.",
    description:
      "Kalıplara değil, hayatına uyan bir beslenme yaklaşımı. Sevdiğin tatlarla, kendi ritminde, sana ait bir dengeye.",
    note: "Küçük adımlar. Sana ait bir yol.",
    primaryButton: "Birlikte başlayalım",
    introLink: "Önce biraz tanışalım",
  },
  about: {
    isMock: true,
    eyebrow: "Merhaba, ben Günay.",
    title: "Bir diyetin ötesinde,",
    accent: "sana ait bir denge.",
    portraitFirst: "Her yolculuk",
    portraitAccent: "tanışmakla başlar.",
    portraitHandwriting: "biraz ben, biraz yaklaşımım.",
  },
  services: {
    isMock: true,
    eyebrow: "Birlikte neler yapabiliriz?",
    title: "Hayatının her dönemine",
    accent: "özenle bir yaklaşım.",
    description:
      "Her ihtiyacın başlangıcı farklı. Sana uygun alanı birlikte keşfedelim.",
    linkLabel: "Birlikte konuşalım",
  },
  process: {
    isMock: true,
    eyebrow: "Adım adım, birlikte.",
    title: "Bir liste değil,",
    accent: "bir yolculuk.",
    description:
      "Seni dinleyerek başlayan, hayatına uyum sağlayarak ilerleyen bir süreç.",
  },
  goals: {
    isMock: true,
    eyebrow: "Başlangıç noktan neresi?",
    title: "Hedefini seç.",
    accent: "Kendi yolunu aç.",
    description:
      "Bir seçim yap; ilgili danışmanlığı keşfet, ilk mesajını birlikte hazırlayalım.",
  },
  packages: {
    isMock: true,
    eyebrow: "Sana uygun bir başlangıç",
    title: "Yol aynı değil.",
    accent: "Yaklaşım sana özel.",
    description: "Görüşmelerin kapsamını birlikte netleştirelim.",
  },
  testimonials: {
    isMock: true,
    eyebrow: "Birlikte yol alırken",
    title: "Her hikâyenin",
    accent: "kendine ait bir sesi var.",
  },
  blog: {
    isMock: true,
    eyebrow: "İyi yaşamdan notlar",
    title: "Biraz ilham,",
    accent: "biraz merak.",
    description:
      "Sofraya, alışkanlıklara ve gündelik hayata dair. Örnek yazı seçkisi, yakında.",
  },
  faq: {
    isMock: true,
    eyebrow: "Aklındakiler",
    title: "Önce birkaç",
    accent: "soruyu konuşalım.",
    description: "Birlikte başlamadan önce bilmek isteyebileceklerin.",
  },
  contact: {
    isMock: true,
    eyebrow: "Bir mesajla başlayabilir.",
    title: "Kendine bir",
    accent: "iyilik alanı aç.",
    description:
      "Birlikte nasıl ilerleyebileceğimizi konuşalım. Soruların için burada bir yer var.",
    socialEyebrow: "Ekranın öteki tarafında",
    socialTitle: "Biraz ilham,",
    socialAccent: "biraz günlük hayat.",
    socialDescription:
      "Sofradan, hayattan, birlikte. Sana iyi gelen paylaşımlarda buluşalım.",
  },
} as const;
export const mockContact: ContactSettings = {
  isMock: true,
  phone: "+90 5XX XXX XX XX",
  email: "info@gunayturan.com.tr",
  address: "Örnek Mahallesi, Örnek Sokak No: 00 · Örnek Şehir",
  hours: "Örnek saatler · Hafta içi 09.00–18.00",
  whatsappMessage:
    "Merhaba Günay Hanım, beslenme danışmanlığı hakkında bilgi almak istiyorum.",
};
// .invalid ayrılmış bir örnek alan adıdır; gerçek bir hesaba yönlenmez.
export const mockSocialLinks: (SocialLink & MockRecord)[] = [
  {
    isMock: true,
    platform: "instagram",
    url: "https://example.invalid/instagram",
    label: "Sofradan küçük notlar",
    visible: true,
  },
  {
    isMock: true,
    platform: "whatsapp",
    url: "https://example.invalid/whatsapp",
    label: "Bir merhaba ile başlayalım",
    visible: true,
  },
];
export const mockServices: Service[] = [
  {
    isMock: true,
    slug: "bireysel",
    title: "Kişiye özel beslenme danışmanlığı",
    description:
      "Hedeflerin, günlük akışın ve sevdiğin tatlar etrafında birlikte şekillenen bir yaklaşım.",
    icon: "leaf",
    tag: "Sana özel",
  },
  {
    isMock: true,
    slug: "online",
    title: "Online danışmanlık",
    description:
      "Nerede olursan ol, görüşmeler için hayatında rahat bir alan açabileceğin bir seçenek.",
    icon: "screen",
    tag: "Mesafelerden bağımsız",
  },
  {
    isMock: true,
    slug: "sporcu",
    title: "Sporcu beslenmesi",
    description:
      "Yaptığın sporun, antrenman ritminin ve günlük yaşamının birlikte ele alındığı danışmanlık.",
    icon: "activity",
    tag: "Hareketine eşlik etsin",
  },
  {
    isMock: true,
    slug: "gebelik",
    title: "Gebelik ve emzirme dönemi",
    description:
      "Değişen ihtiyaçların için hekim takibiyle birlikte değerlendirilen kişisel beslenme görüşmeleri.",
    icon: "flower",
    tag: "Her döneme özenle",
  },
  {
    isMock: true,
    slug: "cocuk",
    title: "Çocuk ve ergen beslenmesi",
    description:
      "Büyüme dönemini ve aile yaşamını gözeten, yaşa uygun alışkanlıklar üzerine görüşmeler.",
    icon: "sprout",
    tag: "Birlikte büyürken",
  },
  {
    isMock: true,
    slug: "metabolik",
    title: "Bağırsak ve metabolik sağlık destek planı",
    description:
      "Tanı ve tedavinin yerine geçmeden, hekim değerlendirmesiyle birlikte planlanan beslenme desteği.",
    icon: "heart",
    tag: "Bütüncül bir bakış",
  },
];
export const mockTags = [
  "Kişiye özel beslenme",
  "Günlük denge",
  "Sporcu beslenmesi",
  "Mevsiminde beslenme",
  "Online danışmanlık",
  "Sofrada çeşitlilik",
  "Yeme farkındalığı",
  "Ailede beslenme",
  "Sürdürülebilir alışkanlıklar",
  "Birlikte planlama",
  "Kendi ritminde",
  "Yaşamına uyum",
].map((label) => ({ isMock: true as const, label }));
export const mockTrust = [
  "Bilimsel yaklaşım",
  "Kişiye özel plan",
  "Online ve yüz yüze",
].map((label) => ({ isMock: true as const, label }));
export const mockProcess: ProcessStep[] = [
  {
    isMock: true,
    title: "Ön görüşme",
    description: "Önce birbirimizi tanıyalım.",
    detail:
      "Beklentilerini, hayatının ritmini ve danışmanlıktan ne beklediğini konuşmakla başlayalım.",
    image: "fruit",
  },
  {
    isMock: true,
    title: "Anamnez ve analiz",
    description: "Hikâyenin tamamını dinleyelim.",
    detail:
      "Alışkanlıklarını ve paylaşmak istediğin bilgileri görüşme sırasında birlikte değerlendirelim.",
    image: "preparation",
  },
  {
    isMock: true,
    title: "Kişiye özel plan",
    description: "Hayatına uyan bir yol çizelim.",
    detail:
      "Günlük akışında yer bulabilecek seçenekleri birlikte ele alıp kişisel bir çerçeve oluşturalım.",
    image: "salad",
  },
  {
    isMock: true,
    title: "Takip ve destek",
    description: "Yol boyunca iletişimde kalalım.",
    detail:
      "Deneyimlerini, sorularını ve değişen ihtiyaçlarını düzenli görüşmelerde konuşalım.",
    image: "breakfast",
  },
];
export const mockGoals: Goal[] = [
  {
    isMock: true,
    id: "denge",
    title: "Kilo yönetimi",
    description: "Alışkanlıklarına ve günlük yaşamına birlikte bakalım.",
    service: "bireysel",
    image: "salad",
    message:
      "Merhaba Günay Hanım, kilo yönetimi danışmanlığı hakkında bilgi almak istiyorum.",
  },
  {
    isMock: true,
    id: "hareket",
    title: "Sporcu beslenmesi",
    description: "Beslenmeni hareketinin ritmiyle birlikte düşünelim.",
    service: "sporcu",
    image: "preparation",
    message:
      "Merhaba Günay Hanım, sporcu beslenmesi danışmanlığı hakkında bilgi almak istiyorum.",
  },
  {
    isMock: true,
    id: "donem",
    title: "Gebelik ve emzirme",
    description: "Değişen ihtiyaçların için özenli bir başlangıç.",
    service: "gebelik",
    image: "fruit",
    message:
      "Merhaba Günay Hanım, gebelik ve emzirme dönemi danışmanlığı hakkında bilgi almak istiyorum.",
  },
  {
    isMock: true,
    id: "saglik",
    title: "Sağlık durumuna özel beslenme",
    description: "Hekim takibine eşlik eden kişisel bir yaklaşım.",
    service: "metabolik",
    image: "breakfast",
    message:
      "Merhaba Günay Hanım, sağlık durumuna özel beslenme danışmanlığı hakkında bilgi almak istiyorum.",
  },
];
export const mockPackages: Package[] = [
  {
    isMock: true,
    title: "İlk adım",
    subtitle: "Birbirimizi tanımak için",
    featured: false,
    scope: [
      "Ön görüşme",
      "İhtiyaçların birlikte değerlendirilmesi",
      "Süreç hakkında bilgilendirme",
    ],
  },
  {
    isMock: true,
    title: "Birlikte denge",
    subtitle: "Günlük hayatına eşlik eden",
    featured: true,
    scope: [
      "Kişisel beslenme görüşmeleri",
      "Birlikte hazırlanan yol haritası",
      "Planlı takip görüşmeleri",
      "Süreç içi soru ve değerlendirme",
    ],
  },
  {
    isMock: true,
    title: "Kendi ritminde",
    subtitle: "Mesafeden bağımsız bir yolculuk",
    featured: false,
    scope: [
      "Online görüşmeler",
      "Yaşam akışına uygun planlama",
      "Görüşmelerde düzenli değerlendirme",
    ],
  },
];
export const mockTestimonials: Testimonial[] = [
  {
    isMock: true,
    id: "a",
    initials: "A. K.",
    label: "Bireysel danışmanlık · örnek",
    quote:
      "Görüşmelerde günlük rutinimi anlatacak alan bulmak benim için değerliydi. Sürecin birlikte konuşularak ilerlemesini sevdim.",
  },
  {
    isMock: true,
    id: "b",
    initials: "E. D.",
    label: "Online danışmanlık · örnek",
    quote:
      "Görüşme öncesinde ne konuşacağımızın açık olması ve sorularımı rahatça sorabilmek süreci daha anlaşılır kıldı.",
  },
  {
    isMock: true,
    id: "c",
    initials: "M. S.",
    label: "Sporcu beslenmesi · örnek",
    quote:
      "Antrenman saatlerimle günlük hayatımı aynı konuşmanın içinde değerlendirmek hoşuma gitti. Dinlendiğimi hissettim.",
  },
  {
    isMock: true,
    id: "d",
    initials: "S. T.",
    label: "Bireysel danışmanlık · örnek",
    quote:
      "Sevdiğim yiyeceklerden ve alışkanlıklarımdan başlayarak konuşmak yaklaşımı benim için daha kişisel yaptı.",
  },
];
export const mockBlog: BlogPreview[] = [
  {
    isMock: true,
    title: "Sofrana mevsimden bir yer aç",
    category: "Sofra notları",
    readingTime: "4 dk okuma · örnek",
    image: "fruit",
  },
  {
    isMock: true,
    title: "Bir tabaktan daha fazlası",
    category: "Günlük yaşam",
    readingTime: "5 dk okuma · örnek",
    image: "salad",
  },
  {
    isMock: true,
    title: "Mutfakta küçük bir mola",
    category: "İyi yaşam",
    readingTime: "3 dk okuma · örnek",
    image: "preparation",
  },
];
export const mockFaqs: Faq[] = [
  {
    isMock: true,
    question: "İlk görüşmede neler konuşulur?",
    answer:
      "Günlük yaşamın, beklentilerin ve danışmanlık sürecine ilişkin soruların ele alınabilir. Kesin görüşme kapsamı randevu öncesinde birlikte netleştirilir.",
  },
  {
    isMock: true,
    question: "Online görüşme seçeneği olacak mı?",
    answer:
      "Tasarımda online danışmanlık seçeneğine yer veriliyor. Gerçek görüşme kanalı ve uygunluk bilgisi yayın öncesinde doğrulanacak.",
  },
  {
    isMock: true,
    question: "Herkese aynı plan mı hazırlanır?",
    answer:
      "Kişisel danışmanlıkta günlük yaşam ve bireysel ihtiyaçlar görüşülür. Bu sayfadaki metinler örnektir; kesin hizmet kapsamı henüz onaylanmamıştır.",
  },
  {
    isMock: true,
    question: "Görüşme sıklığı nasıl belirlenir?",
    answer:
      "Görüşme sıklığı, hizmet kapsamı ve karşılıklı uygunluk üzerinden birlikte kararlaştırılabilir. Burada sabit bir takip sıklığı taahhüt edilmiyor.",
  },
  {
    isMock: true,
    question: "Randevuya nasıl hazırlanabilirim?",
    answer:
      "Sormak istediklerini önceden not edebilirsin. Gerekli olabilecek belgeler yalnızca görüşme planlandığında güvenli bir kanaldan açıklanır; bu site belge toplamaz.",
  },
  {
    isMock: true,
    question: "Ücret bilgisine nasıl ulaşabilirim?",
    answer:
      "Paketler tasarım örneğidir. Gerçek fiyatlar ve hizmet kapsamı yayın öncesinde belirlenecek; doğrulanmış iletişim kanalı üzerinden bilgi alınabilecek.",
  },
  {
    isMock: true,
    question: "Hesaplayıcı kişisel bir beslenme planı mı verir?",
    answer:
      "Hayır. Hesaplayıcı genel bir matematiksel tahmin gösterir. Tanı, tedavi veya kişisel bir beslenme planı oluşturmaz. Girilen değerler kaydedilmez.",
  },
];
