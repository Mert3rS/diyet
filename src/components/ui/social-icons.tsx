import type { ReactNode } from "react";
import type { SocialPlatform } from "@/types/content";

// Platform simgeleri: özgün inline SVG çizimleri, currentColor ile renklendirilir.
const paths: Record<SocialPlatform, ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
    </>
  ),
  youtube: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none" />
    </>
  ),
  tiktok: <path d="M14 3v12a4 4 0 1 1-4-4M14 3c0 4 3 6 6 6V6c-2 0-3-1-3-3Z" />,
  facebook: (
    <path d="M14 22V13h3l1-4h-4V7c0-1 .5-2 2-2h2V1h-3c-4 0-6 2-6 6v2H6v4h3v9" />
  ),
  x: (
    <>
      <path d="m4 3 16 18h-4L2 3Z" />
      <path d="M20 3 4 21" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="8" width="4" height="13" />
      <circle cx="5" cy="4" r="2" />
      <path d="M11 21V9h4v2c4-4 7-1 7 3v7h-4v-7c0-3-3-3-3 0v7Z" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M20 11.5A8.5 8.5 0 0 1 7 19l-5 2 1.5-5A8.5 8.5 0 1 1 20 11.5Z" />
      <path d="M8 7c-2 3 3 8 6 8l2-2-3-1-1 1-2-2 1-1-1-3Z" />
    </>
  ),
  telegram: (
    <>
      <path d="m2 10 20-8-4 20-6-6-4 3v-6Z" />
      <path d="m8 13 10-7-6 10" />
    </>
  ),
  threads: (
    <path d="M19 7c-2-6-14-6-14 5 0 12 15 11 15 3 0-7-12-7-11 0 1 5 8 2 7-5-1-5-6-4-7-2" />
  ),
  pinterest: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 21 3-14M11 14c5 6 10-7 3-8-5-1-8 5-5 8" />
    </>
  ),
};
export function SocialIcon({ platform }: { platform: SocialPlatform }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[platform]}
    </svg>
  );
}
