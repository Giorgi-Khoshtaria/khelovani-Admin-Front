import { test, expect } from "../../../fixtures/auth.fixture";

export const exportAccessTests = () => {
  test.describe("Admin — Export › Access Control", () => {
    test("organizer CANNOT access /export page", async ({
      asOrganizer: page,
    }) => {
      await page.goto("/export");
      await expect(
        page.locator("h1:has-text('მონაცემების ექსპორტი')"),
      ).not.toBeVisible({ timeout: 5000 });
    });

    test("unauthenticated visitor is redirected to /login", async ({
      page,
    }) => {
      await page.goto("/export");
      await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
    });

    test("admin CAN access /export page", async ({ asAdmin: page }) => {
      await page.goto("/export");
      await expect(page).toHaveURL(/\/export/);
    });
  });
};
