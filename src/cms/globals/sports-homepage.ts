import type { Field } from "payload";
import { defaultSportsHome } from "@/content/sports-defaults";
import { checkbox, globalConfig, textField } from "../fields";

const names: Record<string, string> = {
  audience: "Kimler için",
  about: "Hakkımda",
  services: "Hizmetler",
  method: "Sistem",
  events: "Etkinlikler",
  recipes: "Tarifler",
  social: "Sosyal içerikler",
  testimonials: "Yorumlar",
  faq: "SSS",
  contact: "İletişim",
  dashboard: "Performans panosu",
  branches: "Kayan spor branşları",
  eyebrow: "Üst yazı",
  title: "Başlık",
  accent: "Vurgulu başlık",
  description: "Açıklama",
  bio: "Biyografi",
  philosophy: "Yaklaşım",
  note: "Alt not",
  credential: "Mesleki bilgiler / onay notu",
};
const optionLabels: Record<string, string> = {
  running: "Koşu fotoğrafı",
  food: "Yemek fotoğrafı",
  track: "Pist çizimi",
  kitchen: "Mutfak fotoğrafı",
  activity: "Hareket",
  utensils: "Beslenme",
  users: "Takım",
  mic: "Mikrofon",
  trophy: "Kupa",
  sprout: "Filiz",
  footprints: "Adımlar",
  heart: "Kalp",
  messages: "Sohbet",
  salad: "Ana yemek",
  fruit: "Meyve",
  preparation: "Hazırlık",
  breakfast: "Sofra",
};
const options = (values: string[]) =>
  values.map((value) => ({ label: optionLabels[value] ?? value, value }));
const select = (name: string, label: string, values: string[]): Field => ({
  name,
  label,
  type: "select",
  required: true,
  options: options(values),
});
const list = (
  name: string,
  label: string,
  fields: Field[],
  maxRows = 24,
  minRows = 0,
): Field => ({
  name,
  label,
  type: "array",
  fields,
  maxRows,
  minRows,
  validate: (value: unknown) => {
    if (!Array.isArray(value)) return true;
    if (name === "slides" && !value.some((row) => row && row.visible !== false))
      return "En az bir slayt görünür olmalıdır.";
    if (
      name === "services" &&
      new Set(value.map((row) => row?.slug)).size !== value.length
    )
      return "Hizmet kimlikleri birbirinden farklı olmalıdır.";
    return true;
  },
  admin: { initCollapsed: true },
});
const visibility = () => [
  checkbox("visible", "Sitede göster", true),
  checkbox("isMock", "Örnek kayıt", true),
];
const upload = (): Field => ({
  name: "photo",
  label: "Özel görsel",
  type: "upload",
  relationTo: "media",
  admin: {
    description:
      "İsteğe bağlı. Boş bırakılırsa seçili tasarım görseli kullanılır. Alt metni görsel kütüphanesinden düzenleyin.",
  },
});
const image = () =>
  select("image", "Varsayılan tasarım görseli", [
    "salad",
    "fruit",
    "preparation",
    "breakfast",
  ]);
const serviceKey = (name: string, label: string): Field => ({
  ...textField(name, label, 40, true),
  validate: (value: unknown) =>
    (typeof value === "string" && /^[a-z0-9-]{1,40}$/.test(value)) ||
    "Yalnız küçük harf, sayı ve tire kullanın.",
});
const defaults = defaultSportsHome();

