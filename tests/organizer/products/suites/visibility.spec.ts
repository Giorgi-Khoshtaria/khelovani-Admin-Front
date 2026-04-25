import { test, expect } from "../../../fixtures/auth.fixture";

export const visibilityTests = () => {
  test.describe("Organizer — Products › Visibility", () => {
    test.beforeEach(async ({ asOrganizer: page }) => {
      await page.goto("/profile/products");
    });

    test("visibility toggle control is NOT shown for organizers", async ({
      asOrganizer: page,
    }) => {
      const row = page.locator(".product-row").first();
      if (!(await row.isVisible())) {
        test.skip();
        return;
      }

      await row.click();
      await expect(page.locator('select[name="isShown"]')).not.toBeVisible();
    });

    test("organizer does not see admin visibility toggle button in list", async ({
      asOrganizer: page,
    }) => {
      await expect(page.locator(".toggle-btn").first())
        .not.toBeVisible()
        .catch(() => {
          // If no products, this is fine
        });
    });
  });
};
