"use client";

import { useState } from "react";
import { Check, Copy, Plus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { EditorialImage } from "@/components/ui/editorial-image";
import type { HomeContent } from "@/content/home";
import type { Goal } from "@/types/content";
import { useAnalysisJourney } from "./body-analysis-journey";

export function GoalPicker({
  goals,
  whatsappBase,
  copy,
}: {
  goals: Goal[];
  whatsappBase: string | null;
  copy: HomeContent["copy"]["goals"];
}) {
  const [selected, setSelected] = useState(goals[0]?.id);
  const [copied, setCopied] = useState(false);
  const journey = useAnalysisJourney();
  const goal = goals.find((item) => item.id === selected) ?? goals[0];
  if (!goal) return null;
  const whatsapp = whatsappBase
    ? `${whatsappBase}?text=${encodeURIComponent(goal.message)}`
    : "#iletisim";
  return (
    <section className="section goals-section" aria-labelledby="goals-title">
      <Container>
        <div className="section-title-row">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 id="goals-title">
              {copy.title}
              <br />
              <em>{copy.accent}</em>
            </h2>
          </div>
          <p>{copy.description}</p>
        </div>
        <div className="goal-grid">
          {goals.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`goal-card ${selected === item.id ? "selected" : ""}`}
              aria-pressed={selected === item.id}
              aria-controls="hedef-detay"
              onClick={() => {
                setSelected(item.id);
                setCopied(false);
                journey?.selectService(item.service);
              }}
            >
              {selected === item.id && (
                <span className="goal-image">
                  <EditorialImage
                    name={item.image}
                    sizes="(max-width: 600px) 90vw, 35vw"
                  />
                </span>
              )}
              <span className="goal-card-copy">
                <span className="goal-indicator" aria-hidden="true">
                  {selected === item.id ? (
                    <Check size={18} />
                  ) : (
                    <Plus size={18} />
                  )}
                </span>
                <span className="goal-title">{item.title}</span>
                <span className="goal-description">{item.description}</span>
              </span>
            </button>
          ))}
        </div>
        <div id="hedef-detay" className="goal-detail">
          <div>
            <p className="eyebrow">İlk mesajın hazır</p>
            <p className="goal-message" aria-live="polite">
              “{goal.message}”
            </p>
            <p className="small-note">
              {whatsappBase
                ? "WhatsApp'a geçince mesajı düzenleyip gönderebilirsin."
                : "Örnek önizleme: telefon onaylanana kadar mesaj gönderilmez."}
            </p>
          </div>
          <div className="goal-actions">
            <a className="button" href={`#hizmet-${goal.service}`}>
              İlgili hizmeti gör
            </a>
            <a
              className="text-link"
              href={whatsapp}
              target={whatsappBase ? "_blank" : undefined}
              rel={whatsappBase ? "noopener noreferrer" : undefined}
            >
              WhatsApp ile bilgi al
            </a>
            <button
              className="copy-message"
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(goal.message);
                  setCopied(true);
                } catch {
                  setCopied(false);
                }
              }}
            >
              <Copy size={14} />
              {copied ? "Mesaj kopyalandı" : "Mesajı kopyala"}
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
