import { test, expect } from "@playwright/test";
import { readFileSync, existsSync } from "node:fs";
import { parseEnv } from "node:util";
import { DEFAULT_MESSAGE_TEMPLATE } from "../../src/content/body-analysis";

const credentialsFile = process.env.CMS_TEST_ENV_FILE || ".env.cms.local";
const credentials = existsSync(credentialsFile)
  ? parseEnv(readFileSync(credentialsFile, "utf8"))
  : {};

test("CMS: anonim ziyaretçi yönetici ve içerik yazma erişimi alamaz", async ({
  request,
}) => {
  expect((await request.get("/api/users")).status()).toBe(403);
  expect(
    (
      await request.post("/api/globals/homepage", { data: { isMock: false } })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/media", { data: { alt: "Unauthorized" } })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/users/first-register", {
        data: {
          email: "blocked@example.invalid",
          password: "not-a-real-password",
        },
      })
    ).status(),
  ).toBe(403);
});

test("CMS: panelden kaydetme, görsel yükleme, doğrulama ve sosyal görünürlük siteye yansır", async ({
  page,
  baseURL,
}) => {
  test.setTimeout(180000);
  test.skip(
    !credentials.CMS_ADMIN_EMAIL || !credentials.CMS_ADMIN_PASSWORD,
    "Yerel CMS hesabı hazırlanmalı.",
  );
  await page.goto("/admin/login");
  await page.locator('input[name="email"]').fill(credentials.CMS_ADMIN_EMAIL!);
  await page
    .locator('input[name="password"]')
    .fill(credentials.CMS_ADMIN_PASSWORD!);
  await page.locator('button[type="submit"]').click();
  await expect(page.locator(".admin-welcome")).toBeVisible({ timeout: 60000 });
  const request = page.context().request;
  const headers = { Origin: baseURL! };
  const home = await (await request.get("/api/globals/homepage")).json();
  const site = await (
    await request.get("/api/globals/site-settings?depth=0")
  ).json();
  let mediaId: number | undefined;
  try {
    await page.goto("/admin/globals/homepage");
    await page
      .locator('input[name="copy.hero.first"]')
      .fill("Yönetimden gelen başlık.");
    const saved = page.waitForResponse(
      (r) =>
        r.url().includes("/api/globals/homepage") &&
        r.request().method() === "POST",
    );
    await page.getByRole("button", { name: "Kaydet", exact: true }).click();
    expect((await saved).ok()).toBe(true);
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Yönetimden gelen başlık.");
    await expect(page.locator(".social-edge")).toHaveCount(0);
    await expect(page.locator(".floating-socials a")).toHaveCount(2);

    const invalid = await request.post("/api/globals/site-settings", {
      headers,
      data: {
        social: {
          ...site.social,
          instagramIsMock: false,
          instagramUrl: "https://attacker.example/instagram",
        },
      },
    });
    expect(invalid.status()).toBe(400);
    const invalidText = await request.post("/api/globals/homepage", {
      headers,
      data: {
        copy: {
          ...home.copy,
          hero: { ...home.copy.hero, first: "<script>alert(1)</script>" },
        },
      },
    });
    expect(invalidText.status()).toBe(400);

    const uploaded = await request.post("/api/media", {
      headers,
      multipart: {
        _payload: JSON.stringify({ alt: "CMS görsel kontrolü" }),
        file: {
          name: "cms-verification.webp",
          mimeType: "image/webp",
          buffer: readFileSync("public/images/fruit.webp"),
        },
      },
    });
    expect(uploaded.status()).toBe(201);
    const media = (await uploaded.json()).doc;
    mediaId = media.id;
    expect(
      (
        await request.post("/api/globals/site-settings", {
          headers,
          data: {
            photos: { ...site.photos, fruit: media.id },
            social: {
              ...site.social,
              instagramVisible: false,
              whatsappVisible: false,
            },
          },
        })
      ).ok(),
    ).toBe(true);
    await page.goto("/");
    await expect(page.locator(".social-links")).toHaveCount(0);
    await expect(page.locator(".floating-socials")).toHaveCount(0);
    await expect(
      page.locator('img[alt="CMS görsel kontrolü"]').first(),
    ).toHaveAttribute("src", /api%2Fmedia%2Ffile/);
    expect((await request.get(media.url)).status()).toBe(200);
    expect(
      (
        await request.get(
          `/_next/image?url=${encodeURIComponent(media.url)}&w=640&q=75`,
        )
      ).status(),
    ).toBe(200);
    const users = await (await request.get("/api/users")).json();
    if (users.totalDocs === 1) {
      expect(
        (
          await request.delete(`/api/users/${users.docs[0].id}`, { headers })
        ).status(),
      ).toBe(400);
    }
    await page.goto("/admin/globals/body-analysis-settings");
    await expect(page.locator(".admin-analysis-guide")).toBeVisible();
    expect(
      (
        await request.post("/api/globals/body-analysis-settings", {
          headers,
          data: { messageTemplate: "<script>invalid</script> {unknown}" },
        })
      ).status(),
    ).toBe(400);
    await page
      .getByRole("button", { name: "WhatsApp mesajı", exact: true })
      .click();
    const template = page.locator('textarea[name="messageTemplate"]');
    await template.fill("Test önizleme: {ad} için bilgi almak istiyorum.");
    await expect(page.locator(".admin-analysis-guide pre")).toContainText(
      "Test önizleme:",
    );
    await page
      .getByRole("button", { name: "Şablonu varsayılana sıfırla", exact: true })
      .click();
    await expect(template).toHaveValue(DEFAULT_MESSAGE_TEMPLATE);
  } finally {
    expect(
      (
        await request.post("/api/globals/homepage", { headers, data: home })
      ).ok(),
    ).toBe(true);
    expect(
      (
        await request.post("/api/globals/site-settings", {
          headers,
          data: site,
        })
      ).ok(),
    ).toBe(true);
    if (mediaId)
      expect(
        (await request.delete(`/api/media/${mediaId}`, { headers })).ok(),
      ).toBe(true);
  }
});
