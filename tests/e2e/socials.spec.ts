import { test, expect } from "@playwright/test";

for (const width of [320, 390, 768, 1440]) {
  test(`${width}px: sosyal alan okunur, taşmaz ve yüzen düğme bağlantıları örtmez`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const panel = page.locator(".contact-social");
    await panel.scrollIntoViewIfNeeded();
    await expect(panel.getByRole("heading", { level: 3 })).toContainText(
      "Biraz ilham",
    );
    await expect(panel.locator(".social-link")).toHaveCount(5);
    await expect(page.locator(".floating-actions")).not.toBeVisible();
    for (const name of [
      "Instagram",
      "YouTube",
      "TikTok",
      "WhatsApp",
      "LinkedIn",
    ]) {
      await expect(
        panel.locator(".social-name", { hasText: name }),
      ).toBeVisible();
      await expect(
        page.locator(".social-footer .social-name", { hasText: name }),
      ).toHaveCount(1);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await panel.screenshot({
      path: `test-results/socials-${width}.png`,
      animations: "disabled",
    });
  });
}

test("WhatsApp açıklaması klavyeyle açılır, Escape ile kapanır ve onaysız numara kullanmaz", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const button = page.locator(".floating-whatsapp");
  await expect(button).toHaveAttribute("href", "#iletisim");
  await expect(button).toHaveAccessibleName(/numarası onay bekliyor/);
  await page.keyboard.press("Tab");
  await button.focus();
  await expect(page.locator(".floating-hint")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".floating-hint")).not.toBeVisible();
  await page.locator(".hero .text-link").first().focus();
  await button.focus();
  await expect(page.locator(".floating-hint")).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#iletisim$/);
  await expect(page.locator(".floating-actions")).not.toBeVisible();
});
