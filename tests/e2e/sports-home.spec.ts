import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import {
  sportsSlides,
  sportsServices,
  sportsAudiences,
  sportsMethod,
  sportsEvents,
  sportsRecipes,
  sportsSocialTiles,
  sportsMedia,
  sportsTestimonials,
  sportsFaqs,
  sportsDashboard,
  sportsCopy,
} from "../../src/content/mock-data";

test.describe("Mavi sporcu beslenmesi ana sayfası", () => {
  test("otomatik slayt geçişi, hover/focus duraklatması ve kalıcı etkileşim durdurması", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const hero = page.getByRole("region", {
      name: "Beslenme danışmanlığı hizmetleri",
    });
    await page.mouse.move(0, 0);
    await expect(hero).toHaveAttribute("data-autoplay", "playing");
    await expect(hero).toHaveAttribute("data-slide", "2", { timeout: 10000 });
    await page.clock.install();
    await hero.hover();
    await expect(hero).toHaveAttribute("data-autoplay", "paused");
    await page.clock.fastForward(12000);
    await expect(hero).toHaveAttribute("data-slide", "2");
    await page.mouse.move(0, 0);
    await expect(hero).toHaveAttribute("data-autoplay", "playing");
    await page
      .getByRole("button", { name: "Sonraki slayt", exact: true })
      .focus();
    await expect(hero).toHaveAttribute("data-autoplay", "paused");
    await page.clock.fastForward(7000);
    await expect(hero).toHaveAttribute("data-slide", "2");
    await page.keyboard.press("ArrowRight");
    await expect(hero).toHaveAttribute("data-slide", "3");
    await page.getByRole("link", { name: /Günay Turan/ }).focus();
    await page.mouse.move(0, 0);
    await page.clock.fastForward(14000);
    await expect(hero).toHaveAttribute("data-slide", "3");
    await expect(hero).toHaveAttribute("data-autoplay", "paused");
  });

  test("numaralı seçim, ok tuşları ve açık oynat/duraklat kontrolü", async ({
    page,
  }) => {
    await page.goto("/");
    const hero = page.locator(".sports-hero");
    await page.getByRole("button", { name: "4. slayt:" }).click();
    await expect(hero).toHaveAttribute("data-slide", "4");
    await page.keyboard.press("ArrowLeft");
    await expect(hero).toHaveAttribute("data-slide", "3");
    await page
      .getByRole("button", { name: "Slaytları oynat", exact: true })
      .click();
    await page.getByRole("link", { name: /Günay Turan/ }).focus();
    await page.mouse.move(0, 0);
    await expect(hero).toHaveAttribute("data-autoplay", "playing");
    await page
      .getByRole("button", { name: "Slaytları duraklat", exact: true })
      .click();
    await expect(hero).toHaveAttribute("data-autoplay", "paused");
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("button", { name: "Önceki slayt", exact: true }),
    ).toBeFocused();
  });

  test("azaltılmış harekette otomatik geçiş ve CSS animasyonu yok", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.clock.install();
    await page.goto("/");
    await page.clock.fastForward(18000);
    await expect(page.locator(".sports-hero")).toHaveAttribute(
      "data-slide",
      "1",
    );
    await expect(page.locator(".sports-hero")).toHaveAttribute(
      "data-autoplay",
      "paused",
    );
    await expect(
      page.getByRole("button", { name: "Slaytları oynat", exact: true }),
    ).toBeDisabled();
    const animations = await page
      .locator(
        ".marquee-track, .ring-fill, .hero-sports-image, .aurora-background > i",
      )
      .evaluateAll((nodes) =>
        nodes.map((node) => getComputedStyle(node).animationName),
      );
    expect(animations.every((value) => value === "none")).toBe(true);
  });

  test("dokunmatik kaydırma slaytı değiştirir ve otomatiği durdurur", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();
    await page.goto(test.info().project.use.baseURL as string);
    const hero = page.locator(".sports-hero");
    await hero.dispatchEvent("pointerdown", {
      pointerType: "touch",
      clientX: 310,
    });
    await hero.dispatchEvent("pointerup", {
      pointerType: "touch",
      clientX: 80,
    });
    await expect(hero).toHaveAttribute("data-slide", "2");
    await expect(hero).toHaveAttribute("data-autoplay", "paused");
    await context.close();
  });

  test("Bilgi Al ilgili hizmeti açar; hedef kitle mesajı tarayıcıda hazırlanır", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.getByRole("button", { name: "3. slayt:" }).click();
    await expect(page.locator(".hero-slide-content h2")).toContainText(
      "Aynı sahada",
    );
    await page.getByRole("link", { name: "Bilgi Al", exact: true }).click();
    await expect(page.locator("#hizmet-takim details")).toHaveAttribute(
      "open",
      "",
    );
    await page.getByRole("button", { name: /Profesyonel sporcu/ }).click();
    await page.locator("#audience-0").getByRole("link").click();
    await expect(page.locator("#hizmet-sporcu details")).toHaveAttribute(
      "open",
      "",
    );
    await expect(page.locator(".contact-interest")).toContainText(
      "Profesyonel sporcu beslenmesi",
    );
    expect(
      await page.evaluate(() => localStorage.length + sessionStorage.length),
    ).toBe(0);
  });

  test("tarif filtreleri ve klavyeyle SSS açma", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator(".recipe-card")).toHaveCount(6);
    await page.getByRole("button", { name: "Tatlı", exact: true }).click();
    await expect(page.locator(".recipe-card")).toHaveCount(2);
    await expect(page.locator(".recipe-card").first()).toContainText(
      "Meyveli yoğurt kâsesi",
    );
    await page.getByRole("button", { name: "Tuzlu", exact: true }).click();
    await expect(page.locator(".recipe-card")).toHaveCount(2);
    await page.getByRole("button", { name: "Tümü", exact: true }).click();
    await expect(page.locator(".recipe-card")).toHaveCount(6);
    const summary = page.locator(".faq-list summary").first();
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(".faq-list details").first()).toHaveAttribute(
      "open",
      "",
    );
  });

  for (const width of [320, 390, 768, 1440]) {
    test(`${width}px: tek h1, taşma yok, yakınlaştırma açık, erişilebilir metin ve kontroller`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/");
      await expect(page.locator("h1")).toHaveCount(1);
      for (const number of [1, 2, 3, 4]) {
        await page.getByRole("button", { name: `${number}. slayt:` }).click();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
      const viewport = await page
        .locator('meta[name="viewport"]')
        .getAttribute("content");
      expect(viewport).not.toMatch(/user-scalable=no|maximum-scale=1(?:,|$)/);
      await expect(page.locator("html")).toHaveAttribute("lang", "tr");
      const accessibility = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(accessibility.violations).toEqual([]);
    });
  }

  test("mobil menü odak kapanı, Escape ve bölüm seçimi", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.getByRole("button", { name: "Menüyü aç", exact: true }).click();
    await expect(page.locator("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("dialog")).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: "Menüyü aç", exact: true }),
    ).toBeFocused();
    await page.getByRole("button", { name: "Menüyü aç", exact: true }).click();
    await page
      .getByRole("navigation", { name: "Mobil menü", exact: true })
      .getByRole("link", { name: "Tarifler", exact: true })
      .click();
    await expect(page.locator("dialog")).not.toBeVisible();
    await expect(page).toHaveURL(/#tarifler$/);
  });

  test("üçüncü taraf script/iframe, form veya ziyaretçi verisi gönderen istek yok", async ({
    page,
  }) => {
    const external: string[] = [];
    const writes: string[] = [];
    const origin = new URL(test.info().project.use.baseURL as string).origin;
    page.on("request", (request) => {
      if (
        new URL(request.url()).origin !== origin &&
        !request.url().startsWith("data:")
      )
        external.push(request.url());
      if (!["GET", "HEAD"].includes(request.method()))
        writes.push(request.url());
    });
    await page.goto("/");
    await page.locator("#iletisim").scrollIntoViewIfNeeded();
    await expect(page.locator("iframe, form")).toHaveCount(0);
    expect(external).toEqual([]);
    expect(writes).toEqual([]);
    expect(
      await page.locator('meta[name="robots"]').getAttribute("content"),
    ).toContain("noindex");
  });

  test("örnek kayıtlar işaretli; palet yalnız mavi/beyaz; metin eşleşmeleri AA", () => {
    const lists = [
      sportsSlides,
      sportsServices,
      sportsAudiences,
      sportsMethod,
      sportsEvents,
      sportsRecipes,
      sportsSocialTiles,
      sportsMedia,
      sportsTestimonials,
      sportsFaqs,
      Object.values(sportsCopy),
      [sportsDashboard],
    ];
    for (const list of lists)
      for (const item of list) expect(item.isMock).toBe(true);
    const css = readFileSync("src/styles/globals.css", "utf8");
    const colors = [...css.matchAll(/--([\w-]+):\s*(#[\da-f]{6})\b/gi)];
    const allowed = [
      "#050B24",
      "#0B1F5C",
      "#1440D6",
      "#1E5BFF",
      "#3B82FF",
      "#5BB8FF",
      "#4FE3FF",
      "#E8F3FF",
      "#F5F9FF",
      "#FFFFFF",
    ];
    expect(colors.length).toBe(10);
    for (const [, , color] of colors)
      expect(allowed).toContain(color.toUpperCase());
    const luminance = (hex: string) => {
      const channels = hex
        .match(/[\da-f]{2}/gi)!
        .map((value) => parseInt(value, 16) / 255)
        .map((value) =>
          value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
        );
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    for (const [foreground, background] of [
      ["FFFFFF", "1E5BFF"],
      ["FFFFFF", "1440D6"],
      ["FFFFFF", "0B1F5C"],
      ["050B24", "4FE3FF"],
      ["050B24", "5BB8FF"],
      ["0B1F5C", "E8F3FF"],
      ["1440D6", "F5F9FF"],
      ["4FE3FF", "1440D6"],
    ]) {
      const values = [luminance(foreground), luminance(background)].sort(
        (a, b) => b - a,
      );
      expect((values[0] + 0.05) / (values[1] + 0.05)).toBeGreaterThanOrEqual(
        4.5,
      );
    }
  });
});
