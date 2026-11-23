import { test, expect } from "@playwright/test";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import {
  analyze,
  bmi,
  deurenberg,
  navy,
  parseDecimal,
  DISCLAIMER,
} from "../../src/lib/body-analysis/calculations";
import {
  buildMessage,
  normalizePhone,
  renderTemplate,
  validateTemplate,
  whatsappUrl,
  MAX_WHATSAPP_URL_LENGTH,
} from "../../src/lib/body-analysis/messages";
import { sanitizeBodyAnalysisSettings } from "../../src/lib/body-analysis/settings";
import {
  defaultBodyAnalysisSettings,
  DEFAULT_MESSAGE_TEMPLATE,
} from "../../src/content/body-analysis";
import { BodyAnalysisHeroLink } from "../../src/components/home/body-analysis-link";
import type { RawMeasurements } from "../../src/lib/body-analysis/types";

const raw: RawMeasurements = {
  sex: "female",
  age: "30",
  height: "170",
  weight: "65",
  neck: "",
  waist: "",
  hip: "",
  pregnant: false,
};
// Fixed independent reference calculations: PowerShell/.NET Math.Log10, not the JS implementation.
// Inputs and derivation are recorded in docs/body-analysis.md. Phone is NANP fictional 555-0123, test only.
const testPhone = "12025550123";

