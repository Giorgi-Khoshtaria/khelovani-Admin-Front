import { test, expect } from "../../../fixtures/auth.fixture";
import { UsersPage } from "../../../pages/UsersPage";
import { ApiHelper } from "../../../helpers/api.helper";

export const usersRowActionsTests = () => {
  test.describe("Admin — Users › Row Actions", () => {
    let usersPage: UsersPage;
    let api: ApiHelper;

    test.beforeEach(async ({ asAdmin: page }) => {
      usersPage = new UsersPage(page);
      api = new ApiHelper();
      await api.login();
      await usersPage.goto();
      await page.waitForResponse(
        (r) =>
          r.url().includes("/api/admin/users") && r.request().method() === "GET",
        { timeout: 10000 },
      );
    });

    test("clicking delete button shows confirmation dialog", async ({
      asAdmin: page,
    }) => {
      const rows = page.locator('[data-testid="user-row"]');
      const count = await rows.count();
      if (count === 0) return;

      let dialogShown = false;
      page.once("dialog", async (d) => {
        dialogShown = true;
        await d.dismiss();
      });

      await rows.first().locator('[data-testid="user-delete-btn"]').click();
      await page.waitForTimeout(300);
      expect(dialogShown).toBe(true);
    });

    test("clicking delete button does not navigate to details page", async ({
      asAdmin: page,
    }) => {
      const rows = page.locator('[data-testid="user-row"]');
      const count = await rows.count();
      if (count === 0) return;

      page.once("dialog", async (d) => await d.dismiss());
      await rows.first().locator('[data-testid="user-delete-btn"]').click();
      await page.waitForTimeout(300);

      await expect(page).toHaveURL(/\/users$/, { timeout: 3000 });
    });

    test("row click navigates to /users/:id", async ({ asAdmin: page }) => {
      const rows = page.locator('[data-testid="user-row"]');
      const count = await rows.count();
      if (count === 0) return;

      await rows.first().click();
      await expect(page).toHaveURL(/\/users\/[a-zA-Z0-9]+/, {
        timeout: 8000,
      });
      await expect(page.locator(".user-details-page")).toBeVisible();
    });

    test("cancelling delete dialog leaves user in list", async ({
      asAdmin: page,
    }) => {
      const rows = page.locator('[data-testid="user-row"]');
      const count = await rows.count();
      if (count === 0) return;

      const rowCountBefore = await rows.count();
      page.once("dialog", (d) => d.dismiss());
      await rows.first().locator('[data-testid="user-delete-btn"]').click();
      await page.waitForTimeout(500);

      const rowCountAfter = await rows.count();
      expect(rowCountAfter).toBe(rowCountBefore);
    });
  });
};
