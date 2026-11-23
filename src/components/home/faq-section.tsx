import { Plus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { HomeContent } from "@/content/home";
import type { Faq } from "@/types/content";

export function FaqSection({
  items,
  copy,
}: {
  items: Faq[];
  copy: HomeContent["copy"]["faq"];
}) {
  return (
    <section
      id="sss"
      className="section faq-section"
      aria-labelledby="faq-title"
    >
      <Container className="faq-grid">
        <Reveal>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 id="faq-title">
            {copy.title}
            <br />
            <em>{copy.accent}</em>
          </h2>
          <p className="section-description">{copy.description}</p>
          <p className="small-note">
            Yanıtlar örnektir; kişisel tıbbi öneri içermez.
          </p>
        </Reveal>
        <div className="faq-list">
          {items.map((item) => (
            <details key={item.question}>
              <summary>
                {item.question}
                <Plus size={20} aria-hidden="true" />
              </summary>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
