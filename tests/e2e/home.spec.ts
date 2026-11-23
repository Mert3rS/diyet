import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [320, 390, 768, 1440]) {
  test(`${width}px: yerleşim, bağlantılar ve görseller`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    const failures: string[] = [];
    page.on("pageerror", (error) => failures.push(error.message));
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("html")).toHaveAttribute("lang", "tr");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
    await page.evaluate(() => document.fonts.ready);
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    for (const id of ["hakkimda", "hizmetler", "surec", "sss", "iletisim"])
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    const brokenAnchors = await page
      .locator('a[href^="#"]')
      .evaluateAll((links) =>
        links
          .filter((link) => {
            const href = link.getAttribute("href");
            return (
              href && href !== "#" && !document.getElementById(href.slice(1))
            );
          })
          .map((link) => link.getAttribute("href")),
      );
    expect(brokenAnchors).toEqual([]);
    await page.locator(".collage-main img").waitFor({ state: "visible" });
    await expect
      .poll(() =>
        page
          .locator(".collage-main img")
          .evaluate(
            (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
          ),
      )
      .toBe(true);
    await page.screenshot({
      path: `test-results/home-${width}.png`,
      fullPage: true,
      animations: "disabled",
    });
    expect(failures).toEqual([]);
  });
}

test("mobil menü, hedef seçimi, hesaplama, SSS ve yorumlar", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const outgoing: string[] = [];
  const browserErrors: string[] = [];
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("request", (req) => {
    if (req.method() === "POST") outgoing.push(req.url());
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Menüyü aç", exact: true }).click();
  await expect(
    page.getByRole("navigation", { name: "Mobil menü" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("navigation", { name: "Mobil menü" }),
  ).toHaveCount(0);
  const goal = page.getByRole("button", {
    name: /Sporcu beslenmesi/,
  });
  await goal.click();
  await expect(goal).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".goal-message")).toContainText(
    "sporcu beslenmesi",
  );
  await expect(
    page.getByRole("link", { name: "İlgili hizmeti gör" }),
  ).toHaveAttribute("href", "#hizmet-sporcu");
  await page.locator("#analiz").scrollIntoViewIfNeeded();
  await page.getByLabel("Cinsiyet", { exact: true }).selectOption("female");
  await expect(page.getByLabel("İlgilendiğin hizmet")).toHaveValue("sporcu");
  await page.getByLabel("Boy (cm)").fill("170");
  await page.getByLabel("Kilo (kg)").fill("65");
  await page.getByLabel("Yaş", { exact: true }).fill("30");
  await page.getByRole("button", { name: "Analizi hesapla" }).click();
  await expect(page.locator(".analysis-bmi")).toContainText("22,5");
  await expect(page.locator(".analysis-range")).toContainText("%24–33");
  await page.getByLabel("Kilo (kg)").fill("70");
  await expect(page.locator(".analysis-bmi")).toHaveCount(0);
  await page.getByLabel("Kilo (kg)").fill("0");
  await page.getByRole("button", { name: "Analizi hesapla" }).click();
  await expect(page.locator("#analysis-weight-error")).toContainText(
    "30–250 kg",
  );
  await page.locator(".faq-list summary").first().click();
  await expect(page.locator(".faq-list details").first()).toHaveAttribute(
    "open",
    "",
  );
  await page.getByRole("button", { name: "Sonraki", exact: true }).click();
  await expect(page.locator(".testimonial-slider figcaption")).toContainText(
    "E. D.",
  );
  await expect(page.locator(".mobile-cta-bar")).toBeVisible();
  expect(outgoing).toEqual([]);
  expect(browserErrors).toEqual([]);
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
  expect(await page.context().cookies()).toEqual([]);
});

test("masaüstü süreç ilerlemesi, yorum duraklatma ve sürükleme", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.goto("/");
  const lastStep = page.locator(".process-step").last();
  await lastStep.scrollIntoViewIfNeeded();
  await expect(lastStep).toHaveClass(/active/);
  await expect(page.locator(".process-image-layer").last()).toHaveClass(
    /active/,
  );
  await page
    .getByRole("button", { name: "Yorumların otomatik geçişini duraklat" })
    .click();
  await expect(
    page.getByRole("button", { name: "Yorumların otomatik geçişini başlat" }),
  ).toBeVisible();
  const slider = await page.locator(".testimonial-slider").boundingBox();
  expect(slider).not.toBeNull();
  if (!slider) return;
  const x = slider.x + slider.width / 2;
  const y = slider.y + slider.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x - 140, y, { steps: 8 });
  await page.mouse.up();
  await expect(page.locator(".testimonial-slider figcaption")).toContainText(
    "E. D.",
  );
});

test("sosyal bağlantılar, az hareket ve erişilebilirlik", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const variant of ["small", "footer", "edge", "cards"])
    await expect(page.locator(`.social-${variant} a`)).toHaveCount(5);
  const safe = await page
    .locator(".social-link")
    .evaluateAll((links) =>
      links.every(
        (link) =>
          link.getAttribute("href")?.startsWith("https://example.invalid/") &&
          link.getAttribute("rel") === "noopener noreferrer" &&
          link.getAttribute("target") === "_blank" &&
          Boolean(link.getAttribute("aria-label")),
      ),
    );
  expect(safe).toBe(true);
  await expect(page.locator(".intro-ribbon")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: /otomatik geçiş/ }),
  ).not.toBeVisible();
  expect(
    await page
      .locator(".marquee-track")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await page.locator("#analiz").scrollIntoViewIfNeeded();
  await expect(page.getByLabel("Boy (cm)")).toBeVisible();
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
  const labelResult = await new AxeBuilder({ page })
    .withRules(["label-content-name-mismatch"])
    .analyze();
  expect(labelResult.violations).toEqual([]);
});
