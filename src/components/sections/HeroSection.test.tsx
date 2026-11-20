import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { portfolioData } from "@/content/portfolio";
import type { Profile } from "@/types/portfolio";
import { HeroSection } from "./HeroSection";

const { profile } = portfolioData;
const renderHero = (p: Profile = profile) => render(<HeroSection profile={p} />);

describe("HeroSection", () => {
  it("links to projects, experience, the resume download and contact", () => {
    renderHero();
    expect(screen.getByRole("link", { name: /view projects/i })).toHaveAttribute("href", "#projects");
    expect(screen.getByRole("link", { name: "Experience" })).toHaveAttribute("href", "#experience");
    expect(screen.getByRole("link", { name: /get in touch/i })).toHaveAttribute("href", "#contact");
    const resume = screen.getByRole("link", { name: "Download resume (PDF)" });
    expect(resume).toHaveAttribute("href", "/resume.pdf");
    expect(resume).toHaveAttribute("download", "Vatsal_Patel_Resume.pdf");
  });

  it("shows the tech constellation from the content", () => {
    renderHero();
    const chart = screen.getByRole("img", { name: /constellation/i });
    for (const tech of profile.constellation) expect(chart).toHaveTextContent(tech);
  });

  it("shows the quote, and no quote block when none is configured", () => {
    const { unmount } = renderHero();
    expect(screen.getByText(`“${profile.quote!.text}”`).closest("blockquote")).toBeInTheDocument();
    unmount();
    const { container } = renderHero({ ...profile, quote: undefined });
    expect(container.querySelector("blockquote")).toBeNull();
  });
});
