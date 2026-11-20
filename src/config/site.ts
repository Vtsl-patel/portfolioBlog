/** Site-level constants (URL, assets, SEO defaults). Server-only: reads non-public env vars. */

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit;

  // Vercel system env vars (hostnames, no protocol); enable "Automatically expose System Environment Variables".
  const vercelEnv = process.env.VERCEL_ENV;
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const deployment = process.env.VERCEL_URL?.trim();
  if (vercelEnv === "production" && production) return `https://${production}`;
  if (deployment) return `https://${deployment}`;

  return "http://localhost:3000";
}

/** Only real production is indexed; previews are noindex. */
const indexable = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production";

export const siteConfig = {
  name: "Vatsal Patel",
  title: "Vatsal Patel | Software Engineer",
  titleTemplate: "%s | Vatsal Patel",
  description:
    "Portfolio of Vatsal Patel, Software Engineer at DevRev. Building scalable web platforms with Next.js, React, TypeScript, internationalization and end-to-end testing.",
  /** Absolute origin without trailing slash. */
  url: resolveSiteUrl().replace(/\/+$/, ""),
  indexable,
  locale: "en_US",
  resume: {
    href: "/resume.pdf",
    downloadName: "Vatsal_Patel_Resume.pdf"
  },
  keywords: [
    "Vatsal Patel",
    "Software Engineer",
    "Frontend Engineer",
    "DevRev",
    "Next.js",
    "React",
    "TypeScript",
    "Microfrontends",
    "Internationalization",
    "IIIT Nagpur",
    "Portfolio"
  ]
} as const;

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
