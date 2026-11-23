import type { Analysis, Measurements, RawMeasurements, Sex } from "./types";

import {
  analysisCopy as copy,
  UNDERAGE_NOTE,
  UNRELIABLE_NOTE,
} from "../../content/body-analysis";
export {
  DISCLAIMER,
  CONSENT,
  PRIVACY_NOTICE,
  UNDERAGE_NOTE,
} from "../../content/body-analysis";

// Deurenberg et al., 1991, adult equation and SEE 4.1 percentage points.
// https://research.vu.nl/en/publications/body-mass-index-as-a-measure-of-body-fatness-age-and-sex-specific/
// Hodgdon & Beckett, NHRC 84-11 and 84-29, final regression equations; Table 5 (Siri).
// Original report scans and OCR (verified 2026-11-23):
// https://archive.org/details/DTIC_ADA143890
// https://archive.org/details/DTIC_ADA146456
// SEE: male 3.52, female 3.72 percentage points, development populations.
// SEE is NOT a personal confidence interval; external validation errors can be larger.
export const METHOD_MARGINS = {
  deurenberg: 4.1,
  "navy-male": 3.52,
  "navy-female": 3.72,
} as const;

export function parseDecimal(value: string): number | null {
  const text = value.trim().replace(",", ".");
  if (!/^\d+(?:\.\d+)?$/.test(text)) return null;
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
}
export function bmi(weight: number, heightCm: number): number {
  return weight / (heightCm / 100) ** 2;
}
export function deurenberg(bmiValue: number, age: number, sex: Sex): number {
  return 1.2 * bmiValue + 0.23 * age - 10.8 * (sex === "male" ? 1 : 0) - 5.4;
}
export function navy(
  height: number,
  neck: number,
  waist: number,
  sex: Sex,
  hip?: number,
): number {
  const difference =
    sex === "male" ? waist - neck : waist + (hip ?? NaN) - neck;
  if (difference <= 0 || height <= 0) return NaN;
  const density =
    sex === "male"
      ? 1.0324 - 0.19077 * Math.log10(difference) + 0.15456 * Math.log10(height)
      : 1.29579 - 0.35004 * Math.log10(difference) + 0.221 * Math.log10(height);
  return density > 0 ? 495 / density - 450 : NaN;
}

export function analyze(raw: RawMeasurements): Analysis {
  const errors: Analysis["errors"] = {};
  const age = parseDecimal(raw.age);
  if (age !== null && age < 18) {
    return {
      status: "underage",
      errors: { age: copy.errors.underage },
      note: UNDERAGE_NOTE,
    };
  }
  const height = parseDecimal(raw.height);
  const weight = parseDecimal(raw.weight);
  if (raw.sex !== "female" && raw.sex !== "male") errors.sex = copy.errors.sex;
  if (age === null || !Number.isInteger(age) || age < 18 || age > 80)
    errors.age = copy.errors.age;
  if (height === null || height < 120 || height > 220)
    errors.height = copy.errors.height;
  if (weight === null || weight < 30 || weight > 250)
    errors.weight = copy.errors.weight;
  if (
    Object.keys(errors).length ||
    age === null ||
    height === null ||
    weight === null ||
    !raw.sex
  ) {
    return { status: "invalid", errors, note: copy.errors.invalid };
  }
  const input: Measurements = {
    sex: raw.sex,
    age,
    height,
    weight,
    pregnant: raw.pregnant,
  };
  for (const field of ["neck", "waist", "hip"] as const) {
    if (field === "hip" && raw.sex === "male") continue;
    if (!raw[field].trim()) continue;
    const value = parseDecimal(raw[field]);
    // Broad input guard, not a clinical reference range.
    if (value === null || value <= 0 || value > 300)
      errors[field] = copy.errors.circumference;
    else input[field] = value;
  }
  if (raw.pregnant)
    return { status: "pregnancy", errors, input, note: copy.pregnancyNote };
  if (
    input.neck !== undefined &&
    input.waist !== undefined &&
    input.waist <= input.neck
  ) {
    errors.waist = copy.errors.inconsistent;
  }
  if (Object.keys(errors).length)
    return { status: "unreliable", errors, input, note: UNRELIABLE_NOTE };
  const bmiValue = bmi(weight, height);
  const complete =
    input.neck !== undefined &&
    input.waist !== undefined &&
    (input.sex === "male" || input.hip !== undefined);
  const method = complete
    ? input.sex === "male"
      ? "navy-male"
      : "navy-female"
    : "deurenberg";
  const central = complete
    ? navy(height, input.neck!, input.waist!, input.sex, input.hip)
    : deurenberg(bmiValue, age, input.sex);
  if (!Number.isFinite(central) || central < 3 || central > 60) {
    return { status: "unreliable", errors, input, note: UNRELIABLE_NOTE };
  }
  const margin = METHOD_MARGINS[method];
  return {
    status: "estimated",
    errors,
    input,
    bmi: bmiValue,
    method,
    margin,
    // Outward rounding preserves the entire SEE band. 0/100 bound the physical percentage.
    range: [
      Math.max(0, Math.floor(central - margin)),
      Math.min(100, Math.ceil(central + margin)),
    ],
    note: complete ? copy.navyNote : copy.deurenbergNote,
  };
}
export const formatNumber = (value: number, decimals = 1) =>
  new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
export const formatRange = (range: readonly [number, number]) =>
  `%${formatNumber(range[0], 0)}–${formatNumber(range[1], 0)}`;
