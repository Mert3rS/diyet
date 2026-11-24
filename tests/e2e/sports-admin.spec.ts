import {
  test,
  expect,
  type Page,
  type APIRequestContext,
} from "@playwright/test";
import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import AxeBuilder from "@axe-core/playwright";

const credentials = parseEnv(
  readFileSync(process.env.CMS_TEST_ENV_FILE || ".env.cms.local", "utf8"),
);
const endpoint = "/api/globals/sports-homepage";
async function login(page: Page) {
  test.skip(
    !credentials.CMS_ADMIN_EMAIL || !credentials.CMS_ADMIN_PASSWORD,
    "Yerel CMS hesabı hazırlanmalı.",
  );
  await page.context().setExtraHTTPHeaders({
    Origin: new URL(test.info().project.use.baseURL as string).origin,
  });
  await page.goto("/admin/login");
  await page.locator('input[name="email"]').fill(credentials.CMS_ADMIN_EMAIL!);
  await page
    .locator('input[name="password"]')
    .fill(credentials.CMS_ADMIN_PASSWORD!);
  await page.locator('button[type="submit"]').click();
  await expect(page.locator(".admin-welcome")).toBeVisible({ timeout: 60000 });
}
async function read(request: APIRequestContext) {
  const response = await request.get(`${endpoint}?depth=0`);
  expect(response.ok()).toBe(true);
  return response.json();
}
async function write(request: APIRequestContext, data: unknown) {
  const response = await request.post(endpoint, { data });
  expect(response.ok(), await response.text()).toBe(true);
}
const contentData = (doc: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(doc).filter(
      ([key]) => !["id", "createdAt", "updatedAt", "initialized"].includes(key),
    ),
  );

