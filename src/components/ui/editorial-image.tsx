"use client";

import Image from "next/image";
import { useSitePhotos } from "@/components/site/site-media";
import { imageLibrary } from "@/content/images";
import type { ImageKey } from "@/types/content";

export function EditorialImage({
  name,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 90vw, 40vw",
}: {
  name: ImageKey;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const image = imageLibrary[name];
  const managed = useSitePhotos()[name];
  return (
    <Image
      data-site-photo={name}
      src={managed?.url ?? image.src}
      alt={managed?.alt ?? image.alt}
      fill
      sizes={sizes}
      placeholder={managed ? "empty" : "blur"}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      quality={60}
      className={`editorial-image ${className}`}
    />
  );
}
