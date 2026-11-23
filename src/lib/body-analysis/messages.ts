import { formatNumber, formatRange } from "./calculations";
import type { Analysis, BodyAnalysisSettings } from "./types";
import { analysisCopy as copy } from "../../content/body-analysis";

export const ALLOWED_PLACEHOLDERS = [
  "ad",
  "cinsiyet",
  "yas",
  "boy",
  "kilo",
  "vki",
  "yag_orani",
  "hizmet",
] as const;
export type Placeholder = (typeof ALLOWED_PLACEHOLDERS)[number];
// Conservative link budget for interoperability; not a claimed WhatsApp platform limit.
export const MAX_WHATSAPP_URL_LENGTH = 2000;
const unsafeText =
  /<|>|javascript:|data:|[\u0000-\u0008\u000b\u000c\u000e-\u001f]/i;
export function validateTemplate(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim() || value.trim().length > 800)
    return copy.templateErrors.length;
  if (unsafeText.test(value)) return copy.templateErrors.plain;
  const tokens = [...value.matchAll(/\{([^{}]*)\}/g)];
  const unknown = tokens.find(
    (token) => !ALLOWED_PLACEHOLDERS.includes(token[1] as Placeholder),
  );
  if (unknown)
    return `${copy.templateErrors.unknown}: {${unknown[1].slice(0, 40)}}.`;
  const rest = value.replace(/\{[^{}]*\}/g, "");
  if (/[{}]/.test(rest)) return copy.templateErrors.braces;
  if (!/[.!?]/.test(rest) || (rest.match(/\p{L}/gu)?.length ?? 0) < 12)
    return copy.templateErrors.sentence;
  return null;
}
export function normalizePhone(value: string): string | null {
  if (!value.trim() || !/^\+?[\d\s().-]+$/.test(value.trim())) return null;
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  else if (/^0[2-5]\d{9}$/.test(digits)) digits = `90${digits.slice(1)}`;
  else if (/^[2-5]\d{9}$/.test(digits)) digits = `90${digits}`;
  // E.164 syntax only: account ownership/reachability still needs owner verification.
  return /^[1-9]\d{7,14}$/.test(digits) ? digits : null;
}
export function whatsappUrl(
  phone: string | null,
  message: string,
): string | null {
  const number = phone ? normalizePhone(phone) : null;
  if (!number || !message.trim()) return null;
  const url = `https://wa.me/${number}?text=${encodeMessage(message.trim())}`;
  return url.length <= MAX_WHATSAPP_URL_LENGTH ? url : null;
}
export function encodeMessage(message: string): string {
  // Pasted malformed UTF-16 must not crash or leak form data through an exception.
  return encodeURIComponent(message.toWellFormed());
}
export function messageFits(phone: string | null, message: string): boolean {
  return (
    `https://wa.me/${phone ?? "000000000000000"}?text=${encodeMessage(message.trim())}`
      .length <= MAX_WHATSAPP_URL_LENGTH
  );
}
export function renderTemplate(
  template: string,
  values: Partial<Record<Placeholder, string>>,
): string {
  return template
    .split(/\r?\n/)
    .filter((line) => {
      const tokens = [...line.matchAll(/\{([^{}]*)\}/g)];
      return tokens.every(
        (token) =>
          ALLOWED_PLACEHOLDERS.includes(token[1] as Placeholder) &&
          Boolean(values[token[1] as Placeholder]?.trim()),
      );
    })
    .map((line) =>
      line
        .replace(/\{([^{}]*)\}/g, (_, key: Placeholder) => values[key] ?? "")
        .replace(/[{}]/g, ""),
    )
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
export function buildMessage(
  settings: BodyAnalysisSettings,
  analysis: Analysis,
  name: string,
  service: string,
  phone: string | null,
): { message: string; shortened: boolean; tooLong: boolean } {
  const input = analysis.input;
  if (!input || analysis.status === "underage" || analysis.status === "invalid")
    return { message: "", shortened: false, tooLong: false };
  const cleanName = Array.from(name.trim().replace(/[\r\n]/g, " "))
    .slice(0, 60)
    .join("");
  const values: Partial<Record<Placeholder, string>> = {
    ad: cleanName,
    cinsiyet: input.sex === "female" ? copy.female : copy.male,
    yas: formatNumber(input.age, 0),
    boy: formatNumber(input.height),
    kilo: formatNumber(input.weight),
    vki:
      settings.includeBmi && analysis.bmi !== undefined
        ? formatNumber(analysis.bmi)
        : "",
    yag_orani:
      settings.includeFat && analysis.range
        ? `${formatRange(analysis.range)} (${copy.rangeLabel})`
        : "",
    hizmet: service,
  };
  const optionalLines: string[] = [];
  for (const field of ["neck", "waist", "hip"] as const) {
    if (input[field] !== undefined)
      optionalLines.push(
        `- ${copy.messageMeasures[field]} ${copy.circumference}: ${formatNumber(input[field])} cm`,
      );
  }
  if (input.pregnant) optionalLines.push(`${copy.pregnancy}.`);
  const compose = () =>
    [renderTemplate(settings.messageTemplate, values), ...optionalLines]
      .filter(Boolean)
      .join("\n");
  const fits = (message: string) => messageFits(phone, message);
  let message = compose();
  let shortened = false;
  // Trim only optional whole lines BEFORE the editable preview. Edited text is never truncated.
  for (const key of ["ad", "yag_orani", "vki"] as const) {
    if (fits(message)) break;
    values[key] = "";
    message = compose();
    shortened = true;
  }
  while (!fits(message) && optionalLines.length) {
    optionalLines.pop();
    message = compose();
    shortened = true;
  }
  return { message, shortened, tooLong: !fits(message) };
}
