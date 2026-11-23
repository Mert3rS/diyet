import { Container } from "@/components/ui/container";
import { analysisCopy } from "@/content/body-analysis";
import { BodyAnalysisLoader } from "./body-analysis-loader";
import type { BodyAnalysisConfig } from "@/lib/body-analysis/types";

export function BodyAnalysisSection({
  settings,
}: {
  settings: BodyAnalysisConfig;
}) {
  if (!settings.enabled) return null;
  return (
    <section
      id="analiz"
      className="section body-analysis-section"
      aria-labelledby="analysis-title"
    >
      <span id="hesaplayici" aria-hidden="true" />
      <Container>
        <div className="section-title-row">
          <div>
            <p className="eyebrow">{analysisCopy.eyebrow}</p>
            <h2 id="analysis-title">
              {settings.title}
              <br />
              <em>{settings.subtitle}</em>
            </h2>
          </div>
          <p>{settings.description}</p>
        </div>
        <BodyAnalysisLoader settings={settings} />
      </Container>
    </section>
  );
}
