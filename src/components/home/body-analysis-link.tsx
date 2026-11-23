import { analysisCopy } from "@/content/body-analysis";
export function BodyAnalysisHeroLink({ enabled }: { enabled: boolean }) {
  return enabled ? (
    <a href="#analiz" className="text-link">
      {analysisCopy.heroLink}
    </a>
  ) : null;
}
