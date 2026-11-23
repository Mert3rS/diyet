import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function openAnalysis(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("link", { name: "Vücut analizini dene" }).click();
  await expect(page.getByLabel("Boy (cm)")).toBeVisible();
}
async function fillRequired(page: Page) {
  await page.getByLabel("Cinsiyet", { exact: true }).selectOption("female");
  await page.getByLabel("Yaş", { exact: true }).fill("30");
  await page.getByLabel("Boy (cm)").fill("170");
  await page.getByLabel("Kilo (kg)").fill("65,5");
}

test("normal harekette Navy aralığı tamamlanır; kadın/erkek ölçüleri doğru yöntemi seçer", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 950 });
  await openAnalysis(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await fillRequired(page);
  await page.getByLabel("Boy (cm)").fill("165");
  await page.locator(".analysis-measures summary").click();
  await page.getByLabel("Boyun çevresi (cm)").fill("34");
  await page.getByLabel("Bel çevresi (cm)").fill("75");
  await page.getByLabel("Kalça çevresi (cm)").fill("95");
  await page.getByRole("button", { name: "Analizi hesapla" }).click();
  await expect(
    page.locator('.analysis-range > span[aria-hidden="true"]'),
  ).toHaveText("%22–31");
  await expect(page.locator(".analysis-method-label")).toContainText("±3,72");
  await page.getByLabel("Cinsiyet", { exact: true }).selectOption("male");
  await expect(page.getByLabel("Kalça çevresi (cm)")).toHaveCount(0);
  await page.getByLabel("Boy (cm)").fill("180");
  await page.getByLabel("Boyun çevresi (cm)").fill("38");
  await page.getByLabel("Bel çevresi (cm)").fill("90");
  await page.getByRole("button", { name: "Analizi hesapla" }).click();
  await expect(
    page.locator('.analysis-range > span[aria-hidden="true"]'),
  ).toHaveText("%16–24");
  await expect(page.locator(".analysis-method-label")).toContainText("±3,52");
});

for (const width of [320, 390, 768, 1440]) {
  test(`${width}px: analiz ve mesaj önizlemesi taşmaz, yargılayıcı içerik göstermez`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await openAnalysis(page);
    await fillRequired(page);
    await page.getByRole("button", { name: "Analizi hesapla" }).click();
    await expect(page.locator(".analysis-range")).toContainText("%24–33");
    await page.getByRole("button", { name: "Mesajı gözden geçir" }).click();
    await expect(page.getByLabel("WhatsApp mesaj önizlemesi")).toBeFocused();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const toolText = await page.locator("#analiz").innerText();
    expect(toolText).not.toMatch(
      /ideal\s*kilo|hedef\s*kilo|kalori|kcal|kilo\s*ver|obez|fazla\s*kilolu|normal\s*kilo/i,
    );
    await expect(page.locator("#analiz svg[role=img]")).toHaveAttribute(
      "aria-label",
      /%24–33/,
    );
    await expect(
      page.getByRole("button", { name: "WhatsApp'ta gönder" }),
    ).toBeDisabled();
    await page.locator("#analiz").screenshot({
      path: `test-results/analysis-${width}.png`,
      animations: "disabled",
    });
  });
}

test("hesap ve önizleme ağ isteği, depolama veya URL değişikliği yapmaz", async ({
  page,
}) => {
  await openAnalysis(page);
  await fillRequired(page);
  await page
    .getByRole("button", { name: "Analizi hesapla" })
    .scrollIntoViewIfNeeded();
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => {
    const calls: string[] = [];
    Object.defineProperty(window, "__analysisSideEffects", { value: calls });
    Storage.prototype.setItem = function () {
      calls.push("storage-write");
    };
    navigator.sendBeacon = () => {
      calls.push("beacon");
      return false;
    };
    const descriptor = Object.getOwnPropertyDescriptor(
      Document.prototype,
      "cookie",
    );
    if (descriptor)
      Object.defineProperty(document, "cookie", {
        get: () => descriptor.get?.call(document) ?? "",
        set: () => {
          calls.push("cookie-write");
        },
      });
  });
  const requests: string[] = [];
  const capture = (request: import("@playwright/test").Request) =>
    requests.push(request.url());
  const initialUrl = page.url();
  page.on("request", capture);
  await page.getByRole("button", { name: "Analizi hesapla" }).click();
  await expect(page.locator(".analysis-range")).toContainText("%24–33");
  await page.getByRole("button", { name: "Mesajı gözden geçir" }).click();
  await expect(page.getByLabel("WhatsApp mesaj önizlemesi")).toHaveValue(
    /65,5 kg/,
  );
  await page
    .getByLabel(
      "Bu bilgileri diyetisyene WhatsApp ile göndermeyi kabul ediyorum.",
      { exact: true },
    )
    .check();
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  page.off("request", capture);
  expect(requests).toEqual([]);
  expect(page.url()).toBe(initialUrl);
  expect(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
      effects: (window as unknown as { __analysisSideEffects: string[] })
        .__analysisSideEffects,
    })),
  ).toEqual({ local: 0, session: 0, effects: [] });
  expect(await page.context().cookies()).toEqual([]);
});

