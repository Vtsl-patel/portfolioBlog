import { expect, test } from "@playwright/test";
import { PHONE } from "./helpers";

test.describe("desktop navigation", () => {
  test("each nav link scrolls its section into view and updates the URL", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav.getByRole("link")).toHaveText(["About", "Skills", "Experience", "Projects", "Achievements", "Contact"]);
    for (const [name, id] of [
      ["Skills", "skills"],
      ["Contact", "contact"]
    ] as const) {
      await nav.getByRole("link", { name }).click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(page.locator(`#${id}`)).toBeInViewport();
    }
  });

  test("scrollspy marks the section in view as current", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav.locator("[aria-current]")).toHaveCount(0);
    await page.locator("#projects").evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
    await expect(nav.getByRole("link", { name: "Projects" })).toHaveAttribute("aria-current", "location");
  });
});

test.describe("keyboard", () => {
  test("the first Tab stop is a 'Skip to content' link that jumps to <main>", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });

});

test.describe("mobile navigation", () => {
  test.use({ viewport: PHONE, hasTouch: true, isMobile: true });

  test("the drawer lists every section and closes on choosing a link", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const mobileNav = page.getByRole("navigation", { name: "Mobile" });
    await expect(mobileNav.getByRole("link")).toHaveText(["About", "Skills", "Experience", "Projects", "Achievements", "Contact"]);
    await mobileNav.getByRole("link", { name: "Projects" }).tap();
    await expect(mobileNav).toBeHidden();
    await expect(page).toHaveURL(/#projects$/);
    await expect(page.locator("#projects")).toBeInViewport();
  });

  test("Escape closes the drawer and returns focus to the toggle", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Open navigation menu" })).toBeFocused();
  });
});
