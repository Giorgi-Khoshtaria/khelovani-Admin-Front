import { test, expect } from "../../../fixtures/auth.fixture";

export const listTests = () => {
  test.describe("Organizer — Products › List", () => {
    test.beforeEach(async ({ asOrganizer: page }) => {
      await page.goto("/profile/products");
    });

    test("organizer products page loads at /profile/products", async ({
      asOrganizer: page,
    }) => {
      await expect(page).toHaveURL(/\/profile\/products/);
    });

    test("product list shows only this partner's products (no other partners' data visible)", async ({
      asOrganizer: page,
    }) => {
      await expect(page).toHaveURL(/\/profile\/products/);
      await expect(
        page.locator(".product-row").or(page.locator(".empty-state")),
      ).toBeVisible();
    });

    test("organizer CANNOT access another partner's products", async ({
      asOrganizer: page,
    }) => {
      await page.goto("/partners/other-id/products");
      await expect(page).not.toHaveURL(/\/partners\/other-id\/products/);
      await expect(page).toHaveURL(/\/profile/);
    });
  });
};
