import { defaultBodyAnalysisSettings } from "../../content/body-analysis";
import { normalizePhone, validateTemplate } from "./messages";
import type { BodyAnalysisSettings } from "./types";

const bannedCopy =
  /ideal\s*kilo|hedef\s*kilo|kalori|kcal|kilo\s*ver|obez|kilolu|normal\s*(kilo|vki|bki)|zayıf|garanti|kesin\s*sonuç/;
const hasBannedCopy = (text: string) =>
  bannedCopy.test(text.normalize("NFKC").toLocaleLowerCase("tr-TR"));
export function isSafeCopy(value: unknown, max: number): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= max &&
    !/[<>\u0000-\u001f]/.test(value) &&
    !hasBannedCopy(value)
  );
}
// Pure allowlist merger prepares the future CMS boundary. No stored setting can override safety constants.
export function sanitizeBodyAnalysisSettings(
  value: unknown,
  production: boolean,
): BodyAnalysisSettings {
  const defaults = defaultBodyAnalysisSettings(production);
  if (!value || typeof value !== "object") return defaults;
  const data = value as Record<string, unknown>;
  const result = { ...defaults, fields: { ...defaults.fields } };
  for (const key of ["enabled", "includeBmi", "includeFat"] as const)
    if (typeof data[key] === "boolean") result[key] = data[key];
  for (const [key, max] of [
    ["title", 60],
    ["subtitle", 100],
    ["description", 300],
    ["calculateLabel", 40],
    ["sendLabel", 40],
  ] as const) {
    const text = data[key];
    if (isSafeCopy(text, max)) result[key] = text.trim();
  }
  if (data.fields && typeof data.fields === "object") {
    const fields = data.fields as Record<string, unknown>;
    for (const key of ["neck", "waist", "hip"] as const)
      if (typeof fields[key] === "boolean") result.fields[key] = fields[key];
  }
  if (Array.isArray(data.services)) {
    const services = data.services
      .slice(0, 8)
      .flatMap((item: unknown) => {
        if (!item || typeof item !== "object") return [];
        const service = item as Record<string, unknown>;
        return typeof service.id === "string" &&
          /^[a-z0-9-]{1,40}$/.test(service.id) &&
          isSafeCopy(service.label, 80)
          ? [
              {
                id: service.id,
                label: service.label.trim(),
                isDefault: service.isDefault === true,
              },
            ]
          : [];
      })
      .filter(
        (item, index, list) =>
          list.findIndex((other) => other.id === item.id) === index,
      );
    if (services.length) {
      const selected = Math.max(
        0,
        services.findIndex((service) => service.isDefault),
      );
      result.services = services.map((service, index) => ({
        ...service,
        isDefault: index === selected,
      }));
    }
  }
  if (
    typeof data.messageTemplate === "string" &&
    !validateTemplate(data.messageTemplate) &&
    !hasBannedCopy(data.messageTemplate)
  )
    result.messageTemplate = data.messageTemplate.trim();
  if (typeof data.whatsappOverride === "string")
    result.whatsappOverride = normalizePhone(data.whatsappOverride) ?? "";
  return result;
}
