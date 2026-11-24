import { SportsHero } from "@/components/home/sports-hero";
import {
  AudienceSection,
  SportsAbout,
  SportsServices,
  EventsSection,
  RecipesSection,
  SportsSocial,
  FaqBlock,
  SportsContact,
} from "@/components/home/sports-sections";
import {
  StickyStory,
  SportsTestimonials,
} from "@/components/home/sports-interactions";
import { getSportsHome } from "@/content/sports-home";
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ editor?: string }>;
}) {
  const [content, query] = await Promise.all([getSportsHome(), searchParams]);
  if (!content)
    return (
      <section className="container section">
        <h1>İçerik hazırlanıyor.</h1>
        <p id="iletisim">Ana sayfa içeriği hazırlanıyor.</p>
      </section>
    );
  const shown = content.sections;
  const heroContent = {
    hero: content.hero,
    slides: content.slides,
    dashboard: content.dashboard,
    sections: content.sections,
    branches: content.branches,
  };
  return (
    <>
      <SportsHero content={heroContent} editorMode={query.editor === "1"} />
      {shown.audience && <AudienceSection content={content} />}
      {shown.about && <SportsAbout content={content} />}
      {shown.services && <SportsServices content={content} />}
      {shown.method && (
        <StickyStory items={content.method} copy={content.copy.method} />
      )}
      {shown.events && <EventsSection content={content} />}
      {shown.recipes && <RecipesSection content={content} />}
      {shown.social && <SportsSocial content={content} />}
      {shown.testimonials && (
        <SportsTestimonials
          items={content.testimonials}
          copy={content.copy.testimonials}
        />
      )}
      {shown.faq && <FaqBlock content={content} />}
      {shown.contact && <SportsContact content={content} />}
    </>
  );
}
