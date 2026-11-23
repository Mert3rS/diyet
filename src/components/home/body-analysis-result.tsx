"use client";

import { animate, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import {
  DISCLAIMER,
  formatNumber,
  formatRange,
} from "@/lib/body-analysis/calculations";
import type { Analysis } from "@/lib/body-analysis/types";
import { analysisCopy as copy } from "@/content/body-analysis";

function RangeArc({ range }: { range: readonly [number, number] }) {
  const reduced = useReducedMotion();
  const text = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Count both range endpoints; a single precise central estimate is never presented.
    const control = animate(0, 1, {
      duration: 0.65,
      ease: "easeOut",
      onUpdate: (progress) => {
        if (text.current)
          text.current.textContent = formatRange([
            Math.round(range[0] * progress),
            Math.round(range[1] * progress),
          ]);
      },
    });
    return () => control.stop();
  }, [range]);
  const angle = (percentage: number) => Math.PI + (percentage / 100) * Math.PI;
  const point = (percentage: number) => {
    const a = angle(percentage);
    return `${150 + 115 * Math.cos(a)} ${145 + 115 * Math.sin(a)}`;
  };
  const band = `M ${point(range[0])} A 115 115 0 0 1 ${point(range[1])}`;
  return (
    <div className="analysis-arc">
      <svg
        viewBox="0 0 300 175"
        role="img"
        aria-label={`${copy.rangeAnnouncement} ${formatRange(range)}`}
      >
        <path
          d="M35 145 A115 115 0 0 1 265 145"
          fill="none"
          stroke="currentColor"
          strokeWidth="17"
          opacity="0.1"
          strokeLinecap="round"
        />
        <motion.g
          initial={{
            clipPath: reduced ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
          }}
          animate={{ clipPath: "inset(0 0 0 0)" }}
          transition={{ duration: reduced ? 0 : 0.8 }}
        >
          <path
            d={band}
            fill="none"
            stroke="currentColor"
            strokeWidth="25"
            strokeLinecap="round"
            opacity="0.5"
          />
        </motion.g>
      </svg>
      <div className="analysis-range">
        <span ref={text} aria-hidden="true">
          {formatRange(range)}
        </span>
        <span className="sr-only">{formatRange(range)}</span>
        <small>{copy.rangeLabel}</small>
      </div>
    </div>
  );
}

export function AnalysisResult({ analysis }: { analysis: Analysis | null }) {
  const reduced = useReducedMotion();
  return (
    <>
      <div className="analysis-live sr-only" role="status" aria-atomic="true">
        {analysis
          ? analysis.range
            ? `${copy.rangeAnnouncement} ${formatRange(analysis.range)}. ${analysis.note}`
            : analysis.note
          : copy.initialAnnouncement}
      </div>
      <motion.div
        key={analysis?.status ?? "empty"}
        className="analysis-result-content"
        initial={{ opacity: 0, y: reduced ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.3 }}
      >
        <p className="eyebrow">{copy.resultEyebrow}</p>
        <h3>
          {analysis?.status === "estimated"
            ? copy.resultTitle
            : copy.emptyTitle}
        </h3>
        {analysis?.range ? (
          <RangeArc range={analysis.range} />
        ) : (
          <div className="analysis-empty-mark" aria-hidden="true">
            ✳
          </div>
        )}
        <p>{analysis?.note ?? copy.emptyResult}</p>
        {analysis?.bmi !== undefined && (
          <p className="analysis-bmi">
            {copy.bmiLabel} <strong>{formatNumber(analysis.bmi)}</strong>
          </p>
        )}
        {analysis?.method && (
          <p className="analysis-method-label">
            {analysis.method === "deurenberg" ? "Deurenberg" : "US Navy"} ·{" "}
            {copy.standardError} ±{formatNumber(analysis.margin!, 2)}{" "}
            {copy.percentagePoints}
          </p>
        )}
      </motion.div>
      <div className="analysis-disclaimer">
        <p>{DISCLAIMER}</p>
        <details>
          <summary>{copy.methodTitle}</summary>
          <div>
            {copy.methodParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p>
              {copy.sourceLabel}:{" "}
              {copy.sources.map((source, index) => (
                <span key={source.url}>
                  {index > 0 && "; "}
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {source.label}
                  </a>
                </span>
              ))}
              .
            </p>
          </div>
        </details>
      </div>
    </>
  );
}
