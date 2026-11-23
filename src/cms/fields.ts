import type {
  CheckboxField,
  Field,
  GlobalConfig,
  TextField,
  TextareaField,
} from "payload";
import { revalidatePath } from "next/cache";
import { isAdmin, publicRead } from "./access";

export function textField(
  name: string,
  label: string,
  maxLength = 300,
  required = false,
): TextField | TextareaField {
  const validate = (value: unknown) =>
    (!value && !required) ||
    (typeof value === "string" &&
      (!required || value.trim().length > 0) &&
      value.length <= maxLength &&
      !/[<>\u0000-\u0008]/.test(value)) ||
    "Yalnızca belirtilen uzunlukta düz metin kullanın.";
  return maxLength > 300
    ? { name, label, type: "textarea", required, validate }
    : { name, label, type: "text", required, maxLength, validate };
}
export const checkbox = (
  name: string,
  label: string,
  defaultValue = false,
): CheckboxField => ({ name, label, type: "checkbox", defaultValue });
export const initializedField: Field = {
  name: "initialized",
  type: "checkbox",
  defaultValue: false,
  admin: { hidden: true },
  access: { update: () => false },
};
export function globalConfig(
  slug: string,
  label: string,
  fields: Field[],
): GlobalConfig {
  return {
    slug,
    label,
    access: { read: publicRead, update: isAdmin },
    admin: {
      group: "Site yönetimi",
      description:
        "Değişiklikleri kaydettiğinizde site güncellenir. Örnek içerikleri yayın öncesinde onaylayın.",
    },
    fields: [initializedField, ...fields],
    hooks: {
      afterChange: [
        ({ req, doc }) => {
          if (!req.context.skipRevalidate) revalidatePath("/", "layout");
          return doc;
        },
      ],
    },
  };
}
