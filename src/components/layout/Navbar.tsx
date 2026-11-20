import { ArrowUpRight, FileDown } from "lucide-react";
import { DesktopNav, MobileMenu } from "@/components/layout/NavLinks";
import type { NavItem } from "@/components/sections/registry";
import { Container, LinkButton } from "@/components/ui/primitives";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { siteConfig } from "@/config/site";
import type { Profile } from "@/types/portfolio";

interface NavbarProps {
  profile: Profile;
  items: NavItem[];
}

/** Server shell; only scrollspy, the drawer and the theme toggle are client islands. */
export function Navbar({ profile, items }: NavbarProps) {
  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-bg/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" className="group flex shrink-0 items-center gap-2.5 text-sm font-semibold tracking-tight text-fg">
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface-muted text-xs font-bold text-brand-text transition-colors group-hover:border-brand/50"
          >
            {initials}
          </span>
          <span className="flex flex-col">
            <span className="leading-tight">{profile.name}</span>
            <span className="text-[10px] font-normal text-fg-subtle">
              {profile.role} @ {profile.company}
            </span>
          </span>
        </a>

        <DesktopNav items={items} />

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-3 xl:flex">
            <LinkButton
              href={siteConfig.resume.href}
              download={siteConfig.resume.downloadName}
              size="sm"
            >
              <FileDown className="h-3.5 w-3.5 text-brand-text" aria-hidden="true" />
              <span>Resume</span>
            </LinkButton>
            <LinkButton href={`mailto:${profile.email}`} variant="primary" size="sm">
              <span>Say Hello</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </LinkButton>
          </div>

          <ThemeToggle />

          <MobileMenu items={items}>
            <LinkButton
              href={siteConfig.resume.href}
              download={siteConfig.resume.downloadName}
              className="w-full"
            >
              <FileDown className="h-4 w-4 text-brand-text" aria-hidden="true" />
              <span>Download resume (PDF)</span>
            </LinkButton>
            <LinkButton href={`mailto:${profile.email}`} variant="primary" className="w-full">
              <span>Say hello</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </LinkButton>
          </MobileMenu>
        </div>
      </Container>
    </header>
  );
}
