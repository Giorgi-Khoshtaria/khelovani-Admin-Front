import { test, expect } from "../../../fixtures/auth.fixture";

export const accessTests = () => {
  test.describe("Organizer — Products › Access Control", () => {
    test("organizer cannot access another partner's products page", async ({
      asOrganizer: page,
    }) => {
      await page.goto("/partners/000000000000000000000001/products");
      await expect(page).not.toHaveURL(
        /\/partners\/000000000000000000000001\/products/,
        { timeout: 8000 },
      );
    });

    test("unauthenticated visitor cannot access /profile/products", async ({
      page,
    }) => {
      await page.goto("/profile/products");
      await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
    });

    test("organizer CAN access own /profile/products", async ({
      asOrganizer: page,
    }) => {
      await page.goto("/profile/products");
      await expect(page).toHaveURL(/\/profile\/products/);
    });
  });
};
