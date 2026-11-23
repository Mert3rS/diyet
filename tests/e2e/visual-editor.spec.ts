import { test, expect, type Page } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { parseEnv } from "node:util";

const credentialsFile = process.env.CMS_TEST_ENV_FILE || ".env.cms.local";
const credentials = existsSync(credentialsFile)
  ? parseEnv(readFileSync(credentialsFile, "utf8"))
  : {};
async function login(page: Page) {
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
  await expect(page.locator(".admin-welcome")).toBeVisible();
  await page.goto("/admin/visual-editor");
  await expect(page.locator("#ve-text")).toBeVisible();
  await expect(
    page
      .frameLocator("iframe")
      .locator('[data-editor-field="homepage:copy.hero.first"]'),
  ).toBeVisible();
}

test("görsel düzenleyici anonim ziyaretçiye açılmaz; yalnız önizleme aynı sitede çerçevelenebilir", async ({
  page,
  request,
}) => {
  await page.goto("/admin/visual-editor");
  await expect(page).toHaveURL(/\/admin\/login/);
  expect((await request.get("/")).headers()["x-frame-options"]).toBe("DENY");
  const preview = await request.get("/?editor=1");
  expect(preview.headers()["x-frame-options"]).toBe("SAMEORIGIN");
  expect(preview.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'self'",
  );
});

test("sayfadan yazı ve fotoğraf seçilir, taslak anında görünür, kaydedince yayınlanır", async ({
  page,
  baseURL,
}) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 1680, height: 1100 });
  await login(page);
  const request = page.context().request;
  const headers = { Origin: baseURL! };
  const home = await (await request.get("/api/globals/homepage")).json();
  const site = await (
    await request.get("/api/globals/site-settings?depth=0")
  ).json();
  const preview = page.frameLocator("iframe");
  let mediaId: number | undefined;
  try {
    await preview.locator("#hero-title .word-mask:nth-child(2) > span").click();
    await expect(page.locator("#ve-field")).toHaveValue(
      "homepage:copy.hero.second",
    );
    await page.locator("#ve-text").fill("Önizlemede değişen başlık.");
    await expect(preview.locator("#hero-title")).toContainText(
      "Önizlemede değişen başlık.",
    );
    expect(
      (await (await request.get("/api/globals/homepage")).json()).copy.hero
        .second,
    ).toBe(home.copy.hero.second);
    await page
      .getByRole("button", { name: "Bu alandaki değişikliği geri al" })
      .click();
    await expect(preview.locator("#hero-title")).toContainText(
      home.copy.hero.second,
    );
    await page.locator("#ve-text").fill("Görerek düzenlenen başlık.");

    await preview.locator(".collage-main img").click();
    await expect(page.locator("#ve-field")).toHaveValue(
      "site-settings:photos.salad",
    );
    await page.locator("#ve-alt").fill("Görsel düzenleyici test fotoğrafı");
    const uploaded = page.waitForResponse(
      (response) =>
        response.url().endsWith("/api/media") &&
        response.request().method() === "POST",
    );
    await page
      .locator('input[type="file"]')
      .setInputFiles("public/images/fruit.webp");
    const image = (await (await uploaded).json()).doc;
    mediaId = image.id;
    await expect(preview.locator(".collage-main img")).toHaveAttribute(
      "src",
      image.url,
    );
    expect(
      (await (await request.get("/api/globals/site-settings?depth=0")).json())
        .photos.salad,
    ).toEqual(site.photos.salad);
    await page.getByRole("button", { name: "Mobil", exact: true }).click();
    await expect(page.locator("iframe")).toHaveCSS("width", "390px");
    await page.getByRole("button", { name: "Masaüstü", exact: true }).click();
    await page.screenshot({
      path: "test-results/visual-editor-desktop.png",
      fullPage: true,
    });
    await page
      .getByRole("button", { name: "Değişiklikleri kaydet", exact: true })
      .click();
    await expect(page.locator(".ve-message--success")).toContainText(
      "kaydedildi ve sitede yayınlandı",
    );
    expect(
      (await (await request.get("/api/globals/homepage")).json()).copy.hero
        .second,
    ).toBe("Görerek düzenlenen başlık.");
    expect(
      (await (await request.get("/api/globals/site-settings?depth=0")).json())
        .photos.salad,
    ).toBe(mediaId);
    const published = await page.context().newPage();
    await published.goto("/");
    await expect(published.locator("h1")).toContainText(
      "Görerek düzenlenen başlık.",
    );
    await expect(published.locator(".collage-main img")).toHaveAttribute(
      "alt",
      image.alt,
    );
    await expect(published.locator("[data-editor-field]")).toHaveCount(0);
    await published.close();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Mobil", exact: true }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: "test-results/visual-editor-mobile.png",
      fullPage: true,
    });
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

