import { getSocialLinks } from "@/lib/site-settings";
import { SocialIcon } from "@/components/ui/social-icons";
import { siteConfig, USE_MOCK_CONTENT } from "@/config/site";
import { socialPresentation } from "@/content/socials";

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
      {links.map((link) => {
        const presentation = socialPresentation[link.platform];
        const name = presentation.name;
        const description = link.label || presentation.description;
        const accessibleLabel =
          variant === "cards"
            ? `${name} ${description}${USE_MOCK_CONTENT ? " Örnek hesap" : ""} · ${siteConfig.name}`
            : `${name} · ${link.label || name} · ${siteConfig.name}${USE_MOCK_CONTENT ? " · örnek hesap" : ""}`;
        return (
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            key={link.platform}
            aria-label={accessibleLabel}
            className="social-link"
            data-platform={link.platform}
            title={variant === "small" || variant === "edge" ? name : undefined}
          >
            <span className="social-icon-wrap">
              <SocialIcon platform={link.platform} />
            </span>
            {variant === "cards" ? (
              <span className="social-card-copy">
                <span className="social-name">{name}</span>{" "}
                <span className="social-description">{description}</span>{" "}
                {USE_MOCK_CONTENT && <small>Örnek hesap</small>}
              </span>
            ) : variant === "footer" ? (
              <span className="social-name">{name}</span>
            ) : null}
          </a>
        );
      })}
    </div>
  );
}
