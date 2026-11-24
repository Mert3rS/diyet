import { getPayload } from "payload";
import config from "@payload-config";
import { defaultSiteSettings } from "@/content/site-defaults";
import { defaultHomepageContent } from "@/content/home-defaults";
import { defaultBodyAnalysisSettings } from "@/content/body-analysis";
import { sportsSeedData } from "@/content/sports-defaults";

const payload = await getPayload({ config });
try {
  const count = await payload.count({
    collection: "users",
    overrideAccess: true,
  });
  if (count.totalDocs === 0) {
    const email = process.env.CMS_ADMIN_EMAIL;
    const password = process.env.CMS_ADMIN_PASSWORD;
    if (!email || !password || password.length < 20)
      throw new Error("Bootstrap account missing");
    await payload.create({
      collection: "users",
      overrideAccess: true,
      context: { bootstrapAdmin: true },
      data: { email, password, name: "Yönetici", role: "admin" },
    });
  }
  const home = defaultHomepageContent();
  const homeData = {
    ...home,
    initialized: true,
    goals: home.goals.map(({ id, ...row }) => ({ ...row, key: id })),
    testimonials: home.testimonials.map(({ id, ...row }) => ({
      ...row,
      key: id,
    })),
    packages: home.packages.map((row) => ({
      ...row,
      scope: row.scope.map((text) => ({ text })),
    })),
  };
  const body = defaultBodyAnalysisSettings(
    process.env.CMS_ENVIRONMENT !== "development",
  );
  const bodyData = {
    ...body,
    initialized: true,
    services: body.services.map(({ id, ...row }) => ({ ...row, key: id })),
  };
  for (const [slug, data] of [
    ["site-settings", defaultSiteSettings],
    ["homepage", homeData],
    ["sports-homepage", sportsSeedData()],
    ["body-analysis-settings", bodyData],
  ] as const) {
    const current = await payload.findGlobal({ slug, overrideAccess: true });
    if (!("initialized" in current) || !current.initialized)
      await payload.updateGlobal({
        slug,
        data,
        overrideAccess: true,
        context: { skipRevalidate: true },
      });
  }
  console.log(
    "[CMS_INIT] Yönetici ve başlangıç içerikleri hazır. Mevcut içerikler ve şifreler değiştirilmedi.",
  );
} catch {
  console.error(
    "[CMS_INIT_FAILED] İlk kurulum tamamlanamadı; ortam, şema ve bağlantıyı kontrol edin. Gizli değerler yazdırılmadı.",
  );
  process.exitCode = 1;
} finally {
  await payload.destroy();
}
