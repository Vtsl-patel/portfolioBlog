import type { Metadata } from "next";
import { Container, LinkButton } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false }
};

export default function NotFound() {
  return (
    <main id="main" className="flex flex-1 items-center py-32">
      <Container className="space-y-6">
        <p className="font-mono text-sm text-brand-text">404</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-fg">Page not found</h1>
        <p className="max-w-md text-fg-muted">
          The page you are looking for does not exist or has moved.
        </p>
        <LinkButton href="/" variant="primary">
          Back to home
        </LinkButton>
      </Container>
    </main>
  );
}
