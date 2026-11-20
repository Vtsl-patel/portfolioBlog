import { Briefcase, Calendar, GraduationCap } from "lucide-react";
import { BulletList } from "@/components/ui/BulletList";
import { Card, Chip, ChipList, Section, type SectionAlign } from "@/components/ui/primitives";
import type { EducationItem, ExperienceItem } from "@/types/portfolio";

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
  education: EducationItem[];
  align?: SectionAlign;
}

export function ExperienceSection({ experiences, education, align }: ExperienceSectionProps) {
  return (
    <Section
      id="experience"
      align={align}
      eyebrow="Work & Education"
      title="Experience"
      description="Professional engineering track record at DevRev, focusing on customer portals, testing, and microfrontends."
      tone="muted"
    >
      <div className="space-y-8">
        {experiences.map((exp) => (
          <Card key={exp.id} as="article" className="p-7 sm:p-9">
            <header className="flex flex-col gap-3 border-b border-line-subtle pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-text">
                  <Briefcase className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-fg sm:text-2xl">{exp.role}</h3>
                  <p className="text-sm font-semibold text-brand-text sm:text-base">
                    {exp.company}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Chip className="gap-1.5 px-3 font-mono">
                  <Calendar className="h-3.5 w-3.5 text-fg-subtle" aria-hidden="true" />
                  <time dateTime={exp.startDate}>{exp.duration}</time>
                </Chip>
                <span className="rounded-lg bg-brand-soft px-2.5 py-1 font-semibold text-brand-text">
                  {exp.type}
                </span>
              </div>
            </header>

            <BulletList items={exp.highlights} className="mt-6 space-y-4" />

            <div className="mt-7 border-t border-line-subtle pt-5">
              <p className="mb-2 font-mono text-xs text-fg-subtle">Tech stack</p>
              <ChipList items={exp.technologies} label={`${exp.role} technologies`} />
            </div>
          </Card>
        ))}

        {education.map((edu) => (
          <Card key={edu.institution} as="article" className="p-7 sm:p-9">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-text">
                  <GraduationCap className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-fg">{edu.institution}</h3>
                  <p className="text-sm text-fg-muted sm:text-base">{edu.degree}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Chip className="px-3 font-mono">{edu.duration}</Chip>
                <span className="rounded-lg border border-success-text/30 bg-success-soft px-2.5 py-1 font-semibold text-success-text">
                  {edu.grade}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
