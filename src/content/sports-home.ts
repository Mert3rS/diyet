import "server-only";
import { cache } from "react";
import { readGlobal } from "@/lib/cms";
import { flag, mergeKnown, record } from "@/lib/content-normalize";
import { defaultSportsHome, type SportsHomeContent } from "./sports-defaults";
import type { ManagedImage } from "@/types/site-settings";

export function managedPhoto(value: unknown): ManagedImage | null {
  const data = record(value);
  if (
    typeof data.url !== "string" ||
    !data.url.startsWith("/api/media/file/") ||
    data.url.includes("..")
  )
    return null;
  return {
    url: data.url,
    alt: typeof data.alt === "string" ? data.alt : "Site görseli",
  };
}
const stringRows = (value: unknown, key: string) =>
  Array.isArray(value)
    ? value
        .slice(0, 30)
        .map((row) => record(row)[key])
        .filter((item): item is string => typeof item === "string")
    : [];
export const getSportsHome = cache(
  async (): Promise<SportsHomeContent | null> => {
    const data = await readGlobal("sports-homepage");
    if (!data?.initialized) return null;
    const normalized = structuredClone(data);
    if (Array.isArray(data.services))
      normalized.services = data.services.map((value) => ({
        ...record(value),
        scope: stringRows(record(value).scope, "text"),
      }));
    const dashboard = record(data.dashboard);
    normalized.dashboard = {
      ...dashboard,
      rings: stringRows(dashboard.rings, "label"),
      timeline: stringRows(dashboard.timeline, "label"),
      chips: stringRows(dashboard.chips, "label"),
    };
    normalized.branches = stringRows(data.branches, "label");
    const content = mergeKnown(
      defaultSportsHome(),
      normalized,
    ) as SportsHomeContent;
    for (const key of ["slides", "recipes", "socialTiles"] as const) {
      const raw = Array.isArray(data[key]) ? data[key] : [];
      content[key].forEach((row, index) => {
        row.photo = managedPhoto(record(raw[index]).photo);
      });
    }
    content.socialTiles.forEach((row, index) => {
      const raw = record((data.socialTiles as unknown[])?.[index]);
      if (!raw.image) row.image = null;
    });
    for (const key of [
      "slides",
      "services",
      "audiences",
      "method",
      "events",
      "recipes",
      "socialTiles",
      "media",
      "testimonials",
      "faqs",
    ] as const) {
      // A hidden row is excluded from rendering while its CMS record is retained.
      Object.assign(content, {
        [key]: content[key].filter((row) => row.visible !== false),
      });
    }
    content.isMock = flag(data.isMock, true);
    return content;
  },
);
