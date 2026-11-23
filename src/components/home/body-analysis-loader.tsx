"use client";

import dynamic from "next/dynamic";
import { useInView } from "motion/react";
import { useRef } from "react";
import type { BodyAnalysisConfig } from "@/lib/body-analysis/types";
import { analysisCopy } from "@/content/body-analysis";
const BodyAnalysis = dynamic(() => import("./body-analysis"), {
  loading: () => <p role="status">{analysisCopy.loading}</p>,
});
export function BodyAnalysisLoader({
  settings,
}: {
  settings: BodyAnalysisConfig;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, margin: "400px" });
  return (
    <div ref={ref} className="analysis-shell">
      {visible ? (
        <BodyAnalysis settings={settings} />
      ) : (
        <p>{analysisCopy.deferred}</p>
      )}
      <noscript>{analysisCopy.noscript}</noscript>
    </div>
  );
}