test("yeni CMS: anonim yazma, HTML ve yinelenen hizmet kimliği engellenir", async ({
  page,
  request,
}) => {
  expect(
    (
      await request.post(endpoint, { data: { hero: { headline: "yetkisiz" } } })
    ).status(),
  ).toBe(403);
  await page.goto("/admin/visual-editor");
  await expect(page).toHaveURL(/\/admin\/login/);
  expect((await request.get("/")).headers()["x-frame-options"]).toBe("DENY");
  const preview = await request.get("/?editor=1");
  expect(preview.headers()["x-frame-options"]).toBe("SAMEORIGIN");
  expect(preview.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'self'",
  );
  await login(page);
  const api = page.context().request;
  const original = await read(api);
  expect(
    (
      await api.post(endpoint, {
        data: { hero: { ...original.hero, headline: "<script>test</script>" } },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await api.post(endpoint, {
        data: {
          slides: original.slides.map((row: object) => ({
            ...row,
            visible: false,
          })),
        },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await api.post(endpoint, {
        data: {
          services: [
            original.services[0],
            { ...original.services[1], slug: original.services[0].slug },
          ],
        },
      })
    ).status(),
  ).toBe(400);
  expect((await read(api)).hero.headline).toBe(original.hero.headline);
});

test("native panel formundan kaydedilen başlık sitede görünür", async ({
  page,
}) => {
  await login(page);
  const api = page.context().request;
  const original = await read(api);
  try {
    await page.goto("/admin/globals/sports-homepage");
    const input = page.locator('input[name="hero.headline"]');
    await expect(input).toHaveValue(original.hero.headline);
    await input.fill("Panelden kaydedilen ana başlık.");
    const saved = page.waitForResponse(
      (r) => r.url().includes(endpoint) && r.request().method() === "POST",
    );
    await page.getByRole("button", { name: "Kaydet", exact: true }).click();
    expect((await saved).ok()).toBe(true);
    await page.goto("/");
    await expect(page.locator("h1")).toHaveText(
      "Panelden kaydedilen ana başlık.",
    );
  } finally {
    await write(api, { hero: original.hero });
  }
});

test("CMS: tüm yeni bölümler, kart sırası, görünürlük ve özel görseller siteye yansır", async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await login(page);
  const api = page.context().request;
  const original = await read(api);
  const draft = structuredClone(original);
  let photoId: number | undefined;
  try {
    const upload = await api.post("/api/media", {
      multipart: {
        _payload: JSON.stringify({ alt: "Yeni tasarım test görseli" }),
        file: {
          name: "sports-admin-test.webp",
          mimeType: "image/webp",
          buffer: readFileSync("public/images/fruit.webp"),
        },
      },
    });
    expect(upload.ok()).toBe(true);
    const photo = (await upload.json()).doc;
    photoId = photo.id;
    draft.slides[0].first = "Panelden gelen slayt.";
    draft.slides[0].photo = photo.id;
    draft.dashboard.title = "Panelden gelen pano";
    draft.copy.audience.title = "Panelden gelen hedefler";
    draft.copy.about.bio = "Panelde düzenlenen örnek biyografi.";
    draft.services[0].scope[0].text = "Panelde düzenlenen kapsam maddesi.";
    draft.audiences[0].description = "Panelde düzenlenen hedef açıklaması.";
    draft.method[0].word = "Panelden gelen sistem adımı.";
    draft.events[0].title = "Panelden gelen örnek etkinlik";
    draft.recipes[2].title = "Panelden gelen örnek tarif";
    draft.recipes[2].photo = photo.id;
    draft.recipes = [
      draft.recipes[2],
      ...draft.recipes.filter((_: unknown, index: number) => index !== 2),
    ];
    draft.recipes.at(-1).visible = false;
    draft.socialTiles[1].photo = photo.id;
    draft.socialTiles[1].title = "Panelden gelen sosyal içerik";
    draft.media[0].title = "Panelden gelen video başlığı";
    draft.testimonials[0].quote = "Panelde düzenlenen örnek yorum.";
    draft.faqs[0].answer = "Panelde düzenlenen örnek yanıt.";
    draft.copy.contact.title = "Panelden gelen iletişim";
    await write(api, contentData(draft));
    await page.goto("/");
    await expect(page.locator(".hero-slide-content h2")).toContainText(
      draft.slides[0].first,
    );
    await expect(page.locator(".board-heading h3")).toHaveText(
      draft.dashboard.title,
    );
    await expect(page.locator("#kimler-icin h2")).toContainText(
      draft.copy.audience.title,
    );
    await expect(page.locator(".about-copy")).toContainText(
      draft.copy.about.bio,
    );
    await page.locator("#hizmet-sporcu summary").click();
    await expect(page.locator("#hizmet-sporcu")).toContainText(
      draft.services[0].scope[0].text,
    );
    await expect(page.locator("#sistem")).toContainText(draft.method[0].word);
    await expect(page.locator(".events-grid")).toContainText(
      draft.events[0].title,
    );
    await expect(page.locator(".recipe-card")).toHaveCount(5);
    await expect(page.locator(".recipe-card").first()).toContainText(
      draft.recipes[0].title,
    );
    expect(
      new URL(
        (await page
          .locator(".recipe-card")
          .first()
          .locator("img")
          .getAttribute("src")) as string,
        page.url(),
      ).searchParams.get("url"),
    ).toBe(photo.url);
    await expect(page.locator(".social-bento")).toContainText(
      draft.socialTiles[1].title,
    );
    await expect(page.locator(".social-tile-1 img")).toBeVisible();
    await expect(page.locator(".media-grid")).toContainText(
      draft.media[0].title,
    );
    await expect(page.locator(".testimonial-track")).toContainText(
      draft.testimonials[0].quote,
    );
    await page.locator(".faq-list summary").first().click();
    await expect(page.locator(".faq-list")).toContainText(draft.faqs[0].answer);
    await expect(page.locator("#iletisim h2")).toContainText(
      draft.copy.contact.title,
    );
    await write(api, {
      sections: { ...draft.sections, events: false, dashboard: false },
    });
    await page.reload();
    await expect(
      page.locator(".events-section, .performance-board"),
    ).toHaveCount(0);
  } finally {
    await write(api, contentData(original));
    if (photoId)
      expect((await api.delete(`/api/media/${photoId}`)).ok()).toBe(true);
  }
});

test("görsel editör: slayt seçme, taslak/geri alma, görsel yükleme ve yayınlama", async ({
  page,
}) => {
  test.setTimeout(150000);
  await page.setViewportSize({ width: 1680, height: 1100 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await login(page);
  const api = page.context().request;
  const original = await read(api);
  let photoId: number | undefined;
  try {
    await page.goto("/admin/visual-editor");
    const preview = page.frameLocator("iframe");
    await expect(
      preview.locator('[data-editor-field="sports-homepage:hero.headline"]'),
    ).toBeVisible();
    await page
      .locator("#ve-field")
      .selectOption("sports-homepage:slides.1.first");
    await expect(preview.locator(".sports-hero")).toHaveAttribute(
      "data-slide",
      "2",
    );
    await expect(page.locator("#ve-text")).toHaveValue(
      original.slides[1].first,
    );
    await page.locator("#ve-text").fill("Görerek düzenlenen slayt.");
    await expect(preview.locator(".hero-slide-content h2")).toContainText(
      "Görerek düzenlenen slayt.",
    );
    expect((await read(api)).slides[1].first).toBe(original.slides[1].first);
    await page
      .getByRole("button", {
        name: "Bu alandaki değişikliği geri al",
        exact: true,
      })
      .click();
    await expect(preview.locator(".hero-slide-content h2")).toContainText(
      original.slides[1].first,
    );
    await page.locator("#ve-text").fill("Görerek düzenlenen slayt.");
    await page
      .locator("#ve-field")
      .selectOption("sports-homepage:slides.1.photo");
    await page.locator("#ve-alt").fill("Görsel editör slayt test fotoğrafı");
    const uploaded = page.waitForResponse(
      (r) => r.url().endsWith("/api/media") && r.request().method() === "POST",
    );
    await page
      .locator('input[type="file"]')
      .setInputFiles("public/images/fruit.webp");
    const photo = (await (await uploaded).json()).doc;
    photoId = photo.id;
    await expect(preview.locator(".hero-photo img")).toHaveAttribute(
      "src",
      photo.url,
    );
    expect((await read(api)).slides[1].photo).toBe(original.slides[1].photo);
    await page.getByRole("button", { name: "Mobil", exact: true }).click();
    await expect(page.locator("iframe")).toHaveCSS("width", "390px");
    await page.getByRole("button", { name: "Masaüstü", exact: true }).click();
    const saved = page.waitForResponse(
      (r) => r.url().includes(endpoint) && r.request().method() === "POST",
    );
    await page
      .getByRole("button", { name: "Değişiklikleri kaydet", exact: true })
      .click();
    expect((await saved).ok()).toBe(true);
    await expect(page.locator(".ve-message--success")).toContainText(
      "kaydedildi",
    );
    await page.goto("/");
    await page.getByRole("button", { name: "2. slayt:" }).click();
    await expect(page.locator(".hero-slide-content h2")).toContainText(
      "Görerek düzenlenen slayt.",
    );
    expect((await read(api)).slides[1].photo).toBe(photo.id);
  } finally {
    await write(api, contentData(original));
    if (photoId)
      expect((await api.delete(`/api/media/${photoId}`)).ok()).toBe(true);
  }
});

test("görsel editör: gizli satırdan sonra doğru kayıt ve eşzamanlı değişiklik koruması", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await login(page);
  const api = page.context().request;
  const original = await read(api);
  try {
    const slides = structuredClone(original.slides);
    slides[0].visible = false;
    await write(api, { slides });
    await page.goto("/admin/visual-editor");
    const preview = page.frameLocator("iframe");
    await expect(page.locator("#ve-text")).toBeVisible();
    await page
      .locator("#ve-field")
      .selectOption("sports-homepage:slides.1.first");
    await expect(preview.locator(".hero-slide-content h2")).toContainText(
      original.slides[1].first,
    );
    await expect(
      preview.locator('[data-editor-field="sports-homepage:slides.1.first"]'),
    ).toBeVisible();
    await page.locator("#ve-text").fill("Kaydedilmemesi gereken taslak.");
    await write(api, {
      hero: { ...original.hero, note: "Başka sekmede yapılan değişiklik." },
    });
    await page
      .getByRole("button", { name: "Değişiklikleri kaydet", exact: true })
      .click();
    await expect(page.locator(".ve-message--error")).toContainText(
      "başka bir sekmede",
    );
    expect((await read(api)).slides[1].first).toBe(original.slides[1].first);
  } finally {
    await write(api, contentData(original));
  }
});

for (const width of [390, 1440])
  test(`${width}px: yeni admin girişi ve dashboard okunabilir, taşmıyor`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/admin/login");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze())
        .violations,
    ).toEqual([]);
    await login(page);
    await expect(
      page.getByRole("link", { name: /Yeni ana sayfa/ }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze())
        .violations,
    ).toEqual([]);
    await page.screenshot({
      path: `test-results/sports-admin-${width}.png`,
      fullPage: true,
    });
  });
