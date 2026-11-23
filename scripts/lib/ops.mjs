import { existsSync, readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import path from "node:path";

export const productionUrl = "https://gunayturan.com.tr";
export const repoRoot = path.resolve(import.meta.dirname, "../..");
export function readJson(file, root = repoRoot) {
  return JSON.parse(readFileSync(path.join(root, file), "utf8"));
}
export function loadProductionEnvironment(root = repoRoot, env = process.env) {
  // Process ortamı önceliklidir; dosyalar ilk bulunan değer korunarak yüklenir.
  for (const name of [
    ".env.production.local",
    ".env.local",
    ".env.production",
    ".env",
  ]) {
    const file = path.join(root, name);
    if (!existsSync(file)) continue;
    for (const [key, value] of Object.entries(
      parseEnv(readFileSync(file, "utf8")),
    )) {
      if (key !== "NODE_ENV" && env[key] === undefined) env[key] = value;
    }
  }
  return env;
}
export function validateProductionEnvironment(env, cmsInstalled = false) {
  const errors = [];
  try {
    const url = new URL(env.SITE_URL);
    if (url.href !== `${productionUrl}/`)
      errors.push(
        "SITE_URL: production için beklenen HTTPS kök adresi kullanılmalı.",
      );
  } catch {
    errors.push(
      "SITE_URL: production için zorunlu ve geçerli bir mutlak URL olmalı.",
    );
  }
  if (cmsInstalled) {
    if (
      !env.PAYLOAD_SECRET ||
      env.PAYLOAD_SECRET.length < 32 ||
      /change|replace|example|placeholder|ornek/i.test(env.PAYLOAD_SECRET)
    )
      errors.push(
        "PAYLOAD_SECRET: en az 32 karakterli gerçek bir sır gerekli.",
      );
    try {
      const uri = new URL(env.DATABASE_URI);
      if (
        !["postgres:", "postgresql:"].includes(uri.protocol) ||
        /example|replace|placeholder/i.test(uri.hostname)
      )
        throw new Error();
    } catch {
      errors.push(
        "DATABASE_URI: geçerli production PostgreSQL bağlantısı gerekli.",
      );
    }
  }
  return errors;
}
export function findSampleMarkers(text) {
  const normalized = text.replace(/\\+"/g, '"');
  const patterns = [
    ["SAMPLE_RECORD", /["']?(?:isMock|isSample)["']?\s*:\s*true/iu],
    ["SAMPLE_ACCOUNT", /example\.invalid|ornek[-_]hesap/iu],
    ["SAMPLE_PHONE", /5XX/iu],
    ["PENDING_APPROVAL", /\[ONAY BEKLİYOR\]|[Uu]nvan onay bekliyor/u],
    [
      "SAMPLE_COPY",
      /Örnek (?:biyografi|yorumlar|paketler|iletişim)|Örnek Mahallesi/u,
    ],
    ["PLACEHOLDER_PORTRAIT", /Fotoğraf yakında/u],
  ];
  return patterns
    .filter(([, regex]) => regex.test(normalized))
    .map(([code]) => code);
}
export function safeBaseUrl(input) {
  const url = new URL(input);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/"
  )
    throw new Error(
      "Yalnızca kimlik bilgisi ve sorgu içermeyen HTTP/HTTPS kök adresi kullanın.",
    );
  return url;
}
export function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([\w-]+)\s*=\s*["']([^"']*)["']/g)].map((match) => [
      match[1].toLowerCase(),
      match[2].replaceAll("&amp;", "&"),
    ]),
  );
}
export function metaRobots(html) {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attrs = attributes(match[0]);
    if (attrs.name?.toLowerCase() === "robots") return attrs.content || "";
  }
  return "";
}
