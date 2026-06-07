import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("should render hero section with title", async ({ page }) => {
    await page.goto("/");

    // Hero calligraphy title
    await expect(page.locator("h1")).toBeVisible();

    // Theme toggle button exists
    await expect(page.getByRole("button", { name: /切换主题/i })).toBeVisible();
  });

  test("should have horizontal scroll article section", async ({ page }) => {
    await page.goto("/");
    const section = page.getByText("精选文章");
    await expect(section).toBeVisible();
  });

  test("should have latest articles section", async ({ page }) => {
    await page.goto("/");
    const section = page.getByText("最新文章");
    await expect(section).toBeVisible();
  });
});
