export type EditorGlobal = "sports-homepage" | "site-settings";
export type EditorDocuments = Record<EditorGlobal, Record<string, unknown>>;
export type EditorMedia = {
  id: number;
  url: string;
  alt: string;
  filename?: string;
};
export type VisualField = {
  id: string;
  global: EditorGlobal;
  path: string;
  label: string;
  section: string;
  selectors: string[];
  type: "text" | "image";
  maxLength?: number;
};
export type VisualChange = { field: VisualField; value: unknown };
export const editorSections = [
  "Üst menü",
  "Açılış",
  "Hakkımda",
  "Hizmetler",
  "Sistem",
  "Kimler için",
  "Etkinlikler",
  "Tarifler",
  "Sosyal içerikler",
  "Medya",
  "Performans panosu",
  "Spor branşları",
  "Yorumlar",
  "Blog",
  "Sorular",
  "İletişim",
  "Alt bölüm",
  "Fotoğraflar",
];

export function readEditorPath(document: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (value, key) =>
        value !== null && typeof value === "object" && Object.hasOwn(value, key)
          ? (value as Record<string, unknown>)[key]
          : undefined,
      document,
    );
}
export function writeEditorPath(
  document: Record<string, unknown>,
  path: string,
  value: unknown,
) {
  const keys = path.split(".");
  if (
    keys.some((key) => ["__proto__", "constructor", "prototype"].includes(key))
  )
    throw new Error("Geçersiz alan.");
  let target: Record<string, unknown> = document;
  for (const key of keys.slice(0, -1)) {
    if (!target[key] || typeof target[key] !== "object") target[key] = {};
    target = target[key] as Record<string, unknown>;
  }
  target[keys.at(-1)!] = value;
}