test("gebelik ve tutarsız ölçülerde sayı yok, 18 yaş altında yalnız iletişim var", async ({
  page,
}) => {
  await openAnalysis(page);
  await fillRequired(page);
  await page.getByLabel("Hamileyim veya emziriyorum", { exact: true }).check();
  await page.getByRole("button", { name: "Analizi hesapla" }).click();
  await expect(page.locator(".analysis-result-content")).toContainText(
    "bu tahmin uygulanmaz",
  );
  await expect(page.locator(".analysis-range")).toHaveCount(0);
  await expect(page.locator(".analysis-bmi")).toHaveCount(0);
  await page.getByRole("button", { name: "Mesajı gözden geçir" }).click();
  const message = page.getByLabel("WhatsApp mesaj önizlemesi");
  await expect(message).toHaveValue(/Hamileyim veya emziriyorum/);
  await expect(message).not.toHaveValue(/Tahmini yağ oranı:/);
  await message.fill(
    (await message.inputValue()).replace("Hamileyim veya emziriyorum.", ""),
  );
  await expect(message).not.toHaveValue(/Hamileyim/);
  await page
    .getByLabel("Hamileyim veya emziriyorum", { exact: true })
    .uncheck();
  await expect(message).toHaveCount(0);
  await page.locator(".analysis-measures summary").click();
  await page.getByLabel("Boyun çevresi (cm)").fill("40");
  await page.getByLabel("Bel çevresi (cm)").fill("39");
  await page.getByLabel("Kalça çevresi (cm)").fill("95");
  await page.getByRole("button", { name: "Analizi hesapla" }).click();
  await expect(page.locator(".analysis-result-content")).toContainText(
    "hesaplama güvenilir değil",
  );
  await expect(page.getByLabel("Bel çevresi (cm)")).toBeFocused();
  await page.getByRole("button", { name: "Mesajı gözden geçir" }).click();
  await expect(message).toHaveValue(/Bel çevresi: 39,0 cm/);
  await page.getByLabel("Yaş", { exact: true }).fill("17");
  await expect(page.locator(".analysis-result-content")).toContainText(
    "Bu araç 18 yaş ve üzeri içindir",
  );
  await expect(
    page.getByRole("button", { name: "Analizi hesapla" }),
  ).toBeDisabled();
  await expect(message).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Mesajı gözden geçir" }),
  ).toHaveCount(0);
  await expect(
    page
      .locator(".analysis-contact-options")
      .getByRole("link", { name: "Telefonla ara" }),
  ).toBeVisible();
});

test("klavye akışı, boş onay, kopyalama alternatifi ve sonuçta erişilebilirlik", async ({
  page,
}) => {
  await openAnalysis(page);
  await page.getByLabel("Cinsiyet", { exact: true }).focus();
  await page.keyboard.press("f"); // Select via explicit keyboard arrows below; no mouse submission.
  await page.keyboard.press("Home");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Tab");
  await page.keyboard.type("30");
  await page.keyboard.press("Tab");
  await page.keyboard.type("170");
  await page.keyboard.press("Tab");
  await page.keyboard.type("65,5");
  await page.keyboard.press("Enter");
  await expect(page.locator(".analysis-range")).toContainText("%24–33");
  // Reach the preview action by keyboard, including the method disclosure and contact fallbacks.
  for (
    let i = 0;
    i < 20 &&
    !(await page
      .getByRole("button", { name: "Mesajı gözden geçir" })
      .evaluate((element) => element === document.activeElement));
    i++
  )
    await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Mesajı gözden geçir" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  const checkbox = page.getByLabel(
    "Bu bilgileri diyetisyene WhatsApp ile göndermeyi kabul ediyorum.",
    { exact: true },
  );
  await expect(checkbox).not.toBeChecked();
  await page.keyboard.press("Tab");
  await expect(checkbox).toBeFocused();
  await page.keyboard.press("Space");
  await expect(checkbox).toBeChecked();
  await page
    .getByLabel("WhatsApp mesaj önizlemesi")
    .fill("Merhaba, hizmet ve fiyat bilgisi almak istiyorum. % & # + Şükrü");
  await expect(checkbox).not.toBeChecked();
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
  });
  await page
    .getByRole("button", { name: "Mesajı kopyala", exact: true })
    .last()
    .click();
  await expect(page.locator(".analysis-copy-status")).toContainText(
    "Mesaj seçildi",
  );
  await expect(page.getByLabel("WhatsApp mesaj önizlemesi")).toBeFocused();
  expect(
    (
      await new AxeBuilder({ page })
        .include("#analiz")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});
