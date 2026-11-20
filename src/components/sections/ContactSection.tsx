import { ArrowUpRight, FileDown, Mail } from "lucide-react";
import { CopyEmailButton } from "@/components/sections/CopyEmailButton";
import { Icon } from "@/components/ui/Icon";
import { Orrery } from "@/components/ui/Orrery";
import { Card, LinkButton, Section, type SectionAlign } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import type { Profile } from "@/types/portfolio";

const pillClass =
  "flex min-w-[12rem] flex-1 items-center justify-between gap-3 rounded-xl border border-line bg-surface-muted/70 px-4 py-3 text-xs font-medium text-fg-muted transition-colors hover:text-fg";

export function ContactSection({ profile, align }: { profile: Profile; align?: SectionAlign }) {
  const linkedin = profile.socials.find((s) => s.id === "linkedin");
  const github = profile.socials.find((s) => s.id === "github");

  return (
    <Section
      id="contact"
      align={align}
      backdrop={
        <div className="absolute -right-32 top-1/2 w-[30rem] -translate-y-1/2 opacity-30 sm:-right-20 sm:w-[38rem] lg:-right-10 lg:w-[44rem]">
          <Orrery />
        </div>
      }
      eyebrow="Contact"
      title="Let's Connect"
      description="I am actively looking for Software Engineer and Frontend Engineer roles. Reach out by email or grab my resume."
    >
      <Card className="space-y-6 p-6 sm:p-12">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-fg-subtle">
            Direct email
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-1 inline-block text-sm font-bold tracking-tight text-fg [overflow-wrap:anywhere] transition-colors hover:text-brand-text min-[360px]:text-lg min-[400px]:text-xl sm:text-3xl"
          >
            {profile.email}
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <LinkButton href={`mailto:${profile.email}`} variant="primary">
            <Mail className="h-4 w-4" aria-hidden="true" />
            <span>Send an email</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </LinkButton>
          <CopyEmailButton email={profile.email} />
          <LinkButton href={siteConfig.resume.href} download={siteConfig.resume.downloadName}>
            <FileDown className="h-4 w-4 text-brand-text" aria-hidden="true" />
            <span>Download resume (PDF)</span>
          </LinkButton>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-line-subtle pt-6">
          {[linkedin, github].map(
            (social) =>
              social && (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={pillClass}
                >
                  <span className="flex items-center gap-2">
                    <Icon name={social.icon} className="h-4 w-4 text-brand-text" />
                    <span>{social.label}</span>
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-fg-subtle" aria-hidden="true" />
                </a>
              )
          )}
        </div>
      </Card>
    </Section>
  );
}
