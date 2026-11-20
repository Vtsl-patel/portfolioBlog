import { ArrowRight, Briefcase, FileDown, GraduationCap, MapPin } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { CodeConstellation } from "@/components/ui/CodeConstellation";
import { Container, LinkButton } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import type { Profile } from "@/types/portfolio";

export function HeroSection({ profile }: { profile: Profile }) {
  const profiles = profile.socials.filter((s) => s.featured);

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden py-16 sm:py-24 lg:py-28"
    >
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] xl:gap-20">
          <div className="@container relative z-10 space-y-8">
            <p className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-line bg-surface/70 px-3.5 py-1.5 text-xs font-medium text-fg">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>
                {profile.role} at {profile.company}
              </span>
              <span aria-hidden="true" className="text-fg-subtle">
                &bull;
              </span>
              <span className="text-fg-muted">{profile.status}</span>
            </p>

            <div>
              <h1
                id="hero-heading"
                className="whitespace-nowrap text-[clamp(1.75rem,10.5cqw,4.5rem)] font-extrabold leading-[1.05] tracking-tight text-fg"
              >
                Hi, I&apos;m {profile.name}
              </h1>
              <p className="mt-4 text-xl font-medium text-brand-text sm:text-2xl">
                {profile.headline}
              </p>
            </div>

            <p className="max-w-2xl text-lg leading-relaxed text-fg-muted sm:text-xl">
              {profile.summary}
            </p>

            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-fg-subtle">
              <li className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-text" aria-hidden="true" />
                <span>{profile.location}</span>
              </li>
              <li className="inline-flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-brand-text" aria-hidden="true" />
                <span>{profile.education}</span>
              </li>
            </ul>

            {/* Below md: a tidy 2x2 grid. From md: one row (the column is wide enough). */}
            <div className="grid grid-cols-2 gap-3 pt-2 md:flex md:flex-wrap md:items-center lg:gap-2.5 xl:gap-3">
              <LinkButton href="#projects" variant="primary" className="w-full md:w-auto">
                <span>View Projects</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </LinkButton>
              <LinkButton href="#experience" className="w-full md:w-auto">
                <Briefcase className="h-4 w-4 text-brand-text" aria-hidden="true" />
                <span>Experience</span>
              </LinkButton>
              <LinkButton
                href={siteConfig.resume.href}
                download={siteConfig.resume.downloadName}
                aria-label="Download resume (PDF)"
                className="w-full md:w-auto"
              >
                <FileDown className="h-4 w-4 text-brand-text" aria-hidden="true" />
                <span>Resume</span>
              </LinkButton>
              <LinkButton href="#contact" variant="ghost" className="w-full md:w-auto">
                Get in Touch
              </LinkButton>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                Profiles
              </span>
              <ul className="flex flex-wrap items-center gap-2">
                {profiles.map((social) => (
                  <li key={social.id}>
                    <LinkButton href={social.url} external size="sm">
                      <Icon name={social.icon} className="h-3.5 w-3.5" />
                      <span>{social.label}</span>
                    </LinkButton>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Below lg: dimmed backdrop behind the text. From lg: a column of its own. */}
          <div className="pointer-events-none absolute -right-40 top-10 w-[26rem] opacity-35 lg:pointer-events-auto lg:static lg:w-auto lg:opacity-100">
            <CodeConstellation stars={profile.constellation}>
              {profile.quote && (
                <blockquote className="text-center">
                  <p className="text-lg font-medium italic text-fg-muted">
                    &ldquo;{profile.quote.text}&rdquo;
                  </p>
                  <footer className="mt-1 font-mono text-xs text-fg-subtle">
                    — {profile.quote.source}
                  </footer>
                </blockquote>
              )}
            </CodeConstellation>
          </div>
        </div>
      </Container>
    </section>
  );
}
