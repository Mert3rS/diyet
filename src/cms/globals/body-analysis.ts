import type { Field } from "payload";
import { checkbox, globalConfig, textField } from "../fields";
import { normalizePhone, validateTemplate } from "@/lib/body-analysis/messages";
import { isSafeCopy, hasBannedCopy } from "@/lib/body-analysis/settings";
const safeText = (name: string, label: string, max: number): Field => ({
  ...textField(name, label, max, true),
  validate: (value: unknown) =>
    isSafeCopy(value, max) ||
    "Düz metin kullanın; sağlık iddiası, tüketim hedefi veya kilo kategorisi eklemeyin.",
});
export const BodyAnalysisSettingsGlobal = globalConfig(
  "body-analysis-settings",
  "Vücut analizi ayarları",
  [
    {
      ...checkbox("enabled", "Aracı sitede göster"),
      admin: {
        description:
          "Üretimde varsayılan kapalıdır. Numara, mesaj, uzman ve hukuk incelemesi tamamlandıktan sonra açın.",
      },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Görünüm",
          fields: [
            safeText("title", "Başlık", 60),
            safeText("subtitle", "Alt başlık", 100),
            safeText("description", "Açıklama", 300),
            safeText("calculateLabel", "Hesapla düğmesi", 40),
            safeText("sendLabel", "WhatsApp düğmesi", 40),
          ],
        },
        {
          label: "Hizmetler ve alanlar",
          fields: [
            {
              name: "services",
              label: "Hizmetler",
              type: "array",
              minRows: 1,
              maxRows: 8,
              fields: [
                textField("key", "Kimlik", 40, true),
                safeText("label", "Görünen ad", 80),
                checkbox("isDefault", "Varsayılan hizmet"),
              ],
            },
            {
              name: "fields",
              label: "İsteğe bağlı ölçüler",
              type: "group",
              fields: [
                checkbox("neck", "Boyun alanını göster", true),
                checkbox("waist", "Bel alanını göster", true),
                checkbox("hip", "Kalça alanını göster", true),
              ],
            },
          ],
        },
        {
          label: "WhatsApp mesajı",
          fields: [
            {
              name: "messageTemplate",
              label: "Mesaj şablonu",
              type: "textarea",
              required: true,
              validate: (value: unknown) =>
                validateTemplate(value) ??
                ((typeof value === "string" && !hasBannedCopy(value)) ||
                  "Şablona sağlık iddiası, tüketim hedefi veya kilo kategorisi eklemeyin."),
              admin: {
                description:
                  "Yalnız {ad}, {cinsiyet}, {yas}, {boy}, {kilo}, {vki}, {yag_orani}, {hizmet}. En az bir açıklayıcı cümle bırakın; HTML kullanmayın.",
              },
            },
            checkbox("includeBmi", "VKİ satırını mesaja ekle", true),
            checkbox("includeFat", "Tahmini yağ aralığını mesaja ekle", true),
            {
              name: "whatsappOverride",
              label: "Bu araç için WhatsApp numarası",
              type: "text",
              admin: {
                description: "Boşsa Site ayarlarındaki numara kullanılır.",
              },
              validate: (value: unknown) =>
                !value ||
                (typeof value === "string" && Boolean(normalizePhone(value))) ||
                "Geçerli bir uluslararası numara girin.",
            },
          ],
        },
      ],
    },
    {
      name: "fixedRules",
      type: "ui",
      admin: {
        components: { Field: "/components/admin/analysis-guide#AnalysisGuide" },
      },
    },
  ],
);
