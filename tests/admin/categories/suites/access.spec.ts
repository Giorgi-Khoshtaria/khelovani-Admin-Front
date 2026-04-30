import { test, expect } from "../../../fixtures/auth.fixture";
import { CategoriesPage } from "../../../pages/CategoriesPage";

export const categoriesAccessTests = () => {
  test.describe("Categories › Access Control", () => {
    test("admin sees categories link in sidebar", async ({ asAdmin }) => {
      await asAdmin.goto("/");
      await expect(asAdmin.locator(".side-manu__link", { hasText: "კატეგორიები" })).toBeVisible({
        timeout: 8000,
      });
    });

    test("admin can navigate to /categories", async ({ asAdmin }) => {
      const catPage = new CategoriesPage(asAdmin);
      await catPage.goto();
      await catPage.waitForLoad();
      await expect(asAdmin).toHaveURL(/\/categories/);
      await expect(catPage.heading).toContainText("კატეგორიები");
    });

    test("organizer does not see categories link in sidebar", async ({ asOrganizer }) => {
      await asOrganizer.goto("/profile");
      await expect(
        asOrganizer.locator(".side-manu__link", { hasText: "კატეგორიები" }),
      ).not.toBeVisible();
    });
  });
};
