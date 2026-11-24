import { getPayload } from "payload";
import config from "@payload-config";
import { navigation, siteConfig } from "@/config/site";

// Run once for an existing installation; normal bootstrap never overwrites it.
const payload = await getPayload({ config });
try {
  const site = await payload.findGlobal({
    slug: "site-settings",
    overrideAccess: true,
  });
  const brand = { ...site.brand };
  if (brand.tagline === "BESLENME & YAŞAM")
    brand.tagline = siteConfig.descriptor;
  if (brand.footerEyebrow === "Kendine iyi gelmeye yer aç.")
    brand.footerEyebrow = "Beslenme. Hareket. Senin ritmin.";
  brand.title ??= siteConfig.title;
  brand.titleStatus ??= siteConfig.titleStatus;
  brand.descriptorStatus ??= siteConfig.descriptorStatus;
  brand.bookingUrl ??= "";
  const original = site.navigation ?? [];
  const oldAnchors = ["hakkimda", "hizmetler", "surec", "sss", "iletisim"];
  const untouched =
    original.length === 5 &&
    original.every(
      (row, index) =>
        row.anchor === oldAnchors[index] &&
        row.visible !== false &&
        ["Hakkımda", "Hizmetler", "Süreç", "Sıkça sorulanlar", "İletişim"][
          index
        ] === row.label,
    );
  const menu: Array<{
    anchor: string;
    label: string;
    visible?: boolean | null;
    id?: string | null;
  }> = untouched
    ? navigation.map((item) => ({
        anchor: item.href.slice(1),
        label: item.label,
        visible: true,
      }))
    : original.map((row) => ({
        ...row,
        anchor: row.anchor === "surec" ? "sistem" : row.anchor,
        label:
          row.anchor === "surec" && row.label === "Süreç"
            ? "Sistem"
            : row.label,
      }));
  for (const item of navigation)
    if (!menu.some((row) => row.anchor === item.href.slice(1)))
      menu.push({
        anchor: item.href.slice(1),
        label: item.label,
        visible: true,
      });
  await payload.updateGlobal({
    slug: "site-settings",
    overrideAccess: true,
    context: { skipRevalidate: true },
    data: { brand, navigation: menu as NonNullable<typeof site.navigation> },
  });
  console.log(
    "[SPORTS_SETTINGS_UPGRADED] Yeni alanlar ve bölüm bağlantıları hazır; özel içerikler ve iletişim bilgileri korundu.",
  );
} finally {
  await payload.destroy();
}
