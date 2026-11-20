import { expect, test, type Page } from "@playwright/test";

const htmlHasDark = (page: Page) => page.evaluate(() => document.documentElement.classList.contains("dark"));

test.describe("theme toggle", () => {
  test.use({ colorScheme: "light" });

  test("switches between light and dark", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    expect(await htmlHasDark(page)).toBe(true);
    await page.getByRole("button", { name: "Switch to light theme" }).click();
    expect(await htmlHasDark(page)).toBe(false);
  });

  test("remembers the choice across reloads", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await page.reload();
    expect(await htmlHasDark(page)).toBe(true);
  });
});
