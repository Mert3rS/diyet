import assert from "node:assert/strict";
import { safeBaseUrl } from "./lib/ops.mjs";

// Narrow container smoke, separate from the full launch audit for future CMS/routes.
const base = safeBaseUrl(process.argv[2] || "http://127.0.0.1:3000");
const request = (pathname) =>
  fetch(new URL(pathname, base), {
    signal: AbortSignal.timeout(15000),
    redirect: "manual",
  });
try {
  const home = await request("/");
  assert.equal(home.status, 200, "Ana sayfa HTTP 200 dönmeli.");
  assert.equal(home.headers.get("x-content-type-options"), "nosniff");
  assert.equal(home.headers.get("x-frame-options"), "DENY");
  const html = await home.text();
  const health = await request("/api/health");
  assert.equal(health.status, 200, "CMS ve DB hazır olmalı.");
  assert.equal((await health.json()).status, "ok");
  const login = await request("/admin/login");
  assert.equal(login.status, 200, "Yönetici giriş ekranı yüklenmeli.");
  const loginHtml = await login.text();
  assert.match(loginHtml, /noindex/);
  const forbidden = await request("/api/users");
  assert.equal(forbidden.status, 403, "Yönetici kayıtları herkese açılmamalı.");
  await forbidden.body?.cancel();
  assert.match(html, /<html[^>]+lang="tr"/);
  assert.match(html, /noindex/);
  assert.doesNotMatch(html, /id="analiz"/); // Tool stays off by default in production.
  assert.doesNotMatch(html, /href="#analiz"/);
  const assets = [
    ...new Set(
      [
        ...html.matchAll(/(?:src|href)="([^"?#]+\.(?:js|css|woff2))[^" ]*"/g),
      ].map((match) => match[1]),
    ),
  ];
  assert.ok(assets.length > 0, "Statik dosyalar bulunmalı.");
  for (const asset of assets) {
    const response = await request(asset);
    assert.equal(response.status, 200, "Statik dosya yüklenmeli.");
    await response.body?.cancel();
  }
  const image = await request(
    "/_next/image?url=%2Fimages%2Fsalad.webp&w=640&q=75",
  );
  assert.equal(
    image.status,
    200,
    "Linux imajında görsel optimizasyonu çalışmalı.",
  );
  assert.match(image.headers.get("content-type") || "", /^image\//);
  await image.body?.cancel();
  const missing = await request("/container-smoke-missing-page");
  assert.equal(missing.status, 404);
  await missing.body?.cancel();
  console.log(
    `Konteyner kontrolü geçti: CMS/DB health, admin girişi ve erişim, ana sayfa, ${assets.length} statik dosya, görsel optimizasyonu, güvenlik başlıkları ve 404.`,
  );
} catch {
  console.error(
    "Konteyner kontrolü başarısız. Genel durum/varlık kontrollerini inceleyin; ortam değerleri yazdırılmadı.",
  );
  process.exitCode = 1;
}
