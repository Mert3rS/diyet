import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  repoRoot,
  readJson,
  findSampleMarkers,
  loadProductionEnvironment,
  validateProductionEnvironment,
  attributes,
} from "./lib/ops.mjs";

const results = [];
function check(id, passed, detail) {
  results.push({ id, status: passed ? "passed" : "failed", detail });
}
const pkg = readJson("package.json");
const decisions = readJson("ops/decisions.json");
const config = readFileSync(path.join(repoRoot, "src/config/site.ts"), "utf8");
for (const [key, value] of Object.entries(decisions))
  check(
    `DECISION_${key.toUpperCase()}`,
    value !== null && value !== "" && !/^\[.*\]$/.test(String(value)),
    `${key}: ${value == null ? "karar bekliyor" : "kaydedildi; sağlayıcı özellikleri ayrıca doğrulanmalı"}`,
  );
const [major, minor, patch] = process.versions.node.split(".").map(Number);
check(
  "PAYLOAD_RUNTIME",
  major === 24 && (minor > 22 || (minor === 22 && patch >= 3)),
  "Planlanan Payload 3.94.1 için doğrulanmış Node 24 minimumu 24.22.3; denetimin çalıştığı runtime bu sınırı karşılamalı.",
);
check(
  "PINNED_NODE",
  [".nvmrc", ".node-version"].every((file) =>
    /^24\.\d+\.\d+$/.test(
      readFileSync(path.join(repoRoot, file), "utf8").trim(),
    ),
  ),
  "Node yama sürümü iki dosyada kesin olarak sabitlenmeli; yalnızca ana sürüm yeterli değil.",
);
check(
  "EXACT_DEPENDENCIES",
  Object.values({ ...pkg.dependencies, ...pkg.devDependencies }).every(
    (version) => /^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(version),
  ),
  "npm bağımlılıkları tam sürüm olmalı.",
);
const envErrors = validateProductionEnvironment(
  loadProductionEnvironment(),
  Boolean(pkg.dependencies?.payload),
);
check(
  "PRODUCTION_ENV",
  envErrors.length === 0,
  envErrors.length
    ? envErrors.join(" ")
    : "Başlangıç değişkenlerinin biçimi geçerli; bağlantı erişimi bu kontrolün kapsamı dışında.",
);
check(
  "MOCK_FLAG_OFF",
  !/USE_MOCK_CONTENT\s*=\s*true/.test(config),
  "Örnek içerik bayrağı kapatılmalı ve gerçek veri kaynağı bağlanmalı.",
);
check(
  "REAL_PORTRAIT",
  existsSync(path.join(repoRoot, "public/images/portrait.jpg")),
  "İzinli gerçek portre dosyası gerekli.",
);
check(
  "CMS_INSTALLED",
  Boolean(
    pkg.dependencies?.payload && pkg.dependencies?.["@payloadcms/db-postgres"],
  ),
  "Payload ve PostgreSQL adapteri kurulu ve doğrulanmış olmalı.",
);
const manifestPath = path.join(
  repoRoot,
  ".next/server/app-paths-manifest.json",
);
const hasBuild =
  existsSync(path.join(repoRoot, ".next/BUILD_ID")) && existsSync(manifestPath);
check(
  "BUILD_EXISTS",
  hasBuild,
  "Audit, güncel npm run build sonrasında çalıştırılmalı.",
);
const routes = hasBuild
  ? Object.keys(readJson(".next/server/app-paths-manifest.json"))
      .map((route) =>
        route
          .split("/")
          .filter((part) => part && !part.startsWith("("))
          .join("/")
          .replace(/\/(page|route)$/, "")
          .replace(/^(page|route)$/, ""),
      )
      .map((route) => `/${route}`)
  : [];
for (const route of [
  "/",
  "/blog",
  "/blog/[slug]",
  "/tarifler",
  "/tarifler/[slug]",
  "/api/health",
  "/robots.txt",
  "/sitemap.xml",
  "/blog/rss.xml",
])
  check(
    `ROUTE_${route}`,
    routes.includes(route),
    `${route}: production route'u gerekli.`,
  );
check(
  "ADMIN_ROUTE",
  routes.some((route) => route.startsWith("/admin")),
  "Yönetici giriş route'u gerekli.",
);
const htmlPath = path.join(repoRoot, ".next/server/app/index.html");
if (existsSync(htmlPath)) {
  const html = readFileSync(htmlPath, "utf8");
  for (const marker of findSampleMarkers(html))
    check(
      marker,
      false,
      "Derlenmiş ana sayfada örnek içerik bulundu; eşleşen değerler yazdırılmadı.",
    );
  const missingAlt = [...html.matchAll(/<img\b[^>]*>/gi)].filter(
    (match) => !/\balt\s*=\s*["'][^"']+["']/i.test(match[0]),
  ).length;
  check(
    "BUILT_IMAGE_ALT",
    missingAlt === 0,
    `Derlenmiş ana sayfada eksik/boş alt metin sayısı: ${missingAlt}.`,
  );
  check(
    "BUILT_META_DESCRIPTION",
    [...html.matchAll(/<meta\b[^>]*>/gi)].some((match) => {
      const a = attributes(match[0]);
      return a.name === "description" && Boolean(a.content?.trim());
    }),
    "Derlenmiş ana sayfanın meta açıklaması olmalı; CMS sayfaları ayrıca denetlenmeli.",
  );
} else
  check(
    "BUILT_CONTENT_SCAN",
    false,
    "Statik ana sayfa bulunamadı; dinamik CMS içeriği için CMS denetleyicisi bağlanmalı.",
  );
// CMS yokken gerçek kayıtları varmış gibi değerlendirmeyin: bu adımlar kapalı kalır.
for (const [id, detail] of [
  [
    "CMS_CONTENT_AUDIT",
    "Canlı kayıt denetleyicisi bağlı değil: Site Ayarları zorunlu alanları, örnek kayıtlar, yayın metadatası ve medya alt metinleri doğrulanamadı.",
  ],
  [
    "LEGAL_PAGES",
    "KVKK/gizlilik CMS kayıtları ve gerçek içerikleri doğrulanamadı.",
  ],
  [
    "BACKUP_RESTORE_PROVEN",
    "Şifreli yedek hedefi ve temiz DB'ye başarılı geri yükleme kanıtı bekleniyor.",
  ],
  [
    "STAGING_VERIFIED",
    "Sağlayıcı, staging adresi ve staging smoke/rollback sonuçları bekleniyor.",
  ],
])
  check(id, false, detail);
const failed = results.filter((result) => result.status === "failed");
const report = {
  generatedAt: new Date().toISOString(),
  decision: failed.length ? "NO-GO" : "GO",
  results,
};
mkdirSync(path.join(repoRoot, ".reports"), { recursive: true });
writeFileSync(
  path.join(repoRoot, ".reports/launch-audit.json"),
  JSON.stringify(report, null, 2),
);
for (const result of results)
  console.log(
    `[${result.status === "passed" ? "GEÇTİ" : "KALDI"}] ${result.id}: ${result.detail}`,
  );
console.log(
  `Yayın kararı: ${report.decision}; ${failed.length} engel. .reports/launch-audit.json`,
);
process.exitCode = failed.length ? 1 : 0;
