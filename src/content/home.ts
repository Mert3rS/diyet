import { cache } from "react";
import { defaultHomepageContent, type HomeContent } from "./home-defaults";
import { readGlobal } from "@/lib/cms";
import { getSiteSettings } from "@/lib/site-settings";
import { flag, mergeKnown, record } from "@/lib/content-normalize";
export type { HomeContent } from "./home-defaults";
export const getHomepageContent = cache(
  async (): Promise<HomeContent | null> => {
    const data = await readGlobal("homepage");
    if (!data?.initialized) return null;
    const normalized = { ...data };
    for (const key of ["goals", "testimonials"] as const) {
      normalized[key] = Array.isArray(data[key])
        ? data[key].map((value) => {
            const row = record(value);
            return { ...row, id: row.key };
          })
        : [];
    }
    normalized.packages = Array.isArray(data.packages)
      ? data.packages.map((value) => {
          const row = record(value);
          return {
            ...row,
            scope: Array.isArray(row.scope)
              ? row.scope.map((value) => record(value).text)
              : [],
          };
        })
      : [];
    const content = mergeKnown(
      defaultHomepageContent(),
      normalized,
    ) as HomeContent;
    content.isMock = flag(data.isMock, true);
    for (const group of Object.values(content.copy))
      group.isMock = content.isMock;
    content.identity.isMock = content.isMock;
    const site = await getSiteSettings();
    if (site) content.identity.name = site.brand.name;
    for (const list of [
      content.services,
      content.tags,
      content.trust,
      content.process,
      content.goals,
      content.packages,
      content.testimonials,
      content.blog,
      content.faqs,
    ])
      for (const item of list) item.isMock = content.isMock;
    const icons = ["leaf", "screen", "activity", "flower", "sprout", "heart"];
    content.services = content.services.filter(
      (row) => /^[a-z0-9-]{1,40}$/.test(row.slug) && icons.includes(row.icon),
    );
    const images = ["salad", "fruit", "preparation", "breakfast"];
    content.process = content.process.filter((row) =>
      images.includes(row.image),
    );
    content.goals = content.goals.filter((row) => images.includes(row.image));
    content.blog = content.blog.filter((row) => images.includes(row.image));
    return content;
  },
);
