import { test, expect } from "@playwright/test";

test.describe("Baidu analytics bootstrap", () => {
  test("does not inject duplicate scripts during navigation", async ({ page }) => {
    await page.goto("/");

    await page.waitForTimeout(500);
    const firstCount = await page.locator('script[data-baidu-analytics="true"]').count();

    await page.goto("/record");
    await page.waitForTimeout(500);
    const secondCount = await page.locator('script[data-baidu-analytics="true"]').count();

    expect(secondCount).toBeLessThanOrEqual(1);
    expect(secondCount).toBe(firstCount);
  });

  test("does not inject analytics script when token is absent", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(500);

    const count = await page.locator('script[data-baidu-analytics="true"]').count();
    expect(count).toBeLessThanOrEqual(1);
  });
});
