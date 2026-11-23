import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("ana sayfa açılışta ve yenilendiğinde üstte kalır", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }),
  );
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(1000);
  await page.reload();
  await page.evaluate(() => document.fonts.ready);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.goto("/#iletisim");
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(1000);
  await expect(page.locator("#iletisim")).toBeInViewport();
});

for (const width of [390, 1440]) {
  test(`${width}px: admin girişi okunaklı, erişilebilir ve taşmıyor`, async ({
    page,
    baseURL,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.emulateMedia({ colorScheme: "dark" });
    await page
      .context()
      .addCookies([
        { name: "payload-theme", value: "dark", url: new URL(baseURL!).origin },
      ]);
    await page.goto("/admin/login");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(
      page.getByRole("heading", { name: "Yeniden merhaba." }),
    ).toBeVisible();
    await expect(page.getByLabel("E-posta")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Giriş", exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const accessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(accessibility.violations).toEqual([]);
    await page.screenshot({
      path: `test-results/admin-login-${width}.png`,
      fullPage: true,
    });
  });
}
