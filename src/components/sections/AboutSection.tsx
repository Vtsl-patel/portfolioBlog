import { Card, IconBadge, Section, type SectionAlign } from "@/components/ui/primitives";
import type { Profile } from "@/types/portfolio";

export function AboutSection({ profile, align }: { profile: Profile; align?: SectionAlign }) {
  return (
    <Section id="about" eyebrow="Background" title="About Me" tone="muted" align={align}>
      <div className="max-w-3xl space-y-5 text-base leading-relaxed text-fg-muted sm:text-lg">
        {profile.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <ul className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {profile.stats.map((stat) => (
          <Card key={stat.label} as="li" className="flex flex-col justify-between p-5">
            <IconBadge name={stat.icon} />
            <div className="mt-4">
              <p className="text-2xl font-extrabold tracking-tight text-fg sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-medium text-fg-subtle">{stat.label}</p>
            </div>
          </Card>
        ))}
      </ul>
    </Section>
  );
}
