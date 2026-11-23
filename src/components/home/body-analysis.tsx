"use client";

import { useRef, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, Copy, LockKeyhole } from "lucide-react";
import {
  analyze,
  CONSENT,
  formatRange,
  parseDecimal,
  PRIVACY_NOTICE,
  UNDERAGE_NOTE,
} from "@/lib/body-analysis/calculations";
import {
  buildMessage,
  messageFits,
  whatsappUrl,
} from "@/lib/body-analysis/messages";
import type {
  Analysis,
  BodyAnalysisConfig,
  MeasurementField,
  RawMeasurements,
} from "@/lib/body-analysis/types";
import { AnalysisResult } from "./body-analysis-result";
import { useAnalysisJourney } from "./body-analysis-journey";
import { analysisCopy as copy } from "@/content/body-analysis";

const empty: RawMeasurements = {
  sex: "",
  age: "",
  height: "",
  weight: "",
  neck: "",
  waist: "",
  hip: "",
  pregnant: false,
};
const fieldInfo = copy.fieldInfo;
function MeasureHint({
  field,
  female,
}: {
  field: "neck" | "waist" | "hip";
  female: boolean;
}) {
  const position = { neck: 25, waist: 49, hip: 65 }[field];
  const hint =
    field === "neck"
      ? copy.hints.neck
      : field === "hip"
        ? copy.hints.hip
        : female
          ? copy.hints.femaleWaist
          : copy.hints.maleWaist;
  return (
    <span className="analysis-measure-hint">
      <svg viewBox="0 0 60 90" aria-hidden="true">
        <circle cx="30" cy="11" r="8" />
        <path d="M24 19v8l-9 5-3 27 8 3 3-20-1 20-5 24h10l3-21 3 21h10l-5-24-1-20 3 20 8-3-3-27-9-5v-8" />
        <path className="analysis-measure-line" d={`M15 ${position}H45`} />
      </svg>
      <span>{hint}</span>
    </span>
  );
}

