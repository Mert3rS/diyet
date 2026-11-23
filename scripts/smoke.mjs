import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  repoRoot,
  safeBaseUrl,
  attributes,
  metaRobots,
  productionUrl,
} from "./lib/ops.mjs";

async function run() {
  const args = process.argv.slice(2);
  const base = safeBaseUrl(args[0]);
  const indexing = args.includes("--indexing=on") ? "on" : "off";
  const production = ["gunayturan.com.tr", "www.gunayturan.com.tr"].includes(
    base.hostname,
  );
  const results = [];
  const responses = new Map();
  function record(id, status, detail) {
    results.push({ id, status, detail });
  }
  async function request(url) {
    try {
      const response = await fetch(url, {
        redirect: "manual",
        signal: AbortSignal.timeout(10000),
      });
      return {
        status: response.status,
        headers: response.headers,
        html: await response.text(),
      };
    } catch {
      return { status: 0, headers: new Headers(), html: "" };
    }
  }
  for (const route of [
    "/",
    "/blog",
    "/tarifler",
    "/admin",
    "/api/health",
    "/robots.txt",
    "/sitemap.xml",
  ]) {
    const result = await request(new URL(route, base));
    responses.set(route, result);
    record(
      `HTTP_${route}`,
      result.status === 200 ? "passed" : "failed",
      `${route}: HTTP ${result.status || "erişilemedi"}`,
    );
  }
  const home = responses.get("/");
  record(
    "INDEXING_META",
    /noindex/i.test(metaRobots(home.html)) === (indexing === "off")
      ? "passed"
      : "failed",
    `Beklenen indeksleme modu: ${indexing}.`,
  );
  const robots = responses.get("/robots.txt");
  record(
    "ROBOTS_POLICY",
    robots.status === 200 &&
      (indexing === "off"
        ? /^Disallow:\s*\/\s*$/im.test(robots.html)
        : !/^Disallow:\s*\/\s*$/im.test(robots.html)) &&
      /Disallow:\s*\/admin/im.test(robots.html)
      ? "passed"
      : "failed",
    "robots.txt indeksleme ve /admin politikasına uymalı.",
  );
  const sitemap = responses.get("/sitemap.xml");
  const locs = [...sitemap.html.matchAll(/<loc>([^<]+)<\/loc>/gi)].map(
    (match) => match[1],
  );
  record(
    "SITEMAP_POLICY",
    sitemap.status === 200 &&
      (indexing === "off" ? locs.length === 0 : locs.length > 0) &&
      locs.every(
        (loc) => loc.startsWith(`${productionUrl}/`) && !loc.includes("/admin"),
      )
      ? "passed"
      : "failed",
    "Sitemap yalnızca izinli yayın URL'lerini içermeli; indeksleme kapalıyken boş olmalı.",
  );
  const admin = responses.get("/admin");
  record(
    "ADMIN_NOINDEX",
    admin.status === 200 &&
      /noindex/i.test(
        `${metaRobots(admin.html)} ${admin.headers.get("x-robots-tag") || ""}`,
      )
      ? "passed"
      : "failed",
    "Admin giriş sayfası erişilebilir ve noindex olmalı.",
  );
  const health = responses.get("/api/health");
  let healthy = false;
  try {
    const data = JSON.parse(health.html);
    healthy = health.status === 200 && data.status === "ok";
  } catch {
    /* Ayrıntılı yanıtı günlüğe yazmayın. */
  }
  record(
    "HEALTH",
    healthy ? "passed" : "failed",
    "Uygulama + DB hazır olmalı; sağlık yanıtının içeriği yazdırılmadı.",
  );
  for (const [header, expected] of [
    ["x-content-type-options", "nosniff"],
    ["referrer-policy", "strict-origin-when-cross-origin"],
    ["x-frame-options", "DENY"],
  ])
    record(
      `HEADER_${header}`,
      home.headers.get(header) === expected ? "passed" : "failed",
      `${header}: beklenen başlık ${home.headers.get(header) === expected ? "var" : "yok/farklı"}.`,
    );
  record(
    "CSP",
    home.headers.has("content-security-policy") ? "passed" : "failed",
    "CSP politikası ve Payload uyumluluğu ayrıca doğrulanmalı.",
  );
  record(
    "CANONICAL",
    [...home.html.matchAll(/<link\b[^>]*>/gi)].some((match) => {
      const a = attributes(match[0]);
      return a.rel === "canonical" && a.href === `${productionUrl}/`;
    })
      ? "passed"
      : "failed",
    "Ana sayfa canonical adresi doğrulanmalı.",
  );
  const queue = ["/"];
  const visited = new Map();
  const anchors = [];
  let anchorFailures = 0;
  let placeholderSocials = 0;
  while (queue.length && visited.size < 50) {
    const route = queue.shift();
    if (visited.has(route)) continue;
    const response =
      responses.get(route) || (await request(new URL(route, base)));
    visited.set(route, response);
    if (response.status !== 200) {
      record(`LINK_${route}`, "failed", "İç sayfa HTTP 200 dönmedi.");
      continue;
    }
    for (const match of response.html.matchAll(/<a\b[^>]*>/gi)) {
      const a = attributes(match[0]);
      if (!a.href) continue;
      if (a.class?.split(/\s+/).includes("social-link")) {
        try {
          const url = new URL(a.href);
          if (
            url.protocol !== "https:" ||
            url.hostname.endsWith(".invalid") ||
            url.username ||
            url.password
          )
            placeholderSocials++;
        } catch {
          placeholderSocials++;
        }
      }
      let target;
      try {
        target = new URL(a.href, new URL(route, base));
      } catch {
        continue;
      }
      if (
        target.origin !== base.origin ||
        target.search ||
        /^\/(api|admin)(\/|$)/.test(target.pathname)
      )
        continue;
      if (target.hash)
        anchors.push({ route: target.pathname, hash: target.hash });
      if (!visited.has(target.pathname) && !queue.includes(target.pathname))
        queue.push(target.pathname);
    }
  }
  for (const anchor of anchors) {
    let id;
    try {
      id = decodeURIComponent(anchor.hash.slice(1));
    } catch {
      anchorFailures++;
      continue;
    }
    const page = visited.get(anchor.route);
    if (!page || page.status !== 200 || !page.html.includes(`id="${id}"`))
      anchorFailures++;
  }
  record(
    "INTERNAL_ANCHORS",
    anchorFailures === 0 ? "passed" : "failed",
    `Sayfa içi eksik hedef: ${anchorFailures}; taranan sayfa: ${visited.size}.`,
  );
  record(
    "SOCIAL_LINKS",
    placeholderSocials === 0 ? "passed" : "failed",
    `Güvensiz/örnek sosyal bağlantı: ${placeholderSocials}. Haricî hesaplara istek yapılmadı; hesap sahipliği/erişilebilirlik doğrulanmış sayılmaz.`,
  );
  if (queue.length)
    record(
      "CRAWL_LIMIT",
      "not_done",
      "50 sayfa sınırına ulaşıldı; kalan sayfalar kontrol edilmedi.",
    );
  for (const flag of ["--post", "--recipe"]) {
    const index = args.indexOf(flag);
    const route = index >= 0 ? args[index + 1] : null;
    if (!route) {
      record(
        flag.slice(2),
        "not_done",
        "Gerçek yayındaki örnek içerik yolu sağlanmadı.",
      );
      continue;
    }
    if (!/^\/(blog|tarifler)\/[a-z0-9-]+$/.test(route))
      throw new Error(
        "Örnek içerik yolu güvenli bir blog/tarif slug'ı olmalı.",
      );
    const result = await request(new URL(route, base));
    record(
      flag.slice(2),
      result.status === 200 ? "passed" : "failed",
      "Verilen içerik sayfası kontrol edildi; yol içeriği yazdırılmadı.",
    );
  }
  if (production) {
    for (const source of [
      "http://gunayturan.com.tr/",
      "http://www.gunayturan.com.tr/",
      "https://www.gunayturan.com.tr/",
    ]) {
      const response = await request(source);
      let destination;
      try {
        destination = new URL(response.headers.get("location"), source).href;
      } catch {
        destination = "";
      }
      record(
        `REDIRECT_${new URL(source).protocol}_${new URL(source).hostname}`,
        [301, 308].includes(response.status) &&
          destination === `${productionUrl}/`
          ? "passed"
          : "failed",
        "Tek adım kalıcı canonical yönlendirmesi beklenir; DNS/TLS başarısızlığı da başarısız sayılır.",
      );
    }
  } else
    record(
      "PRODUCTION_REDIRECTS",
      "not_done",
      "Yerel/staging testinde production alan adına istek yapılmadı; DNS kesimi sonrası ayrıca çalıştırılmalı.",
    );
  mkdirSync(path.join(repoRoot, ".reports"), { recursive: true });
  writeFileSync(
    path.join(repoRoot, ".reports/smoke.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        targetOrigin: base.origin,
        results,
      },
      null,
      2,
    ),
  );
  for (const result of results)
    console.log(
      `[${result.status === "passed" ? "GEÇTİ" : result.status === "failed" ? "KALDI" : "YAPILAMADI"}] ${result.id}: ${result.detail}`,
    );
  process.exitCode = results.some((result) => result.status !== "passed")
    ? 1
    : 0;
}
run().catch(() => {
  console.error(
    "Smoke çalıştırılamadı. Kullanım: npm run smoke -- <kök-adres> [--post /blog/slug] [--recipe /tarifler/slug] [--indexing=on|off]. Hassas değerler yazdırılmadı.",
  );
  process.exitCode = 1;
});
