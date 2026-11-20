import { ArrowUp } from "lucide-react";
import { Container, IconLink } from "@/components/ui/primitives";
import type { Profile } from "@/types/portfolio";

/** Server component; back-to-top is a plain anchor. */
export function Footer({ profile }: { profile: Profile }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line py-12 text-sm text-fg-subtle">
      <Container className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-semibold text-fg">
            &copy; {year} {profile.name}. All rights reserved.
          </p>
          <p className="mt-1 text-xs">Built with Next.js, TypeScript &amp; Tailwind CSS.</p>
        </div>

        <div className="flex items-center gap-1">
          <ul className="flex items-center gap-1">
            {profile.socials
              .filter((s) => s.featured)
              .map((social) => (
                <li key={social.id}>
                  <IconLink href={social.url} label={social.label} icon={social.icon} />
                </li>
              ))}
            <li>
              <IconLink
                href={`mailto:${profile.email}`}
                label="Email"
                icon="mail"
                external={false}
              />
            </li>
          </ul>
          <a
            href="#top"
            className="ml-2 inline-flex items-center gap-1 rounded-lg border border-line bg-surface-muted px-3 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:text-fg"
          >
            <span>Top</span>
            <ArrowUp className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
