import { ExternalLink } from "lucide-react";
import { BulletList } from "@/components/ui/BulletList";
import { Card, ChipList, IconBadge, IconLink, Section, type SectionAlign } from "@/components/ui/primitives";
import type { ProjectItem } from "@/types/portfolio";

export function ProjectsSection({ projects, align }: { projects: ProjectItem[]; align?: SectionAlign }) {
  return (
    <Section
      id="projects"
      align={align}
      eyebrow="Projects"
      title="Featured Work"
      description="Frontend applications, full-stack apps and backend services. Source is available on GitHub."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {projects.map((project) => (
          <Card
            key={project.id}
            as="article"
            className="group flex flex-col justify-between p-5 min-[400px]:p-7 sm:p-9"
          >
            <div>
              <header className="flex items-start justify-between gap-4 border-b border-line-subtle pb-5">
                <div className="flex min-w-0 items-center gap-3">
                  <IconBadge name={project.icon} size="lg" />
                  <h3 className="min-w-0 text-xl font-bold min-[400px]:text-2xl text-fg transition-colors group-hover:text-brand-text">
                    {project.title}
                  </h3>
                </div>
                <IconLink
                  href={project.githubUrl}
                  label={`${project.title} on GitHub`}
                  icon="github"
                  className="border border-line"
                />
              </header>

              <p className="mt-5 text-[15px] leading-relaxed text-fg-muted sm:text-base">
                {project.description}
              </p>

              <BulletList items={project.highlights} className="mt-5 space-y-3.5" />
            </div>

            <footer className="mt-8 space-y-5 border-t border-line-subtle pt-5">
              <ChipList items={project.techStack} label={`${project.title} tech stack`} />
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-brand-text hover:underline"
                >
                  <span>View repository</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-brand-text hover:underline"
                  >
                    <span>Live demo</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
              </div>
            </footer>
          </Card>
        ))}
      </div>
    </Section>
  );
}
