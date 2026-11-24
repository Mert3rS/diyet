import type { Field } from "payload";
import { checkbox, globalConfig, textField } from "../fields";
import { normalizePhone } from "@/lib/body-analysis/messages";

const contactFields: Field[] = [
  {
    ...checkbox("isMock", "İletişim bilgileri örnektir", true),
    admin: {
      description:
        "Gerçek iletişim bilgilerini doğruladıktan sonra kapatın. Örnek numaralarla mesaj veya arama başlatılmaz.",
    },
  },
  {
    name: "phone",
    type: "text",
    label: "WhatsApp ve telefon numarası",
    admin: {
      description:
        "Ülke koduyla yazın. Örnek: +90 ile başlayan onaylı numaranız. Tüm WhatsApp düğmeleri bu numarayı kullanır.",
    },
    validate: (
      value: unknown,
      { siblingData }: { siblingData: Record<string, unknown> },
    ) =>
      siblingData.isMock === true ||
      !value ||
      (typeof value === "string" && Boolean(normalizePhone(value))) ||
      "Geçerli bir uluslararası telefon numarası girin.",
  },
  {
    name: "email",
    type: "text",
    label: "İletişim e-posta adresi",
    validate: (value: unknown) =>
      !value ||
      (typeof value === "string" &&
        /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value)) ||
      "Geçerli bir e-posta adresi girin.",
  },
  textField("address", "Adres", 400),
  textField("hours", "Çalışma saatleri"),
  textField("whatsappMessage", "İlk WhatsApp mesajı", 500),
];
export const SiteSettings = globalConfig("site-settings", "Site ayarları", [
  {
    type: "tabs",
    tabs: [
      {
        label: "Marka ve düğmeler",
        fields: [
          {
            name: "brand",
            type: "group",
            label: "Genel görünüm",
            fields: [
              textField("name", "İsim", 80, true),
              textField("tagline", "İsim altındaki kısa metin", 60),
              textField("description", "Site açıklaması", 300),
              textField("appointmentLabel", "Randevu düğmesi", 40),
              textField("footerEyebrow", "Alt bölüm üst yazısı", 100),
              textField("footerNote", "Alt bölüm açıklaması", 500),
              textField("title", "Mesleki unvan", 50),
              textField("titleStatus", "Unvan onay notu", 100),
              textField("descriptorStatus", "İsim altı metnin onay notu", 100),
              {
                name: "bookingUrl",
                label: "Harici online randevu bağlantısı",
                type: "text",
                admin: {
                  description:
                    "İsteğe bağlı HTTPS adresi. Boşsa bağlantı gösterilmez.",
                },
                validate: (value: unknown) => {
                  if (!value) return true;
                  try {
                    const url = new URL(String(value));
                    return (
                      (url.protocol === "https:" &&
                        !url.username &&
                        !url.password) ||
                      "Geçerli bir HTTPS adresi girin."
                    );
                  } catch {
                    return "Geçerli bir HTTPS adresi girin.";
                  }
                },
              },
            ],
          },
        ],
      },
      {
        label: "İletişim",
        fields: [
          {
            name: "contact",
            type: "group",
            label: "İletişim bilgileri",
            fields: contactFields,
          },
        ],
      },
      {
        label: "WhatsApp ve Instagram",
        fields: [
          {
            name: "social",
            type: "group",
            label: "Sosyal hesaplar",
            fields: [
              checkbox(
                "whatsappVisible",
                "WhatsApp bağlantılarını göster",
                true,
              ),
              textField("whatsappLabel", "WhatsApp kartı açıklaması", 100),
              checkbox(
                "instagramVisible",
                "Instagram bağlantılarını göster",
                true,
              ),
              checkbox("instagramIsMock", "Instagram adresi örnektir", true),
              {
                name: "instagramUrl",
                type: "text",
                label: "Instagram profil adresi",
                admin: {
                  description:
                    "https://www.instagram.com/ ile başlayan profil bağlantınızı girin. Boş bırakıldığında bağlantı gösterilmez.",
                },
                validate: (
                  value: unknown,
                  { siblingData }: { siblingData: Record<string, unknown> },
                ) => {
                  if (!value) return true;
                  try {
                    const url = new URL(String(value));
                    return (
                      (url.protocol === "https:" &&
                        !url.username &&
                        !url.password &&
                        (["instagram.com", "www.instagram.com"].includes(
                          url.hostname,
                        ) ||
                          (siblingData.instagramIsMock === true &&
                            url.hostname === "example.invalid"))) ||
                      "Geçerli bir HTTPS Instagram profil adresi girin."
                    );
                  } catch {
                    return "Geçerli bir Instagram profil adresi girin.";
                  }
                },
              },
              textField("instagramLabel", "Instagram kartı açıklaması", 100),
            ],
          },
        ],
      },
      {
        label: "Fotoğraflar",
        fields: [
          {
            name: "photos",
            type: "group",
            label: "Site görselleri",
            fields: [
              ...[
                ["portrait", "Günay Turan portresi"],
                ["salad", "Ana yemek görseli"],
                ["fruit", "Meyve fotoğrafı"],
                ["preparation", "Hazırlık ve mutfak fotoğrafı"],
                ["breakfast", "Sofra görseli"],
              ].map(([name, label]): Field => ({
                name,
                label,
                type: "upload",
                relationTo: "media",
                admin: {
                  description:
                    "Yüklenen görselin açıklama (alt metin) alanını doldurun. Boşsa mevcut tasarım görseli kullanılır.",
                },
              })),
            ],
          },
        ],
      },
      {
        label: "Menü",
        fields: [
          {
            name: "navigation",
            type: "array",
            label: "Menü bağlantıları",
            maxRows: 12,
            fields: [
              {
                name: "anchor",
                label: "Bölüm",
                type: "select",
                required: true,
                options: [
                  { label: "Hakkımda", value: "hakkimda" },
                  { label: "Hizmetler", value: "hizmetler" },
                  { label: "Süreç", value: "surec" },
                  { label: "Kimler için", value: "kimler-icin" },
                  { label: "Sistem", value: "sistem" },
                  { label: "Tarifler", value: "tarifler" },
                  { label: "Sık sorulan sorular", value: "sss" },
                  { label: "İletişim", value: "iletisim" },
                ],
              },
              textField("label", "Görünen metin", 40, true),
              checkbox("visible", "Göster", true),
            ],
          },
        ],
      },
    ],
  },
]);
