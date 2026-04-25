import { test, expect } from "../../../fixtures/auth.fixture";
import { ExportPage } from "../../../pages/ExportPage";

export const exportRenderTests = () => {
  test.describe("Admin — Export › Render", () => {
    let exportPage: ExportPage;

    test.beforeEach(async ({ asAdmin: page }) => {
      exportPage = new ExportPage(page);
      await exportPage.goto();
    });

    test("export page renders header", async () => {
      await expect(exportPage.header).toBeVisible();
    });

    test("export page shows four entity cards", async ({ asAdmin: page }) => {
      await expect(page.locator(".export-card")).toHaveCount(4);
    });

    test("main export menu button is visible", async ({ asAdmin: page }) => {
      await expect(page.locator(".export-menu-btn")).toBeVisible();
    });

    test("'Manage Menu' navigation link goes to /menu", async ({
      asAdmin: page,
    }) => {
      await page.click(
        ".export-card:has-text('მენიუ') .export-card__manage-link",
      );
      await expect(page).toHaveURL(/\/menu/);
    });

    test("'Manage Translations' navigation link goes to /translations", async ({
      asAdmin: page,
    }) => {
      await page.goto("/export");
      await page.click(
        ".export-card:has-text('თარგმანები') .export-card__manage-link",
      );
      await expect(page).toHaveURL(/\/translations/);
    });
  });
};
