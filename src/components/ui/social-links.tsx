import { getSocialLinks } from "@/lib/site-settings";
import { SocialIcon } from "@/components/ui/social-icons";
import { MagneticLink } from "@/components/ui/magnetic-link";
import { siteConfig, USE_MOCK_CONTENT } from "@/config/site";

export async function SocialLinks({
  variant = "small",
}: {
  variant?: "small" | "footer" | "edge" | "cards";
}) {
  const links = await getSocialLinks();
  if (!links.length) return null;
  return (
    <div
      className={`social-links social-${variant}`}
      role="group"
      aria-label="Sosyal medya hesapları"
    >
      {links.map((link) => (
        <MagneticLink
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          key={link.platform}
          aria-label={`${link.label || link.platform}${variant === "cards" && USE_MOCK_CONTENT ? " Örnek hesap" : ""} · ${siteConfig.name}${variant !== "cards" && USE_MOCK_CONTENT ? " · örnek hesap" : ""}`}
          className="social-link"
        >
          <SocialIcon platform={link.platform} />
          {variant === "cards" && (
            <span>
              {link.label} {USE_MOCK_CONTENT && <small>Örnek hesap</small>}
            </span>
          )}
        </MagneticLink>
      ))}
    </div>
  );
}
