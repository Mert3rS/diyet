import path from "node:path";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { tr } from "@payloadcms/translations/languages/tr";
import {
  isAdmin,
  protectLastAdmin,
  protectUserCreation,
  publicRead,
} from "./cms/access";
import { SiteSettings } from "./cms/globals/site-settings";
import { Homepage } from "./cms/globals/homepage";
import { BodyAnalysisSettingsGlobal } from "./cms/globals/body-analysis";
import { disabledEmailAdapter } from "./cms/email";
import { mediaStorage } from "./cms/storage";

const root = path.resolve(process.cwd(), "src");
const origins = [
  ...new Set(
    [
      process.env.SITE_URL,
      process.env.RENDER_EXTERNAL_URL,
      ...(process.env.CMS_ALLOWED_ORIGINS || "").split(","),
    ]
      .filter(Boolean)
      .map((value) => new URL(value!).origin),
  ),
];
export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || "",
  telemetry: false,
  plugins: [mediaStorage],
  email: disabledEmailAdapter,
  serverURL: "",
  cors: origins,
  csrf: origins,
  i18n: { fallbackLanguage: "tr", supportedLanguages: { tr } },
  admin: {
    theme: "light",
    user: "users",
    importMap: {
      baseDir: root,
      importMapFile: path.resolve(root, "app/(payload)/admin/importMap.ts"),
      autoGenerate: false,
    },
    meta: { titleSuffix: "· Günay Turan yönetim", robots: "noindex,nofollow" },
    components: {
      afterNavLinks: ["/components/admin/visual-editor-link#VisualEditorLink"],
      beforeLogin: ["/components/admin/login#AdminLoginIntro"],
      afterLogin: ["/components/admin/login#AdminLoginFooter"],
      views: {
        visualEditor: {
          Component: "/components/admin/visual-editor-view#VisualEditorView",
          path: "/visual-editor",
          exact: true,
          meta: { title: "Görsel düzenleyici" },
        },
        dashboard: { Component: "/components/admin/dashboard#AdminDashboard" },
      },
      graphics: {
        Logo: "/components/admin/logo#AdminLogo",
        Icon: "/components/admin/logo#AdminIcon",
      },
    },
  },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || "", max: 5 },
    push: false,
    migrationDir: path.resolve(root, "migrations"),
  }),
  typescript: { outputFile: path.resolve(root, "payload-types.ts") },
  graphQL: { disable: true },
  upload: { limits: { fileSize: 8 * 1024 * 1024 } },
  collections: [
    {
      slug: "users",
      labels: { singular: "Yönetici", plural: "Yöneticiler" },
      auth: {
        maxLoginAttempts: 5,
        lockTime: 600000,
        tokenExpiration: 7200,
        cookies: {
          sameSite: "Lax",
          secure: process.env.NODE_ENV === "production",
        },
      },
      admin: { useAsTitle: "email", group: "Yönetim" },
      access: {
        admin: isAdmin,
        create: isAdmin,
        read: isAdmin,
        update: isAdmin,
        delete: isAdmin,
      },
      hooks: {
        beforeChange: [protectUserCreation],
        beforeDelete: [protectLastAdmin],
      },
      fields: [
        { name: "name", label: "İsim", type: "text", maxLength: 100 },
        {
          name: "role",
          label: "Yetki",
          type: "select",
          required: true,
          defaultValue: "admin",
          options: [{ label: "Yönetici", value: "admin" }],
          admin: { readOnly: true },
        },
      ],
    },
    {
      slug: "media",
      labels: { singular: "Görsel", plural: "Görseller" },
      admin: { group: "Site yönetimi", useAsTitle: "alt" },
      access: {
        read: publicRead,
        create: isAdmin,
        update: isAdmin,
        delete: isAdmin,
      },
      upload: {
        staticDir: path.resolve(process.cwd(), "media"),
        mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
      },
      fields: [
        {
          name: "alt",
          label: "Görsel açıklaması (alt metin)",
          type: "text",
          required: true,
          maxLength: 240,
        },
      ],
    },
  ],
  globals: [SiteSettings, Homepage, BodyAnalysisSettingsGlobal],
});