export default function BodyAnalysis({
  settings,
}: {
  settings: BodyAnalysisConfig;
}) {
  const [raw, setRaw] = useState<RawMeasurements>(empty);
  const [name, setName] = useState("");
  const [localService, setLocalService] = useState(
    settings.services.find((item) => item.isDefault)?.id ??
      settings.services[0].id,
  );
  const [result, setResult] = useState<{
    analysis: Analysis;
    service: string;
  } | null>(null);
  const [preview, setPreview] = useState<{
    text: string;
    service: string;
    shortened: boolean;
  } | null>(null);
  const [consent, setConsent] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const previewRef = useRef<HTMLTextAreaElement>(null);
  const journey = useAnalysisJourney();
  const reduced = useReducedMotion();
  const candidate =
    journey?.service === "metabolik"
      ? "bireysel"
      : (journey?.service ?? localService);
  const service = settings.services.some((item) => item.id === candidate)
    ? candidate
    : (settings.services.find((item) => item.isDefault)?.id ??
      settings.services[0].id);
  const serviceLabel = settings.services.find(
    (item) => item.id === service,
  )!.label;
  const age = parseDecimal(raw.age);
  const underage = age !== null && age < 18;
  const analysis: Analysis | null = underage
    ? {
        status: "underage",
        errors: { age: copy.errors.underage },
        note: UNDERAGE_NOTE,
      }
    : result?.service === service
      ? result.analysis
      : null;
  const draft =
    preview?.service === service && analysis?.input && !underage
      ? preview
      : null;
  const errors = analysis?.errors ?? {};
  const url = draft ? whatsappUrl(settings.phone, draft.text) : null;
  const tooLong = Boolean(draft && !messageFits(settings.phone, draft.text));
  const canSend = Boolean(url && consent && !underage);

  function resetResult() {
    setResult(null);
    setPreview(null);
    setConsent(false);
    setCopyStatus("");
  }
  function change<K extends keyof RawMeasurements>(
    field: K,
    value: RawMeasurements[K],
  ) {
    setRaw((previous) => ({ ...previous, [field]: value }));
    resetResult();
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const allowed = {
      ...raw,
      neck: settings.fields.neck ? raw.neck : "",
      waist: settings.fields.waist ? raw.waist : "",
      hip: settings.fields.hip && raw.sex === "female" ? raw.hip : "",
    };
    const next = analyze(allowed);
    setResult({ analysis: next, service });
    setPreview(null);
    setConsent(false);
    setCopyStatus("");
    if (Object.keys(next.errors).length)
      requestAnimationFrame(() =>
        formRef.current
          ?.querySelector<HTMLInputElement | HTMLSelectElement>(
            '[aria-invalid="true"]',
          )
          ?.focus(),
      );
  }
  function prepareMessage() {
    if (!analysis?.input || underage) return;
    const message = buildMessage(
      settings,
      analysis,
      name,
      serviceLabel,
      settings.phone,
    );
    setPreview({
      text: message.message,
      shortened: message.shortened,
      service,
    });
    setConsent(false);
    setCopyStatus("");
    requestAnimationFrame(() => previewRef.current?.focus());
  }
  function input(field: Exclude<MeasurementField, "sex">, required = false) {
    const info = fieldInfo[field];
    return (
      <div className="analysis-field" key={field}>
        <label htmlFor={`analysis-${field}`}>
          {info.label}
          {!required && <span> · {copy.optional}</span>}
        </label>
        <div className="analysis-input-wrap">
          <input
            id={`analysis-${field}`}
            type="text"
            inputMode={field === "age" ? "numeric" : "decimal"}
            autoComplete="off"
            spellCheck={false}
            maxLength={12}
            value={raw[field]}
            placeholder={info.placeholder}
            aria-required={required}
            aria-invalid={Boolean(errors[field])}
            aria-describedby={
              `${!required ? `analysis-${field}-hint ` : ""}${errors[field] ? `analysis-${field}-error` : ""}`.trim() ||
              undefined
            }
            onChange={(event) => change(field, event.target.value)}
          />
          <span aria-hidden="true">{info.unit}</span>
        </div>
        {!required && (
          <div id={`analysis-${field}-hint`}>
            <MeasureHint
              field={field as "neck" | "waist" | "hip"}
              female={raw.sex === "female"}
            />
          </div>
        )}
        {errors[field] && (
          <p id={`analysis-${field}-error`} className="analysis-error">
            {errors[field]}
          </p>
        )}
      </div>
    );
  }
  return (
    <div className="analysis-grid">
      <div className="analysis-sticky-summary" aria-hidden="true">
        <span>{copy.summaryLabel}</span>
        <strong>
          {analysis?.range ? formatRange(analysis.range) : copy.summaryEmpty}
        </strong>
      </div>
      <form
        ref={formRef}
        className="analysis-form"
        onSubmit={submit}
        autoComplete="off"
        noValidate
      >
        <div className="analysis-step-label">
          <span>01</span> {copy.formStep}
        </div>
        <p className="analysis-local-note">
          <LockKeyhole size={15} aria-hidden="true" /> {copy.localNote}
        </p>
        <div className="analysis-fields">
          <div className="analysis-field">
            <label htmlFor="analysis-sex">{copy.sex}</label>
            <select
              id="analysis-sex"
              value={raw.sex}
              aria-required="true"
              aria-invalid={Boolean(errors.sex)}
              aria-describedby={errors.sex ? "analysis-sex-error" : undefined}
              onChange={(event) =>
                change("sex", event.target.value as RawMeasurements["sex"])
              }
            >
              <option value="">{copy.choose}</option>
              <option value="female">{copy.female}</option>
              <option value="male">{copy.male}</option>
            </select>
            {errors.sex && (
              <p className="analysis-error" id="analysis-sex-error">
                {errors.sex}
              </p>
            )}
          </div>
          {input("age", true)}
          {input("height", true)}
          {input("weight", true)}
        </div>
        <label className="analysis-checkbox">
          <input
            type="checkbox"
            checked={raw.pregnant}
            onChange={(event) => change("pregnant", event.target.checked)}
          />
          <span>{copy.pregnancy}</span>
        </label>
        {(settings.fields.neck ||
          settings.fields.waist ||
          settings.fields.hip) && (
          <details className="analysis-measures">
            <summary>
              {copy.measuresTitle} <span>{copy.optional}</span>
            </summary>
            <p>{copy.measuresNote}</p>
            <div className="analysis-fields">
              {settings.fields.neck && input("neck")}
              {settings.fields.waist && input("waist")}
              {settings.fields.hip && raw.sex === "female" && input("hip")}
            </div>
          </details>
        )}
        <div className="analysis-field analysis-name">
          <label htmlFor="analysis-name">
            {copy.name} <span>· {copy.optional}</span>
          </label>
          <input
            id="analysis-name"
            type="text"
            autoComplete="off"
            maxLength={60}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              resetResult();
            }}
            placeholder={copy.namePlaceholder}
          />
        </div>
        <div className="analysis-field">
          <label htmlFor="analysis-service">{copy.service}</label>
          <select
            id="analysis-service"
            value={service}
            onChange={(event) => {
              if (journey) journey.selectService(event.target.value);
              else setLocalService(event.target.value);
              resetResult();
            }}
          >
            {settings.services.map((item) => (
              <option value={item.id} key={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <button className="button" type="submit" disabled={underage}>
          {settings.calculateLabel}
        </button>
        <p className="analysis-form-note">{copy.formNote}</p>
      </form>
      <div className="analysis-result" aria-label={copy.resultLabel}>
        <AnalysisResult analysis={analysis} />
        {analysis?.input && analysis.status !== "invalid" && !underage && (
          <button
            className="button button-lime analysis-prepare"
            type="button"
            onClick={prepareMessage}
          >
            {copy.prepare}
          </button>
        )}
        {(underage || !settings.phone) && (
          <div className="analysis-contact-options">
            {!settings.phone && (
              <p>
                {settings.isDevelopment
                  ? copy.devPhoneWarning
                  : copy.phoneWarning}
              </p>
            )}
            {settings.phoneHref === "#iletisim" &&
              settings.emailHref === "#iletisim" && (
                <p>{copy.contactPending}</p>
              )}
            <a href={settings.phoneHref} className="text-link">
              {copy.call}
            </a>
            <a href={settings.emailHref} className="text-link">
              {copy.email}
            </a>
          </div>
        )}
      </div>
      {draft && (
        <motion.div
          className="analysis-preview"
          initial={{ opacity: 0, y: reduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.3 }}
        >
          <div>
            <div className="analysis-step-label">
              <span>02</span> {copy.previewStep}
            </div>
            <h3>{copy.previewTitle}</h3>
            <p>{copy.previewNote}</p>
          </div>
          <div className="analysis-preview-editor">
            <label htmlFor="analysis-message">{copy.previewLabel}</label>
            <textarea
              id="analysis-message"
              ref={previewRef}
              autoComplete="off"
              spellCheck={false}
              value={draft.text}
              rows={14}
              onChange={(event) => {
                setPreview({ ...draft, text: event.target.value });
                setConsent(false);
                setCopyStatus("");
              }}
              aria-describedby="analysis-preview-note"
            />
            {draft.shortened && <p className="small-note">{copy.shortened}</p>}
            {tooLong && (
              <p className="analysis-error" role="status">
                {copy.tooLong}
              </p>
            )}
            <label className="analysis-checkbox analysis-consent">
              <input
                type="checkbox"
                checked={consent}
                required
                onChange={(event) => setConsent(event.target.checked)}
              />
              <span>{CONSENT}</span>
            </label>
            <p id="analysis-preview-note" className="analysis-privacy">
              {PRIVACY_NOTICE}{" "}
              {settings.privacyUrl ? (
                <a href={settings.privacyUrl}>{copy.policy}</a>
              ) : (
                <span>{copy.policyPending}</span>
              )}
            </p>
            <div className="analysis-preview-actions">
              {canSend ? (
                <a
                  className="button"
                  href={url!}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {settings.sendLabel}
                </a>
              ) : (
                <button className="button" type="button" disabled>
                  {settings.sendLabel}
                </button>
              )}
              <button
                className="analysis-copy"
                type="button"
                onClick={async () => {
                  try {
                    if (!navigator.clipboard?.writeText)
                      throw new Error("clipboard-unavailable");
                    await navigator.clipboard.writeText(draft.text);
                    setCopyStatus(copy.copied);
                  } catch {
                    previewRef.current?.focus();
                    previewRef.current?.select();
                    setCopyStatus(copy.copyFallback);
                  }
                }}
              >
                {copyStatus === copy.copied ? (
                  <Check size={16} aria-hidden="true" />
                ) : (
                  <Copy size={16} aria-hidden="true" />
                )}
                {copy.copy}
              </button>
              <a href={settings.phoneHref} className="text-link">
                {copy.call}
              </a>
            </div>
            <p className="analysis-copy-status" role="status">
              {copyStatus ||
                (!consent
                  ? copy.consentPending
                  : !settings.phone
                    ? copy.recipientPending
                    : copy.ready)}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
