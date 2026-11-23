import { getSiteSettings, getSocialLinks } from "@/lib/site-settings";
import { SocialIcon } from "@/components/ui/social-icons";
import { socialPresentation } from "@/content/socials";

export async function SocialLinks({
  variant = "small",
}: {
  variant?: "small" | "footer" | "cards";
}) {
  const links = await getSocialLinks();
  if (!links.length) return null;
  const brand = (await getSiteSettings())?.brand.name ?? "Günay Turan";
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
        const isMock = link.isMock === true;
        const accessibleLabel =
          variant === "cards"
            ? `${name} ${description}${isMock ? " Örnek hesap" : ""} · ${brand}`
            : `${name} · ${link.label || name} · ${brand}${isMock ? " · örnek hesap" : ""}`;
        return (
          <a
            href={link.url}
            target={link.url.startsWith("https:") ? "_blank" : undefined}
            rel={
              link.url.startsWith("https:") ? "noopener noreferrer" : undefined
            }
            key={link.platform}
            aria-label={accessibleLabel}
            className="social-link"
            data-platform={link.platform}
            title={variant === "small" ? name : undefined}
          >
            <span className="social-icon-wrap">
              <SocialIcon platform={link.platform} />
            </span>
            {variant === "cards" ? (
              <span className="social-card-copy">
                <span className="social-name">{name}</span>{" "}
                <span className="social-description">{description}</span>{" "}
                {isMock && <small>Örnek hesap</small>}
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