export function visualFields(documents: EditorDocuments): VisualField[] {
  const fields: VisualField[] = [];
  const add = (
    global: EditorGlobal,
    path: string,
    label: string,
    section: string,
    selectors: string | string[],
    type: "text" | "image" = "text",
    maxLength = 3000,
  ) =>
    fields.push({
      id: global + ":" + path,
      global,
      path,
      label,
      section,
      selectors: typeof selectors === "string" ? [selectors] : selectors,
      type,
      maxLength,
    });
  const home = (
    path: string,
    label: string,
    section: string,
    selector?: string | string[],
    max = 3000,
  ) =>
    add(
      "sports-homepage",
      path,
      label,
      section,
      selector ?? '[data-sports-field="' + path + '"]',
      "text",
      max,
    );
  const site = (path: string, label: string, section: string, max = 3000) =>
    add(
      "site-settings",
      path,
      label,
      section,
      '[data-site-field="' + path + '"]',
      "text",
      max,
    );
  for (const [key, label, max] of [
    ["name", "İsim", 80],
    ["tagline", "İsim altı yazısı", 60],
    ["descriptorStatus", "Tanım onay notu", 100],
    ["appointmentLabel", "Randevu düğmesi", 40],
    ["title", "Mesleki unvan", 50],
    ["titleStatus", "Unvan onay notu", 100],
    ["footerEyebrow", "Alt bölüm başlığı", 100],
    ["footerNote", "Alt bölüm açıklaması", 500],
  ] as const)
    site(
      "brand." + key,
      label,
      key.startsWith("footer") ? "Alt bölüm" : "Üst menü",
      max,
    );
  const menu = documents["site-settings"].navigation;
  if (Array.isArray(menu)) {
    let visible = 0;
    menu.forEach((row, i) => {
      if (row.visible === false) return;
      add(
        "site-settings",
        "navigation." + i + ".label",
        i + 1 + ". menü bağlantısı",
        "Üst menü",
        '[data-menu-index="' + visible + '"]',
        "text",
        40,
      );
      visible++;
    });
  }
  const doc = documents["sports-homepage"];
  const labels: Record<string, string> = {
    audience: "Kimler için",
    about: "Hakkımda",
    services: "Hizmetler",
    method: "Sistem",
    events: "Etkinlikler",
    recipes: "Tarifler",
    social: "Sosyal içerikler",
    testimonials: "Yorumlar",
    faq: "Sorular",
    contact: "İletişim",
  };
  const fieldLabels: Record<string, string> = {
    eyebrow: "Üst yazı",
    title: "Başlık",
    accent: "Vurgulu başlık",
    description: "Açıklama",
    bio: "Biyografi",
    philosophy: "Yaklaşım",
    note: "Alt not",
    credential: "Mesleki bilgiler",
    kicker: "Üst etiket",
    first: "Başlık ilk satır",
    label: "Açıklama",
    word: "Büyük başlık",
    tag: "Üst etiket",
    quote: "Yorum",
    initials: "Baş harfler",
    question: "Soru",
    answer: "Yanıt",
    category: "Kategori",
    time: "Hazırlık süresi",
    type: "Tür",
    topic: "Konu",
    subtitle: "Üst not",
    date: "Tarih metni",
  };
  const copy =
    doc.copy && typeof doc.copy === "object"
      ? (doc.copy as Record<string, Record<string, unknown>>)
      : {};
  for (const [section, values] of Object.entries(copy))
    for (const [key, value] of Object.entries(values)) {
      if (typeof value !== "string" || key === "id") continue;
      const path = "copy." + section + "." + key;
      const root = '[data-sports-copy="' + section + '"]';
      const selector =
        key === "eyebrow"
          ? root + " > .eyebrow"
          : key === "title"
            ? root + " > h2"
            : key === "accent"
              ? root + " > h2 > .gradient-text"
              : key === "description"
                ? root + " > .section-description"
                : '[data-sports-field="' + path + '"]';
      home(
        path,
        (labels[section] ?? section) + " · " + (fieldLabels[key] ?? key),
        labels[section] ?? "Açılış",
        [selector, '[data-sports-field="' + path + '"]'],
        ["bio", "philosophy"].includes(key)
          ? 3000
          : ["description", "note", "credential"].includes(key)
            ? 800
            : 180,
      );
    }
  for (const [key, label, max] of [
    ["headline", "Ana başlık", 180],
    ["primaryLabel", "Bilgi düğmesi", 60],
    ["secondaryLabel", "İkinci düğme", 60],
    ["note", "Alt not", 200],
    ["scrollLabel", "Kaydırma ipucu", 100],
    ["visualCaption", "Görsel küçük yazısı", 150],
  ] as const)
    home("hero." + key, label, "Açılış", undefined, max);
  const rows = (key: string) =>
    Array.isArray(doc[key]) ? (doc[key] as Record<string, unknown>[]) : [];
  const maps: Record<
    string,
    { section: string; fields: Record<string, string> }
  > = {
    slides: {
      section: "Açılış",
      fields: { kicker: "", first: "", accent: "", description: "", label: "" },
    },
    services: {
      section: "Hizmetler",
      fields: {
        tag: ".service-main > .eyebrow",
        title: "h3",
        description: ".service-main > p:not(.eyebrow)",
        note: ".accordion-body > p",
      },
    },
    audiences: {
      section: "Kimler için",
      fields: {
        title: ".audience-title",
        subtitle: ".audience-subtitle",
        description: ".audience-description > p",
      },
    },
    method: {
      section: "Sistem",
      fields: { label: ".eyebrow", word: "h3", description: "p" },
    },
    events: {
      section: "Etkinlikler",
      fields: { type: "> .eyebrow", title: "h3", date: ".event-date" },
    },
    recipes: {
      section: "Tarifler",
      fields: {
        title: "h3",
        description: ".recipe-copy > p",
        category: ".recipe-copy > div > span:first-child",
        time: ".recipe-copy > div > span:last-child",
      },
    },
    socialTiles: {
      section: "Sosyal içerikler",
      fields: { title: "h3", topic: ".eyebrow" },
    },
    media: {
      section: "Medya",
      fields: {
        type: ".eyebrow",
        title: "h3",
        description: "div > p:not(.eyebrow)",
      },
    },
    testimonials: {
      section: "Yorumlar",
      fields: {
        quote: "blockquote",
        initials: ".testimonial-author > span",
        label: ".testimonial-author small",
      },
    },
    faqs: {
      section: "Sorular",
      fields: { question: "summary", answer: ".accordion-body > p" },
    },
  };
  for (const [key, definition] of Object.entries(maps)) {
    let visible = 0;
    rows(key).forEach((row, i) => {
      if (row.visible === false) return;
      const publicIndex = visible++;
      const root = '[data-sports-row="' + key + "." + publicIndex + '"]';
      for (const [field, selector] of Object.entries(definition.fields)) {
        const rowLimits: Record<string, number> = {
          first: 120,
          accent: 120,
          kicker: 100,
          label: 150,
          tag: 100,
          title: key === "events" || key === "media" ? 200 : 180,
          description:
            key === "slides" || key === "media"
              ? 800
              : key === "services"
                ? 1200
                : key === "method"
                  ? 1500
                  : 1000,
          note: 1200,
          subtitle: 150,
          date: 150,
          time: 100,
          quote: 2000,
          initials: 20,
          question: 250,
          answer: 3000,
          word: 200,
          topic: 120,
        };
        if (typeof row[field] !== "string") continue;
        home(
          key + "." + i + "." + field,
          i +
            1 +
            ". " +
            definition.section +
            " · " +
            (fieldLabels[field] ?? field),
          definition.section,
          key === "slides"
            ? '[data-sports-field="slides.' + publicIndex + "." + field + '"]'
            : field === "initials"
              ? [
                  root + " .testimonial-author > span",
                  root + " .testimonial-author > p",
                ]
              : root + " " + selector,
          rowLimits[field] ?? 150,
        );
      }
      if (key === "services" && Array.isArray(row.scope))
        row.scope.forEach((_, j) =>
          home(
            "services." + i + ".scope." + j + ".text",
            i + 1 + ". hizmet · " + (j + 1) + ". kapsam",
            "Hizmetler",
            root + " .accordion-body li:nth-child(" + (j + 1) + ")",
          ),
        );
      if (["slides", "recipes", "socialTiles"].includes(key))
        add(
          "sports-homepage",
          key + "." + i + ".photo",
          i + 1 + ". " + definition.section + " · Görsel",
          definition.section,
          '[data-sports-field="' + key + "." + publicIndex + '.photo"]',
          "image",
        );
    });
  }
  for (const [key, label] of [
    ["title", "Başlık"],
    ["eyebrow", "Üst yazı"],
    ["disclaimer", "Ölçüm açıklaması"],
    ["timelineTitle", "Zaman çizelgesi başlığı"],
  ])
    home("dashboard." + key, label, "Performans panosu");
  const dash = doc.dashboard as Record<string, unknown> | undefined;
  for (const key of ["rings", "timeline", "chips"]) {
    const list = dash?.[key];
    if (Array.isArray(list))
      list.forEach((_, i) =>
        home(
          "dashboard." + key + "." + i + ".label",
          i + 1 + ". " + key,
          "Performans panosu",
        ),
      );
  }
  rows("branches").forEach((_, i) =>
    home("branches." + i + ".label", i + 1 + ". spor branşı", "Spor branşları"),
  );
  for (const [key, label, max] of [
    ["phone", "Telefon", 40],
    ["email", "E-posta", 200],
    ["address", "Adres", 400],
    ["hours", "Çalışma saatleri", 300],
  ] as const)
    site("contact." + key, label, "İletişim", max);
  for (const [key, label] of [
    ["portrait", "Portre"],
    ["salad", "Ana yemek"],
    ["preparation", "Hazırlık"],
    ["fruit", "Meyve"],
    ["breakfast", "Sofra"],
  ])
    add(
      "site-settings",
      "photos." + key,
      label,
      "Fotoğraflar",
      '[data-site-photo="' + key + '"]',
      "image",
    );
  return fields;
}
