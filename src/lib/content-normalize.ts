export const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
export const text = (value: unknown, fallback = "", max = 3000) =>
  typeof value === "string" ? value.slice(0, max) : fallback;
export const flag = (value: unknown, fallback = false) =>
  typeof value === "boolean" ? value : fallback;
export function mergeKnown(template: unknown, value: unknown): unknown {
  if (typeof template === "string") return text(value, template);
  if (typeof template === "boolean") return flag(value, template);
  if (Array.isArray(template))
    return Array.isArray(value)
      ? value.slice(0, 30).map((row) => mergeKnown(template[0], row))
      : [];
  if (template && typeof template === "object") {
    const data = record(value);
    return Object.fromEntries(
      Object.entries(template).map(([key, item]) => [
        key,
        mergeKnown(item, data[key]),
      ]),
    );
  }
  return template;
}
