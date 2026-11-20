import { absoluteUrl, siteConfig } from "@/config/site";
import type { PortfolioData } from "@/types/portfolio";

/** schema.org Person + WebSite graph. Omits phone/email on purpose. */
export function buildHomeJsonLd(data: PortfolioData) {
  const { profile, skills, education } = data;
  const personId = `${absoluteUrl("/")}#person`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: profile.name,
        url: absoluteUrl("/"),
        jobTitle: profile.role,
        description: siteConfig.description,
        address: { "@type": "PostalAddress", addressLocality: profile.location },
        worksFor: { "@type": "Organization", name: profile.company },
        alumniOf: education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.institution })),
        knowsAbout: skills.flatMap((g) => g.skills),
        sameAs: profile.socials.map((s) => s.url)
      },
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl("/")}#website`,
        url: absoluteUrl("/"),
        name: `${profile.name} Portfolio`,
        inLanguage: "en",
        about: { "@id": personId },
        publisher: { "@id": personId }
      }
    ]
  };
}

/** Serialise for an inline <script>; escapes "<" so content can't close the tag. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
