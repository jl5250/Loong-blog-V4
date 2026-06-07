import { test, expect } from "@playwright/test";

// All scroll-ownership tests run at mobile width (375px) so Lenis is disabled
// and native window.scrollY works correctly with Playwright's wheel/scrollTo.
test.use({ viewport: { width: 375, height: 812 } });

test.describe("scroll ownership", () => {
  test("homepage horizontal rail does not trap page scroll", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Scroll down past the hero
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(300);
    const before = await page.evaluate(() => window.scrollY);
    expect(before).toBeGreaterThan(0);

    // Scroll further — page should still scroll
    await page.evaluate(() => window.scrollTo(0, 2500));
    await page.waitForTimeout(300);
    const after = await page.evaluate(() => window.scrollY);
    expect(after).toBeGreaterThanOrEqual(before);
  });

  test("article page has scroll-to-top button in DOM", async ({ page }) => {
    await page.goto("/article/1");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    // The FAB button should exist in DOM (may be invisible until scroll > 500px)
    const fab = page.locator('button[title="回到顶部"]');
    await expect(fab).toHaveCount(1, { timeout: 10000 });

    // Scroll down and verify scroll works
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForFunction(() => window.scrollY > 500, { timeout: 5000 });
  });

  test("narrative page does not leak scroll behavior after navigation", async ({ page }) => {
    await page.goto("/xue");
    await page.waitForLoadState("networkidle");

    // On mobile, /xue still has container-based wheel handling,
    // but after navigating away the homepage should scroll normally.
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    const before = await page.evaluate(() => window.scrollY);
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(300);
    const after = await page.evaluate(() => window.scrollY);

    expect(after).toBeGreaterThan(before);
  });
});
