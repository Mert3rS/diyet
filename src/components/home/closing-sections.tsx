import type { HomeContent } from "@/content/home";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { EditorialImage } from "@/components/ui/editorial-image";
import type { BlogPreview } from "@/types/content";

export function BlogSection({
  items,
  copy,
}: {
  items: BlogPreview[];
  copy: HomeContent["copy"]["blog"];
}) {
  return (
    <section className="section blog-section" aria-labelledby="blog-title">
      <Container>
        <Reveal className="section-title-row">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 id="blog-title">
              {copy.title}
              <br />
              <em>{copy.accent}</em>
            </h2>
          </div>
          <p>{copy.description}</p>
        </Reveal>
        <div className="blog-grid">
          {items.map((item) => (
            <Reveal key={item.title}>
              <article className="blog-card">
                <div className="blog-image image-frame">
                  <EditorialImage
                    name={item.image}
                    sizes="(max-width: 600px) 90vw, 30vw"
                  />
                  <span className="soon-badge">Yakında</span>
                </div>
                <p className="blog-category">
                  {item.category}
                  <span>{item.readingTime}</span>
                </p>
                <h3>{item.title}</h3>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
