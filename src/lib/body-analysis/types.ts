export type Sex = "female" | "male";
export type MeasurementField =
  "sex" | "age" | "height" | "weight" | "neck" | "waist" | "hip";
export type RawMeasurements = Record<
  Exclude<MeasurementField, "sex">,
  string
> & {
  sex: Sex | "";
  pregnant: boolean;
};
export type Measurements = {
  sex: Sex;
  age: number;
  height: number;
  weight: number;
  neck?: number;
  waist?: number;
  hip?: number;
  pregnant: boolean;
};
export type Analysis = {
  status: "invalid" | "underage" | "pregnancy" | "unreliable" | "estimated";
  errors: Partial<Record<MeasurementField, string>>;
  input?: Measurements;
  bmi?: number;
  range?: readonly [number, number];
  method?: "deurenberg" | "navy-male" | "navy-female";
  margin?: number;
  note: string;
};
export type AnalysisService = { id: string; label: string; isDefault: boolean };
export type BodyAnalysisSettings = {
  enabled: boolean;
  title: string;
  subtitle: string;
  description: string;
  calculateLabel: string;
  sendLabel: string;
  services: AnalysisService[];
  fields: { neck: boolean; waist: boolean; hip: boolean };
  messageTemplate: string;
  includeBmi: boolean;
  includeFat: boolean;
  whatsappOverride: string;
};
export type BodyAnalysisConfig = BodyAnalysisSettings & {
  phone: string | null;
  phoneHref: string;
  emailHref: string;
  privacyUrl: string | null;
  isDevelopment: boolean;
};
