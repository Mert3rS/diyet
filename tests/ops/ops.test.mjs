import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  findSampleMarkers,
  loadProductionEnvironment,
  validateProductionEnvironment,
  safeBaseUrl,
  attributes,
  metaRobots,
} from "../../scripts/lib/ops.mjs";
import { findSecretSignatures } from "../../scripts/lib/secret-signatures.mjs";

test("production URL ve CMS sırları değerleri yazdırmadan doğrulanır", () => {
  assert.equal(
    validateProductionEnvironment({ SITE_URL: "https://gunayturan.com.tr" })
      .length,
    0,
  );
  for (const SITE_URL of [
    undefined,
    "http://gunayturan.com.tr",
    "https://www.gunayturan.com.tr",
    "https://gunayturan.com.tr/?token=private",
    "https://gunayturan.com.tr.evil.invalid",
  ])
    assert.ok(validateProductionEnvironment({ SITE_URL }).length);
  const errors = validateProductionEnvironment(
    {
      SITE_URL: "https://gunayturan.com.tr",
      PAYLOAD_SECRET: "CHANGE_ME",
      DATABASE_URI: "postgresql://private:secret@example.invalid/db",
    },
    true,
  );
  assert.equal(errors.length, 2);
  assert.ok(!errors.join().includes("private:secret"));
});
test("Render adresi yalnız platform ortamında kabul edilir; yerel dosya deposuna düşülmez", () => {
  const env = {
    RENDER: "true",
    RENDER_EXTERNAL_URL: "https://gunay-turan.onrender.com",
    PAYLOAD_SECRET: "a".repeat(48),
    DATABASE_URI: "postgresql://user:password@db:5432/diyet",
    MEDIA_STORAGE: "s3",
    S3_BUCKET: "site-media",
    S3_ENDPOINT: "https://project.storage.supabase.co/storage/v1/s3",
    S3_REGION: "eu-central-1",
    S3_ACCESS_KEY_ID: "test-access",
    S3_SECRET_ACCESS_KEY: "test-private",
  };
  assert.deepEqual(validateProductionEnvironment(env, true), []);
  assert.ok(
    validateProductionEnvironment({ ...env, RENDER: undefined }, false).length,
  );
  for (const address of [
    "http://gunay-turan.onrender.com",
    "https://gunay-turan.onrender.com.attacker.invalid",
    "https://gunay-turan.onrender.com/?token=private",
  ]) {
    assert.ok(
      validateProductionEnvironment(
        { ...env, RENDER_EXTERNAL_URL: address },
        false,
      ).length,
    );
  }
  assert.ok(
    validateProductionEnvironment(
      { ...env, MEDIA_STORAGE: undefined },
      true,
    ).some((error) => error.startsWith("MEDIA_STORAGE:")),
  );
  assert.ok(
    validateProductionEnvironment(
      { ...env, S3_SECRET_ACCESS_KEY: undefined },
      true,
    ).some((error) => error.startsWith("S3_SECRET_ACCESS_KEY:")),
  );
  assert.ok(
    validateProductionEnvironment(
      { ...env, S3_ENDPOINT: "http://storage.internal" },
      true,
    ).some((error) => error.startsWith("S3_ENDPOINT:")),
  );
});

test("ortam dosyalarında process ve üretim dosyası önceliği korunur", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "diyet-ops-"));
  try {
    writeFileSync(
      path.join(root, ".env.production.local"),
      "SITE_URL=https://production.invalid\nLOCAL_VALUE=production\nNODE_ENV=development\n",
    );
    writeFileSync(
      path.join(root, ".env.local"),
      "SITE_URL=http://localhost:3000\nLOCAL_VALUE=local\n",
    );
    const env = { SITE_URL: "https://injected.invalid" };
    loadProductionEnvironment(root, env);
    assert.equal(env.SITE_URL, "https://injected.invalid");
    assert.equal(env.LOCAL_VALUE, "production");
    assert.equal(env.NODE_ENV, undefined);
  } finally {
    const resolved = path.resolve(root);
    if (
      !resolved.startsWith(`${path.resolve(os.tmpdir())}${path.sep}`) ||
      !path.basename(resolved).startsWith("diyet-ops-")
    )
      throw new Error("Test temizlik hedefi izinli geçici klasörün dışında.");
    rmSync(resolved, { recursive: true, force: true });
  }
});
test("örnek kayıt, sahte hesap ve portre işaretleri bulunur", () => {
  assert.ok(findSampleMarkers('{\\"isMock\\":true}').includes("SAMPLE_RECORD"));
  assert.ok(
    findSampleMarkers("example.invalid +90 5XX Fotoğraf yakında").includes(
      "SAMPLE_PHONE",
    ),
  );
  assert.equal(findSampleMarkers("Onaylı gerçek içerik").length, 0);
});
test("smoke hedefi URL içine gömülü sır ve sorguyu reddeder", () => {
  assert.equal(
    safeBaseUrl("http://127.0.0.1:3015").origin,
    "http://127.0.0.1:3015",
  );
  for (const value of [
    "https://user:secret@host.invalid",
    "https://host.invalid/?email=private",
    "javascript:alert(1)",
  ])
    assert.throws(() => safeBaseUrl(value));
  assert.equal(
    attributes('<a href="/blog?x=1&amp;y=2" class="social-link">').href,
    "/blog?x=1&y=2",
  );
  assert.equal(
    metaRobots('<meta content="noindex, nofollow" name="robots">'),
    "noindex, nofollow",
  );
});
test("sır bulgusu değer yerine yalnızca konum ve imza kodunu döndürür", () => {
  const fakeToken = ["gh", "p_", "a".repeat(36)].join("");
  const result = findSecretSignatures(`token: ${fakeToken}`);
  assert.deepEqual(result, [{ code: "GITHUB_TOKEN", line: 1 }]);
  assert.ok(!JSON.stringify(result).includes(fakeToken));
  assert.deepEqual(
    findSecretSignatures("PAYLOAD_SECRET=CHANGE_ME_LONG_RANDOM_VALUE"),
    [],
  );
});
