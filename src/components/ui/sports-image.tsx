"use client";
import Image from "next/image";
import { imageLibrary, sportsImages } from "@/content/images";
import { useSitePhotos } from "@/components/site/site-media";
import type { ImageKey } from "@/types/content";
import type { ManagedImage } from "@/types/site-settings";

export function SportsImage({
  name,
  photo,
  field,
  className,
  sizes = "(max-width: 700px) 90vw, 33vw",
  eager = false,
  decorative = false,
}: {
  name: string;
  photo?: ManagedImage | null;
  field?: string;
  className?: string;
  sizes?: string;
  eager?: boolean;
  decorative?: boolean;
}) {
  const photos = useSitePhotos();
  const key = Object.hasOwn(imageLibrary, name) ? (name as ImageKey) : "salad";
  const fallback =
    name === "running" ? sportsImages.running : imageLibrary[key];
  const managed = photo ?? (name === "running" ? undefined : photos[key]);
  return (
    <Image
      data-sports-field={field}
      data-site-photo={name}
      src={managed?.url ?? fallback.src}
      alt={decorative ? "" : (managed?.alt ?? fallback.alt)}
      fill
      sizes={sizes}
      placeholder={managed ? "empty" : "blur"}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      quality={60}
      className={className}
    />
  );
}