test("iki formül bağımsız hesaplanmış referans değerlerini üretir", () => {
  expect(bmi(65, 170)).toBeCloseTo(22.49134948096886, 10);
  expect(deurenberg(bmi(65, 170), 30, "female")).toBeCloseTo(
    28.4896193771626,
    10,
  );
  expect(deurenberg(bmi(80, 180), 40, "male")).toBeCloseTo(
    22.6296296296296,
    10,
  );
  expect(navy(180, 38, 90, "male")).toBeCloseTo(19.811988411785478, 9);
  expect(navy(165, 34, 75, "female", 95)).toBeCloseTo(26.40588214290193, 9);
  expect(navy(180, 38, 38, "male")).toBeNaN();
  expect(navy(165, 34, 75, "female")).toBeNaN();
});
test("Türkçe ondalıklar, yetişkin sınırları ve yöntem seçimi", () => {
  expect(parseDecimal(" 65,5 ")).toBe(65.5);
  for (const value of ["", "1,2,3", "1e2", "NaN", "Infinity", "65 kg", "-5"])
    expect(parseDecimal(value)).toBeNull();
  expect(analyze(raw).range).toEqual([24, 33]);
  expect(analyze({ ...raw, age: "18" }).status).toBe("estimated");
  expect(analyze({ ...raw, age: "80", weight: "40" }).status).toBe("estimated");
  for (const change of [
    { age: "81" },
    { age: "30,5" },
    { height: "119" },
    { height: "221" },
    { weight: "29" },
    { weight: "251" },
    { sex: "" as const },
  ])
    expect(analyze({ ...raw, ...change }).status).toBe("invalid");
  expect(analyze({ ...raw, neck: "34", waist: "75", hip: "95" }).method).toBe(
    "navy-female",
  );
  expect(
    analyze({ ...raw, sex: "male", height: "180", neck: "38", waist: "90" })
      .method,
  ).toBe("navy-male");
  expect(analyze({ ...raw, neck: "34", waist: "75" }).method).toBe(
    "deurenberg",
  );
});
test("18 yaş altı, hamilelik ve tutarsız ölçüler sayı göstermez", () => {
  expect(analyze({ ...raw, age: "17" }).status).toBe("underage");
  expect(analyze({ ...raw, age: "17" }).input).toBeUndefined();
  expect(analyze({ ...raw, pregnant: true }).status).toBe("pregnancy");
  for (const values of [
    { pregnant: true },
    { neck: "40", waist: "39" },
    { neck: "abc" },
    { neck: "301" },
    { height: "120", weight: "250" },
    { sex: "male" as const, age: "18", height: "220", weight: "30" },
  ]) {
    const result = analyze({ ...raw, ...values });
    expect(result.range).toBeUndefined();
    expect(result.bmi).toBeUndefined();
    expect(result.input).toBeDefined();
  }
});
test("mesaj Türkçe, özel karakterler, boş satırlar ve güvenli telefon biçimi", () => {
  const settings = defaultBodyAnalysisSettings(false);
  const draft = buildMessage(
    settings,
    analyze(raw),
    "Şükrü & Çağrı #1 + %",
    "Sporcu beslenmesi",
    testPhone,
  );
  const url = whatsappUrl(testPhone, draft.message)!;
  expect(new URL(url).searchParams.get("text")).toBe(draft.message);
  expect(url).toContain("%0A");
  expect(
    new URL(whatsappUrl(testPhone, "Ş😀\ud800")!).searchParams.get("text"),
  ).toBe("Ş😀\ufffd");
  expect(url).toContain("%26");
  expect(url).toContain("%23");
  expect(url).toContain("%2B");
  expect(url).toContain("%25");
  expect(draft.message).toContain("170,0 cm");
  expect(draft.message).toContain("65,0 kg");
  expect(draft.message).toContain("%24–33 (tahmini aralık)");
  expect(draft.message).not.toContain("{");
  expect(
    renderTemplate("Merhaba.\nAd: {ad}\nBilinmeyen: {baska}\nKilo: {kilo}", {
      kilo: "65",
    }),
  ).toBe("Merhaba.\nKilo: 65");
  expect(normalizePhone("+1 (202) 555-0123")).toBe(testPhone);
  expect(normalizePhone("0012025550123")).toBe(testPhone);
  // Synthetic format fixtures, never assigned to settings or used to open WhatsApp.
  expect(normalizePhone("0500 000 00 00")).toBe("905000000000");
  expect(normalizePhone("5000000000")).toBe("905000000000");
  for (const phone of [
    "",
    "+90 5XX XXX XX XX",
    "javascript:1",
    "123",
    "+000000000",
    "1234567890123456",
  ])
    expect(normalizePhone(phone)).toBeNull();
  expect(whatsappUrl(null, draft.message)).toBeNull();
});
test("şablon doğrulaması, isteğe bağlı satırları azaltma ve uzun düzenlenmiş mesaj", () => {
  expect(validateTemplate(DEFAULT_MESSAGE_TEMPLATE)).toBeNull();
  for (const template of [
    "<script>alert(1)</script>",
    "{ad}",
    "Merhaba. {bilinmeyen}",
    "a".repeat(801),
    "Merhaba, bilgi istiyorum. {ad",
  ])
    expect(validateTemplate(template)).not.toBeNull();
  expect(validateTemplate("Merhaba, bilgi istiyorum. {yasak}")).toContain(
    "yasak",
  );
  const settings = defaultBodyAnalysisSettings(false);
  settings.messageTemplate = `Merhaba, bilgi istiyorum.\n${"Ş".repeat(300)} {ad}\nBoy: {boy} cm\nYağ: {yag_orani}`;
  const draft = buildMessage(
    settings,
    analyze(raw),
    "Ş".repeat(60),
    "Fiyat bilgisi",
    testPhone,
  );
  expect(draft.shortened).toBe(true);
  expect(draft.tooLong).toBe(false);
  expect(whatsappUrl(testPhone, draft.message)!.length).toBeLessThanOrEqual(
    MAX_WHATSAPP_URL_LENGTH,
  );
  expect(draft.message).toContain("Boy: 170,0 cm");
  expect(whatsappUrl(testPhone, "Ş".repeat(800))).toBeNull();
  const pregnancy = buildMessage(
    settings,
    analyze({ ...raw, pregnant: true }),
    "",
    "Fiyat bilgisi",
    null,
  );
  expect(pregnancy.message).toContain("Hamileyim veya emziriyorum.");
  expect(pregnancy.message).not.toContain("Yağ:");
  expect(
    buildMessage(
      settings,
      analyze({ ...raw, age: "17" }),
      "",
      "Fiyat",
      testPhone,
    ).message,
  ).toBe("");
});
test("ayarlar güvenli varsayılanlarla birleşir; sabitler geçersiz kılınamaz", () => {
  expect(defaultBodyAnalysisSettings(true).enabled).toBe(false);
  expect(defaultBodyAnalysisSettings(false).enabled).toBe(true);
  const unsafe = sanitizeBodyAnalysisSettings(
    {
      title: "<b>Başlık</b>",
      subtitle: "İdeal kilo",
      messageTemplate: "Merhaba, fiyat alabilir miyim? {foo}",
      services: [{ id: "x", label: "Kalori hedefi", isDefault: true }],
      whatsappOverride: "XXX",
      disclaimer: "",
      minimumAge: 5,
      margin: 0,
    },
    false,
  );
  expect(unsafe.title).toBe("Vücut analizi");
  expect(unsafe.services).toHaveLength(6);
  expect(unsafe.subtitle).toBe(defaultBodyAnalysisSettings(false).subtitle);
  expect(unsafe.messageTemplate).toBe(DEFAULT_MESSAGE_TEMPLATE);
  expect(unsafe.whatsappOverride).toBe("");
  expect(unsafe).not.toHaveProperty("disclaimer");
  expect(unsafe).not.toHaveProperty("minimumAge");
  expect(DISCLAIMER).toContain("uzman görüşünün yerini tutmaz");
  const services = Array.from({ length: 12 }, (_, i) => ({
    id: `s-${i}`,
    label: `Hizmet ${i}`,
    isDefault: true,
  }));
  const safe = sanitizeBodyAnalysisSettings(
    { services, fields: { neck: false } },
    false,
  );
  expect(safe.services).toHaveLength(8);
  expect(safe.services.filter((item) => item.isDefault)).toHaveLength(1);
  expect(safe.fields.neck).toBe(false);
});
test("kapalı araç hero bağlantısı render edilmez", () => {
  const html = renderToStaticMarkup(
    createElement(BodyAnalysisHeroLink, { enabled: false }),
  );
  expect(html).not.toContain('href="#analiz"');
});