export const SportsHomepage = globalConfig(
  "sports-homepage",
  "Ana sayfa · Spor ve beslenme",
  [
    checkbox("isMock", "Sayfa örnek içerik içeriyor", true),
    {
      type: "tabs",
      tabs: [
        {
          label: "Açılış ve slider",
          fields: [
            {
              name: "hero",
              label: "Ortak açılış metinleri",
              type: "group",
              fields: [
                textField("headline", "Ana başlık (h1)", 180, true),
                textField("primaryLabel", "Bilgi düğmesi", 60, true),
                textField("secondaryLabel", "Randevu düğmesi", 60, true),
                textField("note", "Alt not", 200),
                textField("scrollLabel", "Kaydırma ipucu", 100),
                textField("visualCaption", "Görsel üzerindeki küçük yazı", 150),
                checkbox("autoplay", "Otomatik slayt geçişini aç", true),
              ],
            },
            list(
              "slides",
              "Açılış slaytları",
              [
                ...visibility(),
                serviceKey("service", "İlgili hizmet kimliği"),
                textField("kicker", "Üst etiket", 100, true),
                textField("first", "Başlık ilk satır", 120, true),
                textField("accent", "Başlık vurgusu", 120, true),
                textField("description", "Açıklama", 800, true),
                textField("label", "Görsel notu", 100),
                select("visual", "Varsayılan kompozisyon", [
                  "running",
                  "food",
                  "track",
                  "kitchen",
                ]),
                upload(),
              ],
              8,
              1,
            ),
          ],
        },
        {
          label: "Bölüm metinleri",
          fields: [
            {
              name: "copy",
              type: "group",
              label: "Başlıklar ve açıklamalar",
              fields: Object.entries(defaults.copy).map(
                ([name, values]): Field => ({
                  name,
                  label: names[name],
                  type: "group",
                  fields: Object.keys(values)
                    .filter((key) => key !== "isMock")
                    .map((key) =>
                      textField(
                        key,
                        names[key] ?? key,
                        ["bio", "philosophy"].includes(key)
                          ? 3000
                          : ["description", "note", "credential"].includes(key)
                            ? 800
                            : 180,
                        ["title", "accent", "eyebrow"].includes(key),
                      ),
                    ),
                }),
              ),
            },
          ],
        },
        {
          label: "Hizmetler ve hedef kitleler",
          fields: [
            list("services", "Hizmetler", [
              ...visibility(),
              serviceKey("slug", "Hizmet kimliği"),
              textField("title", "Hizmet adı", 180, true),
              textField("tag", "Üst etiket", 100),
              textField("description", "Açıklama", 1200, true),
              select("icon", "Simge", ["activity", "utensils", "users", "mic"]),
              list(
                "scope",
                "Program kapsamı",
                [textField("text", "Madde", 400, true)],
                16,
              ),
              textField("note", "İlk görüşme notu", 1200),
            ]),
            list("audiences", "Kimler için kartları", [
              ...visibility(),
              textField("title", "Başlık", 150, true),
              textField("subtitle", "Üst not", 150),
              textField("description", "Açıklama", 1000),
              serviceKey("service", "İlgili hizmet kimliği"),
              select("icon", "Simge", [
                "trophy",
                "sprout",
                "footprints",
                "heart",
              ]),
              textField("message", "Hazırlanacak WhatsApp mesajı", 800),
            ]),
            list(
              "method",
              "Sistem adımları",
              [
                ...visibility(),
                textField("title", "Adım adı", 100, true),
                textField("label", "Üst etiket", 100),
                textField("word", "Büyük başlık", 200, true),
                textField("description", "Açıklama", 1500),
              ],
              8,
            ),
          ],
        },
        {
          label: "Etkinlikler ve tarifler",
          fields: [
            list("events", "Etkinlik kartları", [
              ...visibility(),
              textField("type", "Tür", 100),
              textField("title", "Başlık", 200, true),
              textField("date", "Tarih açıklaması", 150),
              select("icon", "Simge", ["mic", "messages", "users"]),
            ]),
            list(
              "recipes",
              "Tarif kartları",
              [
                ...visibility(),
                textField("title", "Başlık", 180, true),
                textField("description", "Açıklama", 1000),
                select("category", "Kategori", ["Ana yemek", "Tatlı", "Tuzlu"]),
                textField("time", "Hazırlık süresi açıklaması", 100),
                image(),
                upload(),
              ],
              30,
            ),
          ],
        },
        {
          label: "Sosyal, medya ve yorumlar",
          fields: [
            list(
              "socialTiles",
              "Sosyal paylaşım kartları",
              [
                ...visibility(),
                textField("title", "Başlık", 180, true),
                textField("topic", "Konu", 120),
                {
                  name: "image",
                  label: "Varsayılan görsel (boş = grafik kart)",
                  type: "select",
                  options: options([
                    "salad",
                    "fruit",
                    "preparation",
                    "breakfast",
                  ]),
                },
                upload(),
              ],
              18,
            ),
            list(
              "media",
              "Video, podcast ve blog önizlemeleri",
              [
                ...visibility(),
                select("type", "Tür", ["VİDEO", "PODCAST", "BLOG"]),
                textField("title", "Başlık", 200, true),
                textField("description", "Açıklama", 800),
              ],
              18,
            ),
            list(
              "testimonials",
              "Danışan yorumları",
              [
                ...visibility(),
                textField("initials", "Baş harfler", 20, true),
                textField("label", "Açıklama", 150),
                textField("quote", "Yorum", 2000, true),
              ],
              16,
            ),
            list(
              "faqs",
              "Sık sorulan sorular",
              [
                ...visibility(),
                textField("question", "Soru", 250, true),
                textField("answer", "Yanıt", 3000, true),
              ],
              30,
            ),
          ],
        },
        {
          label: "Pano ve görünürlük",
          fields: [
            {
              name: "dashboard",
              label: "Örnek performans panosu",
              type: "group",
              fields: [
                textField("title", "Başlık", 150, true),
                textField("eyebrow", "Üst yazı", 100),
                {
                  ...textField("disclaimer", "Açıklama", 200, true),
                  admin: {
                    description:
                      "Panonun gerçek bir ölçüm olmadığını belirten notu koruyun.",
                  },
                },
                textField("timelineTitle", "Zaman çizelgesi başlığı", 150),
                list(
                  "rings",
                  "Gösterge etiketleri",
                  [textField("label", "Etiket", 80, true)],
                  3,
                  1,
                ),
                list(
                  "timeline",
                  "Zaman çizelgesi adımları",
                  [textField("label", "Adım", 120, true)],
                  8,
                ),
                list(
                  "chips",
                  "Kayan kısa notlar",
                  [textField("label", "Not", 100, true)],
                  12,
                ),
              ],
            },
            list(
              "branches",
              "Kayan spor branşları",
              [textField("label", "Branş", 80, true)],
              20,
            ),
            {
              name: "sections",
              label: "Bölüm görünürlüğü",
              type: "group",
              fields: Object.keys(defaults.sections).map((key) =>
                checkbox(key, `${names[key]} bölümünü göster`, true),
              ),
            },
          ],
        },
      ],
    },
  ],
);
