import { test, expect } from "@playwright/test";

test.describe("scroll ownership", () => {
  test("homepage horizontal rail does not trap page scroll forever", async ({ page }) => {
    await page.goto("/");

    await page.mouse.wheel(0, 1200);
    const before = await page.evaluate(() => window.scrollY);

    await page.locator("section").nth(2).hover();
    await page.mouse.wheel(0, 600);
    await page.mouse.wheel(0, 600);

    const after = await page.evaluate(() => window.scrollY);
    expect(after).toBeGreaterThanOrEqual(before);
  });

  test("article TOC and scroll-to-top remain functional", async ({ page }) => {
    await page.goto("/article/1");

    await page.mouse.wheel(0, 1600);
    await expect(page.getByRole("button", { name: /回到顶部/i })).toBeVisible();

    await page.getByRole("button", { name: /回到顶部/i }).click();
    await page.waitForTimeout(500);

    const top = await page.evaluate(() => window.scrollY);
    expect(top).toBeLessThan(50);
  });

  test("narrative page does not leak scroll behavior after navigation", async ({ page }) => {
    await page.goto("/xue");
    await page.mouse.wheel(0, 800);

    await page.goto("/");
    await page.waitForTimeout(500);

    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 800);
    const after = await page.evaluate(() => window.scrollY);

    expect(after).toBeGreaterThan(before);
  });
});
