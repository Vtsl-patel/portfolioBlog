import { ExternalLink } from "lucide-react";
import { Card, IconBadge, LinkButton, Section, type SectionAlign } from "@/components/ui/primitives";
import type { AchievementItem } from "@/types/portfolio";

export function AchievementsSection({ achievements, align }: { achievements: AchievementItem[]; align?: SectionAlign }) {
  return (
    <Section
      id="achievements"
      align={align}
      eyebrow="Recognition"
      title="Achievements"
      description="Hackathon milestones and competitive problem-solving."
      tone="muted"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {achievements.map((item) => (
          <Card
            key={item.id}
            as="article"
            className="flex flex-col justify-between p-6 sm:p-8"
          >
            <div>
              <header className="flex items-center gap-3 border-b border-line-subtle pb-4">
                <IconBadge name={item.icon} size="lg" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-text">
                    {item.category}
                  </p>
                  <h3 className="text-lg font-bold text-fg">{item.title}</h3>
                </div>
              </header>
              <p className="mt-5 text-sm leading-relaxed text-fg-muted">{item.description}</p>
            </div>

            {item.links && (
              <ul className="mt-8 flex flex-wrap items-center gap-2 border-t border-line-subtle pt-5">
                {item.links.map((link) => (
                  <li key={link.label}>
                    <LinkButton href={link.url} external size="sm">
                      <span>{link.label}</span>
                      <ExternalLink className="h-3 w-3 text-fg-subtle" aria-hidden="true" />
                    </LinkButton>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </div>
    </Section>
  );
}
