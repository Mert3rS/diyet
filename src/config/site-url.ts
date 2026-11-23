import { siteConfig } from "./site";

export function getSiteUrl() {
  return (
    process.env.SITE_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    siteConfig.productionUrl
  );
}
