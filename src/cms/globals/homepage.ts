import type { Field } from "payload";
import { mockCopy } from "@/content/mock-data";
import { checkbox, globalConfig, textField } from "../fields";

const groupNames: Record<keyof typeof mockCopy, string> = {
  hero: "Açılış",
  about: "Hakkımda",
  services: "Hizmetler",
  process: "Süreç",
  goals: "Hedef seçimi",
  packages: "Paketler",
  testimonials: "Yorumlar",
  blog: "Blog önizlemesi",
  faq: "Sık sorulan sorular",
  contact: "İletişim",
};
const copyLabels: Record<string, string> = {
  eyebrow: "Üst yazı",
  first: "Başlık ilk satır",
  second: "Başlık ikinci satır",
  title: "Başlık",
  accent: "Vurgulu başlık",
  description: "Açıklama",
  note: "Alt not",
  primaryButton: "Ana düğme metni",
  introLink: "Tanışma bağlantısı",
  portraitFirst: "Portre notunun ilk satırı",
  portraitAccent: "Portre notunun vurgulu satırı",
  portraitHandwriting: "El yazısı notu",
  linkLabel: "Hizmet bağlantısının metni",
  socialEyebrow: "Sosyal alan üst yazısı",
  socialTitle: "Sosyal alan başlığı",
  socialAccent: "Sosyal alan vurgulu başlığı",
  socialDescription: "Sosyal alan açıklaması",
};
const array = (
  name: string,
  label: string,
  fields: Field[],
  maxRows = 16,
): Field => ({ name, label, type: "array", fields, maxRows });
const image: Field = {
  name: "image",
  label: "Görsel",
  type: "select",
  required: true,
  options: [
    { label: "Ana yemek", value: "salad" },
    { label: "Meyveler", value: "fruit" },
    { label: "Hazırlık", value: "preparation" },
    { label: "Sofra", value: "breakfast" },
  ],
};
export const Homepage = globalConfig("homepage", "Ana sayfa", [
  {
    ...checkbox("isMock", "Bu sayfa örnek içerik içeriyor", true),
    admin: {
      description:
        "Unvan, biyografi, hizmetler ve diğer içerikleri onayladıktan sonra kapatın. Sağlık sonucu veya tedavi vaadi eklemeyin.",
    },
  },
  {
    type: "tabs",
    tabs: [
      {
        label: "Bölüm başlıkları",
        fields: [
          {
            name: "copy",
            label: "Metinler",
            type: "group",
            fields: Object.entries(mockCopy).map(([name, values]): Field => ({
              name,
              label: groupNames[name as keyof typeof mockCopy],
              type: "group",
              fields: Object.keys(values)
                .filter((key) => key !== "isMock")
                .map((key) =>
                  textField(
                    key,
                    copyLabels[key] ?? key,
                    key === "description" ? 800 : 150,
                    true,
                  ),
                ),
            })),
          },
        ],
      },
      {
        label: "Biyografi",
        fields: [
          {
            name: "identity",
            label: "Hakkımda",
            type: "group",
            fields: [
              textField("name", "İsim", 80, true),
              textField("title", "Unvan", 50),
              textField("titleStatus", "Unvan hakkında not", 100),
              textField("slogan", "Kısa slogan", 200),
              textField("bio", "Biyografi", 3000, true),
              textField("approach", "Yaklaşım", 3000, true),
            ],
          },
        ],
      },
      {
        label: "Hizmetler ve süreç",
        fields: [
          array(
            "services",
            "Hizmetler",
            [
              textField("slug", "Kimlik (bağlantı adı)", 40, true),
              textField("title", "Hizmet adı", 150, true),
              textField("description", "Açıklama", 1000, true),
              textField("tag", "Kısa üst etiket", 60),
              {
                name: "icon",
                label: "Simge",
                type: "select",
                required: true,
                options: [
                  { label: "Yaprak", value: "leaf" },
                  { label: "Ekran", value: "screen" },
                  { label: "Hareket", value: "activity" },
                  { label: "Çiçek", value: "flower" },
                  { label: "Filiz", value: "sprout" },
                  { label: "Kalp", value: "heart" },
                ],
              },
            ],
            12,
          ),
          array(
            "process",
            "Görüşme adımları",
            [
              textField("title", "Adım başlığı", 150, true),
              textField("description", "Kısa açıklama", 500, true),
              textField("detail", "Ayrıntı", 1200, true),
              image,
            ],
            8,
          ),
          array(
            "tags",
            "Kayan kısa metinler",
            [textField("label", "Metin", 80, true)],
            20,
          ),
          array(
            "trust",
            "Açılıştaki kısa notlar",
            [textField("label", "Metin", 100, true)],
            6,
          ),
        ],
      },
      {
        label: "Hedefler ve paketler",
        fields: [
          array(
            "goals",
            "Hedef kartları",
            [
              textField("key", "Kimlik", 40, true),
              textField("service", "İlgili hizmet kimliği", 40, true),
              textField("title", "Başlık", 100, true),
              textField("description", "Açıklama", 500, true),
              textField("message", "İlk mesaj", 800, true),
              image,
            ],
            8,
          ),
          array(
            "packages",
            "Danışmanlık paketleri",
            [
              textField("title", "Paket adı", 150, true),
              textField("subtitle", "Üst yazı", 100),
              array(
                "scope",
                "Paket kapsamı",
                [textField("text", "Madde", 300, true)],
                12,
              ),
              checkbox("featured", "Öne çıkar"),
            ],
            6,
          ),
        ],
      },
      {
        label: "Yorumlar, blog ve sorular",
        fields: [
          array(
            "testimonials",
            "Yorumlar",
            [
              textField("key", "Kimlik", 40, true),
              textField("initials", "Görünen baş harfler", 20, true),
              textField("label", "Açıklama", 150),
              textField("quote", "Yorum metni", 2000, true),
            ],
            12,
          ),
          array(
            "blog",
            "Blog önizleme kartları",
            [
              textField("title", "Başlık", 180, true),
              textField("category", "Kategori", 80),
              textField("readingTime", "Okuma süresi metni", 80),
              image,
            ],
            9,
          ),
          array(
            "faqs",
            "Sık sorulan sorular",
            [
              textField("question", "Soru", 250, true),
              textField("answer", "Yanıt", 3000, true),
            ],
            24,
          ),
        ],
      },
    ],
  },
]);
