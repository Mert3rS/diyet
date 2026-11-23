"use client";
import { createContext, useContext, type ReactNode } from "react";
import type { SitePhotos } from "@/types/site-settings";
const MediaContext = createContext<SitePhotos>({});
export function SiteMediaProvider({
  photos,
  children,
}: {
  photos: SitePhotos;
  children: ReactNode;
}) {
  return (
    <MediaContext.Provider value={photos}>{children}</MediaContext.Provider>
  );
}
export function useSitePhotos() {
  return useContext(MediaContext);
}
