import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import type { NavItem } from "@/components/sections/registry";
import { installIntersectionObserver, type MockIntersectionObserver } from "@/test/helpers";
import { DesktopNav, MobileMenu } from "./NavLinks";

const ITEMS: NavItem[] = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" }
];
let MockIO: typeof MockIntersectionObserver;

beforeEach(() => {
  MockIO = installIntersectionObserver();
  for (const id of ["top", ...ITEMS.map((i) => i.id)]) {
    const el = document.createElement("section");
    el.id = id;
    el.dataset.testSection = "1";
    document.body.appendChild(el);
  }
  return () => document.querySelectorAll("[data-test-section]").forEach((el) => el.remove());
});

const activate = (id: string) => act(() => MockIO.instances.at(-1)!.trigger(document.getElementById(id)!));

describe("DesktopNav scrollspy", () => {
  it("marks the section in view as current and clears it back at the top", () => {
    render(<DesktopNav items={ITEMS} />);
    const link = (name: string) => screen.getByRole("link", { name, hidden: true });
    expect(link("Projects")).not.toHaveAttribute("aria-current");

    activate("projects");
    expect(link("Projects")).toHaveAttribute("aria-current", "location");
    expect(link("About")).not.toHaveAttribute("aria-current");

    activate("top");
    expect(link("Projects")).not.toHaveAttribute("aria-current");
  });
});

describe("MobileMenu", () => {
  const renderMenu = () =>
    render(
      <MobileMenu items={ITEMS}>
        <a href="/resume.pdf" onClick={(e) => e.preventDefault()}>
          Download resume
        </a>
      </MobileMenu>
    );
  const toggle = () => screen.getByRole("button", { name: /navigation menu/i });

  it("starts closed, then opens to reveal the links and actions", async () => {
    const user = userEvent.setup();
    renderMenu();
    expect(toggle()).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "About" })).not.toBeInTheDocument();

    await user.click(toggle());
    expect(toggle()).toHaveAttribute("aria-expanded", "true");
    const nav = screen.getByRole("navigation", { name: "Mobile" });
    expect(within(nav).getAllByRole("link").map((a) => a.textContent)).toEqual(["About", "Projects", "Contact"]);
    expect(screen.getByRole("link", { name: "Download resume" })).toBeVisible();
  });

  it("closes when a link is chosen", async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(toggle());
    await user.click(screen.getByRole("link", { name: "Projects" }));
    expect(toggle()).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on Escape and returns focus to the toggle", async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(toggle());
    await user.click(screen.getByRole("navigation", { name: "Mobile" }));
    await user.keyboard("{Escape}");
    expect(toggle()).toHaveAttribute("aria-expanded", "false");
    expect(toggle()).toHaveFocus();
  });
});
