import { expect, test } from "@playwright/test";
import { OWNER, scrollThrough, trackProblems } from "./helpers";

test.describe("home page", () => {
  test("loads cleanly: no console errors, failed requests or CSP violations", async ({ page }) => {
    const problems = await trackProblems(page);
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await scrollThrough(page);
    await page.waitForLoadState("networkidle");
    expect(problems).toEqual([]);
  });

  test("renders every section with its heading, in order", async ({ page }) => {
    await page.goto("/");
    expect(await page.locator("main h2").allTextContents()).toEqual([
      "About Me",
      "Skills & Technologies",
      "Experience",
      "Featured Work",
      "Achievements",
      "Let's Connect"
    ]);
    expect(await page.locator("main > section").evaluateAll((els) => els.map((e) => e.id))).toEqual([
      "top",
      "about",
      "skills",
      "experience",
      "projects",
      "achievements",
      "contact"
    ]);
  });

  test("lists all four projects with safe GitHub links", async ({ page }) => {
    await page.goto("/");
    const projects = page.locator("#projects article");
    await expect(projects).toHaveCount(4);
    for (const title of ["ExpenseTracker", "Chessify", "BlogApp", "Video Backend"]) {
      const repo = projects.filter({ has: page.getByRole("heading", { name: title }) }).getByRole("link", { name: /view repository/i });
      await expect(repo).toHaveAttribute("href", /^https:\/\/github\.com\/Vtsl-patel\//);
      await expect(repo).toHaveAttribute("rel", /noopener/);
    }
  });

  test("renders inline code with no stray markdown markers (regression)", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#projects strong code", { hasText: "useReducer" })).toBeVisible();
    const text = await page.locator("main").innerText();
    expect(text).not.toContain("**");
    expect(text).not.toContain("`");
  });

  test("has no broken in-page anchors", async ({ page }) => {
    await page.goto("/");
    const hashes = await page.locator("a[href^='#']").evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute("href")!).filter((h) => h.length > 1))]);
    for (const hash of hashes) await expect(page.locator(hash), hash).toHaveCount(1);
  });
});

test.describe("hero calls to action", () => {
  for (const [label, target] of [
    ["View Projects", "#projects"],
    ["Experience", "#experience"],
    ["Get in Touch", "#contact"]
  ] as const) {
    test(`"${label}" scrolls to ${target}`, async ({ page }) => {
      await page.goto("/");
      await page.locator("#top").getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${target}$`));
      await expect(page.locator(target)).toBeInViewport();
    });
  }
});

test.describe("resume download", () => {
  test("the hero button downloads the real PDF with the right filename", async ({ page }) => {
    await page.goto("/");
    const [download] = await Promise.all([page.waitForEvent("download"), page.locator("#top a[download]").click()]);
    expect(download.suggestedFilename()).toBe("Vatsal_Patel_Resume.pdf");
    const bytes = await (await import("node:fs/promises")).readFile((await download.path())!);
    expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
  });
});

test.describe("copy email", () => {
  test.use({ permissions: ["clipboard-read", "clipboard-write"] });

  test("copies the address, confirms, then resets", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: /copy email/i });
    await button.scrollIntoViewIfNeeded();
    await button.click();
    await expect(page.getByRole("button", { name: /copied!/i })).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(OWNER.email);
    await expect(page.getByRole("button", { name: /copy email/i })).toBeVisible({ timeout: 5000 });
  });
});

test.describe("not found", () => {
  test("unknown URLs return a real, non-indexable 404 with a way home", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    const robots = await page.locator('meta[name="robots"]').evaluateAll((els) => els.map((e) => e.getAttribute("content")));
    for (const content of robots) expect(content).toContain("noindex");
    await page.getByRole("link", { name: "Back to home" }).click();
    await expect(page).toHaveURL("/");
  });
});
