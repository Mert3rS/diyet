import { HeroSection } from "@/components/home/hero-section";
import { getHomepageContent } from "@/content/home";
import { HomeSections, PackagesSection } from "@/components/home/home-sections";
import { ProcessSection } from "@/components/home/process-section";
import { GoalPicker } from "@/components/home/goal-picker";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { BlogSection } from "@/components/home/closing-sections";
import { BodyAnalysisSection } from "@/components/home/body-analysis-section";
import { BodyAnalysisJourney } from "@/components/home/body-analysis-journey";
import { FaqSection } from "@/components/home/faq-section";
import { ContactSection } from "@/components/home/contact-section";
import { getBodyAnalysisSettings, getContactLinks } from "@/lib/site-settings";

export default async function HomePage() {
  const content = await getHomepageContent();
  const contactLinks = await getContactLinks();
  const analysisSettings = await getBodyAnalysisSettings();
  if (!content)
    return (
      <div className="container section">
        <h1>İçerik hazırlanıyor.</h1>
        <p id="iletisim">Günay Turan · Yayın hazırlığı devam ediyor.</p>
      </div>
    );
  return (
    <>
      <HeroSection
        copy={content.copy.hero}
        trust={content.trust}
        showBodyAnalysis={analysisSettings.enabled}
      />
      <HomeSections content={content} />
      <ProcessSection copy={content.copy.process} steps={content.process} />
      <BodyAnalysisJourney
        initialService={content.goals[0]?.service ?? "fiyat"}
      >
        <GoalPicker
          copy={content.copy.goals}
          goals={content.goals}
          whatsappBase={contactLinks.whatsappBase}
        />
        <BodyAnalysisSection settings={analysisSettings} />
      </BodyAnalysisJourney>
      <PackagesSection
        copy={content.copy.packages}
        packages={content.packages}
      />
      <TestimonialsSection
        copy={content.copy.testimonials}
        items={content.testimonials}
      />
      <BlogSection copy={content.copy.blog} items={content.blog} />
      <FaqSection copy={content.copy.faq} items={content.faqs} />
      <ContactSection copy={content.copy.contact} />
    </>
  );
}
