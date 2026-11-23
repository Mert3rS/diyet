import type { SocialPlatform } from "@/types/content";
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
      {platform === "instagram" ? (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
        </>
      ) : (
        <>
          <path d="M21 11.5a9 9 0 0 1-13.4 7.9L3 21l1.6-5A9 9 0 1 1 21 11.5Z" />
          <path
            d="M8.3 7.6c-.4.1-.9.8-.8 1.7.2 2.8 3.5 6 6.1 6.2.9.1 1.6-.5 1.8-1l-2.3-1.2-.9.9c-1.4-.6-2.5-1.7-3.1-3.1l.9-.9-1.2-2.6Z"
            fill="currentColor"
            stroke="none"
          />
        </>
      )}
    </svg>
  );
}
