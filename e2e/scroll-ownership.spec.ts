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
});
