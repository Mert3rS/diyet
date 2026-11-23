export type EditorGlobal = "homepage" | "site-settings";
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
  "Süreç",
  "Hedefler",
  "Paketler",
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
  const text = (
    global: EditorGlobal,
    path: string,
    label: string,
    section: string,
    selectors: string | string[],
    maxLength = 150,
  ) =>
    fields.push({
      id: `${global}:${path}`,
      global,
      path,
      label,
      section,
      selectors: typeof selectors === "string" ? [selectors] : selectors,
      type: "text",
      maxLength,
    });
  const home = (
    path: string,
    label: string,
    section: string,
    selectors: string | string[],
    maxLength?: number,
  ) => text("homepage", path, label, section, selectors, maxLength);
  const site = (
    path: string,
    label: string,
    section: string,
    selectors: string | string[],
    maxLength?: number,
  ) => text("site-settings", path, label, section, selectors, maxLength);
  site(
    "brand.name",
    "İsim",
    "Üst menü",
    [
      ".header-brand-name",
      ".footer-wordmark",
      ".identity-name",
      ".footer-copyright-name",
      ".mobile-cta-bar > span > small",
    ],
    80,
  );
  site(
    "brand.tagline",
    "İsim altındaki kısa metin",
    "Üst menü",
    ".header-brand-copy small",
    60,
  );
  site(
    "brand.appointmentLabel",
    "Randevu düğmesi",
    "Üst menü",
    [".header-cta > span", ".mobile-cta-bar > a"],
    40,
  );
  const menu = documents["site-settings"].navigation;
  if (Array.isArray(menu)) {
    let visibleIndex = 0;
    menu.forEach((item, i) => {
      if (!item || item.visible === false) return;
      visibleIndex++;
      site(
        `navigation.${i}.label`,
        `${visibleIndex}. menü bağlantısı`,
        "Üst menü",
        [
          `.desktop-navigation li:nth-child(${visibleIndex}) > a`,
          `.footer-bottom nav > a:nth-child(${visibleIndex})`,
          `#mobil-menu li:nth-child(${visibleIndex}) > a`,
        ],
        40,
      );
    });
  }
  site(
    "social.instagramLabel",
    "Instagram kartı açıklaması",
    "İletişim",
    '.social-cards [data-platform="instagram"] .social-description',
    100,
  );
  site(
    "social.whatsappLabel",
    "WhatsApp kartı açıklaması",
    "İletişim",
    '.social-cards [data-platform="whatsapp"] .social-description',
    100,
  );
  const copyGroups = [
    ["hero", "Açılış", ".hero", "#hero-title"],
    ["about", "Hakkımda", ".about-copy", "#about-title"],
    ["services", "Hizmetler", ".services-section", "#services-title"],
    ["process", "Süreç", ".process-section", "#process-title"],
    ["goals", "Hedefler", ".goals-section", "#goals-title"],
    ["packages", "Paketler", ".packages-section", "#packages-title"],
    [
      "testimonials",
      "Yorumlar",
      ".testimonials-section",
      "#testimonials-title",
    ],
    ["blog", "Blog", ".blog-section", "#blog-title"],
    ["faq", "Sorular", ".faq-section", "#faq-title"],
    ["contact", "İletişim", ".contact-section", "#contact-title"],
  ];
  for (const [key, section, selector, title] of copyGroups) {
    home(`copy.${key}.eyebrow`, "Üst yazı", section, `${selector} .eyebrow`);
    if (key === "hero") {
      home(
        "copy.hero.first",
        "Başlık ilk satır",
        section,
        "#hero-title .word-mask:nth-child(1) > span",
      );
      home(
        "copy.hero.second",
        "Başlık ikinci satır",
        section,
        "#hero-title .word-mask:nth-child(2) > span",
      );
    } else home(`copy.${key}.title`, "Başlık", section, title);
    home(`copy.${key}.accent`, "Vurgulu başlık", section, `${title} > em`);
    if (key !== "about") {
      const description =
        key === "hero"
          ? ".hero-description"
          : key === "process" || key === "faq"
            ? `${selector} .section-description`
            : key === "contact"
              ? ".contact-heading > p"
              : key === "packages"
                ? ".packages-section .center-heading > p:last-child"
                : `${selector} .section-title-row > p`;
      if (key !== "testimonials")
        home(`copy.${key}.description`, "Açıklama", section, description, 800);
    }
  }
  home(
    "copy.hero.primaryButton",
    "Ana düğme metni",
    "Açılış",
    ".hero-buttons > .button",
  );
  home(
    "copy.hero.introLink",
    "Tanışma bağlantısı",
    "Açılış",
    ".hero-buttons > .text-link",
  );
  home("copy.hero.note", "Alt not", "Açılış", ".hero-bottom > span");
  home(
    "copy.about.portraitFirst",
    "Portre notu",
    "Hakkımda",
    ".portrait-caption",
  );
  home(
    "copy.about.portraitAccent",
    "Portre vurgusu",
    "Hakkımda",
    ".portrait-caption > em",
  );
  home(
    "copy.about.portraitHandwriting",
    "El yazısı notu",
    "Hakkımda",
    ".portrait-handwriting",
  );
  home("identity.title", "Unvan", "Hakkımda", ".identity-title", 50);
  home(
    "identity.titleStatus",
    "Unvan hakkında not",
    "Hakkımda",
    ".identity-status",
    100,
  );
  home(
    "identity.bio",
    "Biyografi",
    "Hakkımda",
    ".about-copy > p:nth-of-type(3)",
    3000,
  );
  home(
    "identity.approach",
    "Yaklaşım",
    "Hakkımda",
    ".about-copy > p:nth-of-type(4)",
    3000,
  );
  const rows = (key: string) =>
    Array.isArray(documents.homepage[key])
      ? (documents.homepage[key] as Record<string, unknown>[])
      : [];
  for (const [i] of rows("services").entries()) {
    const selector = `.service-grid > div:nth-child(${i + 1}) .service-card`;
    for (const [key, label, target, length] of [
      ["title", "Hizmet adı", "h3", 150],
      ["tag", "Etiket", ".service-tag", 60],
      ["description", "Açıklama", "h3 + p", 1000],
    ] as const)
      home(
        `services.${i}.${key}`,
        `${i + 1}. hizmet · ${label}`,
        "Hizmetler",
        `${selector} ${target}`,
        length,
      );
  }
  home(
    "copy.services.linkLabel",
    "Hizmet bağlantısı",
    "Hizmetler",
    rows("services").map(
      (_, i) => `.service-grid > div:nth-child(${i + 1}) .service-link`,
    ),
  );
  for (const [i] of rows("trust").entries())
    home(
      `trust.${i}.label`,
      `${i + 1}. kısa not`,
      "Açılış",
      `.trust-list > span:nth-child(${i + 1})`,
      100,
    );
  for (const [i] of rows("tags").entries())
    home(
      `tags.${i}.label`,
      `${i + 1}. kayan metin`,
      "Hizmetler",
      [
        `.marquee-group:nth-child(1) > span:nth-child(${i + 1})`,
        `.marquee-group:nth-child(2) > span:nth-child(${i + 1})`,
      ],
      80,
    );
  for (const [i] of rows("process").entries()) {
    for (const [key, label, selector, length] of [
      ["title", "Başlık", ".eyebrow", 150],
      ["description", "Kısa açıklama", "h3", 500],
      ["detail", "Ayrıntı", "h3 + p", 1200],
    ] as const)
      home(
        `process.${i}.${key}`,
        `${i + 1}. adım · ${label}`,
        "Süreç",
        `.process-step:nth-child(${i + 1}) ${selector}`,
        length,
      );
  }
  for (const [i] of rows("goals").entries()) {
    home(
      `goals.${i}.message`,
      `${i + 1}. hedef · İlk mesaj`,
      "Hedefler",
      `[data-goal-index="${i}"] [data-goal-message]`,
      800,
    );
    home(
      `goals.${i}.title`,
      `${i + 1}. hedef · Başlık`,
      "Hedefler",
      `.goal-card:nth-child(${i + 1}) .goal-title`,
      100,
    );
    home(
      `goals.${i}.description`,
      `${i + 1}. hedef · Açıklama`,
      "Hedefler",
      `.goal-card:nth-child(${i + 1}) .goal-description`,
      500,
    );
  }
  for (const [i, row] of rows("packages").entries()) {
    const base = `.package-grid > div:nth-child(${i + 1})`;
    home(
      `packages.${i}.title`,
      `${i + 1}. paket · Başlık`,
      "Paketler",
      `${base} h3`,
    );
    home(
      `packages.${i}.subtitle`,
      `${i + 1}. paket · Üst yazı`,
      "Paketler",
      `${base} .eyebrow`,
      100,
    );
    if (Array.isArray(row.scope))
      row.scope.forEach((_, j) =>
        home(
          `packages.${i}.scope.${j}.text`,
          `${i + 1}. paket · ${j + 1}. kapsam`,
          "Paketler",
          `${base} li:nth-child(${j + 1})`,
          300,
        ),
      );
  }
  for (const [i] of rows("testimonials").entries()) {
    for (const [key, label] of [
      ["quote", "Yorum"],
      ["initials", "Baş harfler"],
      ["label", "Açıklama"],
    ])
      home(
        `testimonials.${i}.${key}`,
        `${i + 1}. yorum · ${label}`,
        "Yorumlar",
        key === "initials"
          ? [
              `[data-testimonial-index="${i}"] .testimonial-avatar`,
              `[data-testimonial-index="${i}"] figcaption > span:last-child > span`,
            ]
          : `[data-testimonial-index="${i}"] [data-testimonial-field="${key}"]`,
        key === "quote" ? 2000 : key === "initials" ? 20 : 150,
      );
  }
  for (const [i] of rows("blog").entries())
    for (const [key, label, selector, length] of [
      ["title", "Başlık", "h3", 180],
      ["category", "Kategori", ".blog-category", 80],
      ["readingTime", "Okuma süresi", ".blog-category > span", 80],
    ] as const)
      home(
        `blog.${i}.${key}`,
        `${i + 1}. yazı · ${label}`,
        "Blog",
        `.blog-grid > div:nth-child(${i + 1}) .blog-card ${selector}`,
        length,
      );
  for (const [i] of rows("faqs").entries()) {
    home(
      `faqs.${i}.question`,
      `${i + 1}. soru`,
      "Sorular",
      `.faq-list > details:nth-child(${i + 1}) > summary`,
      250,
    );
    home(
      `faqs.${i}.answer`,
      `${i + 1}. yanıt`,
      "Sorular",
      `.faq-list > details:nth-child(${i + 1}) .faq-answer p`,
      3000,
    );
  }
  for (const [key, label, selector] of [
    ["phone", "Telefon", '[data-contact-field="phone"]'],
    ["email", "E-posta", '[data-contact-field="email"]'],
    ["address", "Adres", ".contact-meta > p:nth-child(1) > span"],
    ["hours", "Çalışma saatleri", ".contact-meta > p:nth-child(2) > span"],
  ])
    site(
      `contact.${key}`,
      label,
      "İletişim",
      selector,
      key === "phone"
        ? 40
        : key === "email"
          ? 200
          : key === "address"
            ? 400
            : 300,
    );
  for (const [key, label, selector] of [
    ["socialEyebrow", "Sosyal alan üst yazısı", ".contact-social .eyebrow"],
    ["socialTitle", "Sosyal alan başlığı", ".contact-social h3"],
    ["socialAccent", "Sosyal alan vurgusu", ".contact-social h3 > em"],
    [
      "socialDescription",
      "Sosyal alan açıklaması",
      ".contact-social-intro > p",
    ],
  ])
    home(`copy.contact.${key}`, label, "İletişim", selector);
  site(
    "brand.footerEyebrow",
    "Alt bölüm üst yazısı",
    "Alt bölüm",
    ".footer-top > .eyebrow",
    100,
  );
  site(
    "brand.footerNote",
    "Alt bölüm açıklaması",
    "Alt bölüm",
    ".footer-note",
    500,
  );
  for (const [name, label] of [
    ["salad", "Ana yemek görseli"],
    ["fruit", "İkinci açılış görseli"],
    ["portrait", "Günay Turan portresi"],
    ["preparation", "Hazırlık ve süreç görseli"],
    ["breakfast", "Sofra görseli"],
  ])
    fields.push({
      id: `site-settings:photos.${name}`,
      global: "site-settings",
      path: `photos.${name}`,
      label,
      section: "Fotoğraflar",
      selectors: [`[data-site-photo="${name}"]`],
      type: "image",
    });
  return fields;
}
