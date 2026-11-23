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
  },
  about: {
    isMock: true,
    eyebrow: "Merhaba, ben Günay.",
    title: "Bir diyetin ötesinde,",
    accent: "sana ait bir denge.",
  },
  services: {
    isMock: true,
    eyebrow: "Birlikte neler yapabiliriz?",
    title: "Hayatının her dönemine",
    accent: "özenle bir yaklaşım.",
    description:
      "Her ihtiyacın başlangıcı farklı. Sana uygun alanı birlikte keşfedelim.",
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
    label: "Instagram'da takip et",
    visible: true,
  },
  {
    isMock: true,
    platform: "youtube",
    url: "https://example.invalid/youtube",
    label: "YouTube'da keşfet",
    visible: true,
  },
  {
    isMock: true,
    platform: "tiktok",
    url: "https://example.invalid/tiktok",
    label: "TikTok'ta buluşalım",
    visible: true,
  },
  {
    isMock: true,
    platform: "whatsapp",
    url: "https://example.invalid/whatsapp",
    label: "WhatsApp'ta konuşalım",
    visible: true,
  },
  {
    isMock: true,
    platform: "linkedin",
    url: "https://example.invalid/linkedin",
    label: "LinkedIn'de bağlantı kur",
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
