import Image from "next/image";
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
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      placeholder="blur"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      quality={60}
      className={`editorial-image ${className}`}
    />
  );
}
