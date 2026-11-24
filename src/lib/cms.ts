import "server-only";
import { cache } from "react";

export const getCms = cache(async () => {
  const [{ getPayload }, { default: config }] = await Promise.all([
    import("payload"),
    import("@payload-config"),
  ]);
  return getPayload({ config });
});
export const readGlobal = cache(
  async (
    slug: "site-settings" | "homepage" | "body-analysis-settings" | "sports-homepage",
  ): Promise<Record<string, unknown> | null> => {
    if (!process.env.DATABASE_URI || !process.env.PAYLOAD_SECRET) return null;
    try {
      const payload = await getCms();
      return (await payload.findGlobal({
        slug,
        depth: 1,
        overrideAccess: false,
      })) as unknown as Record<string, unknown>;
    } catch {
      console.error(`[CMS_READ_FAILED] ${slug}`);
      return null;
    }
  },
);