test("dinamik bölümler doğru alanı açar; bölüm metni kart metinlerini değiştirmez", async ({
  page,
}) => {
  await login(page);
  const preview = page.frameLocator("iframe");
  const home = await (await page.request.get("/api/globals/homepage")).json();
  await page.locator("#ve-section").selectOption("Süreç");
  await page.locator("#ve-text").fill("Süreç için yeni üst yazı");
  await expect(preview.locator(".process-sticky > .eyebrow")).toHaveText(
    "Süreç için yeni üst yazı",
  );
  await expect(
    preview.locator(".process-step").first().locator(".eyebrow"),
  ).toHaveText(home.process[0].title);
  await page
    .getByRole("button", { name: "Bu alandaki değişikliği geri al" })
    .click();
  await page.locator("#ve-section").selectOption("Hedefler");
  await page.locator("#ve-field").selectOption("homepage:goals.1.message");
  await expect(preview.locator("[data-goal-message]")).toHaveText(
    home.goals[1].message,
  );
  await page.locator("#ve-text").fill("İkinci hedefin taslak mesajı");
  await expect(preview.locator("[data-goal-message]")).toHaveText(
    "İkinci hedefin taslak mesajı",
  );
  await page.locator("#ve-field").selectOption("homepage:goals.0.message");
  await expect(preview.locator("[data-goal-message]")).toHaveText(
    home.goals[0].message,
  );
  await page.locator("#ve-field").selectOption("homepage:goals.1.message");
  await expect(preview.locator("[data-goal-message]")).toHaveText(
    "İkinci hedefin taslak mesajı",
  );
  await page
    .getByRole("button", { name: "Bu alandaki değişikliği geri al" })
    .click();
  await expect(preview.locator("[data-goal-message]")).toHaveText(
    home.goals[1].message,
  );
  await page.locator("#ve-section").selectOption("Yorumlar");
  await page.locator("#ve-field").selectOption("homepage:testimonials.2.quote");
  await expect(preview.locator("blockquote")).toHaveText(
    home.testimonials[2].quote,
  );
  await page.locator("#ve-text").fill("Üçüncü yorumun taslağı");
  await expect(preview.locator("blockquote")).toHaveText(
    "Üçüncü yorumun taslağı",
  );
  await page
    .getByRole("button", { name: "Bu alandaki değişikliği geri al" })
    .click();
  await page.locator("#ve-section").selectOption("Blog");
  await page.locator("#ve-field").selectOption("homepage:blog.2.title");
  await page.locator("#ve-text").fill("Üçüncü blog başlığı taslağı");
  await expect(preview.locator(".blog-card").nth(2).locator("h3")).toHaveText(
    "Üçüncü blog başlığı taslağı",
  );
  await page
    .getByRole("button", { name: "Bu alandaki değişikliği geri al" })
    .click();
  await page.locator("#ve-section").selectOption("Sorular");
  await page.locator("#ve-field").selectOption("homepage:faqs.0.answer");
  await expect(preview.locator(".faq-list > details").first()).toHaveAttribute(
    "open",
    "",
  );
  await expect(
    page.getByRole("button", { name: "Değişiklikleri kaydet", exact: true }),
  ).toBeDisabled();
});

test("başka sekmede güncellenen içerik üzerine yazılmaz", async ({
  page,
  baseURL,
}) => {
  await login(page);
  const request = page.context().request;
  const home = await (await request.get("/api/globals/homepage")).json();
  const headers = { Origin: baseURL! };
  try {
    await page.locator("#ve-text").fill("Henüz kaydedilmemiş taslak");
    expect(
      (
        await request.post("/api/globals/homepage", {
          headers,
          data: {
            copy: {
              ...home.copy,
              hero: { ...home.copy.hero, first: "Başka sekmeden kaydedildi" },
            },
          },
        })
      ).ok(),
    ).toBe(true);
    await page
      .getByRole("button", { name: "Değişiklikleri kaydet", exact: true })
      .click();
    await expect(page.locator(".ve-message--error")).toContainText(
      "başka bir sekmede değiştirildi",
    );
    expect(
      (await (await request.get("/api/globals/homepage")).json()).copy.hero
        .first,
    ).toBe("Başka sekmeden kaydedildi");
    await expect(page.locator("#ve-text")).toHaveValue(
      "Henüz kaydedilmemiş taslak",
    );
  } finally {
    expect(
      (
        await request.post("/api/globals/homepage", { headers, data: home })
      ).ok(),
    ).toBe(true);
  }
});
