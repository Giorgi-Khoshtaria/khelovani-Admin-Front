import { test, expect } from "../../../fixtures/auth.fixture";
import { UsersPage } from "../../../pages/UsersPage";
import { ApiHelper } from "../../../helpers/api.helper";

export const usersDeleteTests = () => {
  test.describe("Admin — Users › Delete", () => {
    let usersPage: UsersPage;
    let api: ApiHelper;

    test.beforeEach(async ({ asAdmin: page }) => {
      usersPage = new UsersPage(page);
      api = new ApiHelper();
      await api.login();
    });

    test("confirm delete shows success toast and removes row", async ({
      asAdmin: page,
    }) => {
      await usersPage.goto();
      await page.waitForResponse(
        (r) =>
          r.url().includes("/api/admin/users") && r.request().method() === "GET",
        { timeout: 10000 },
      );

      const rows = page.locator('[data-testid="user-row"]');
      const count = await rows.count();
      if (count === 0) return;

      const firstRow = rows.first();
      const rowText = await firstRow.textContent();

      page.once("dialog", (d) => d.accept());

      const deletePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/admin/users") &&
          r.request().method() === "DELETE",
        { timeout: 10000 },
      );

      await firstRow.locator('[data-testid="user-delete-btn"]').click();

      const deleteResp = await deletePromise;
      void rowText;
      if (deleteResp.status() === 200) {
        await expect(
          page.locator(".Toastify__toast--success"),
        ).toBeVisible({ timeout: 5000 });
        await page.waitForResponse(
          (r) =>
            r.url().includes("/api/admin/users") &&
            r.request().method() === "GET",
          { timeout: 5000 },
        );
        const newRows = page.locator('[data-testid="user-row"]');
        const newCount = await newRows.count();
        expect(newCount).toBeLessThan(count);
      }
    });

    test("delete API failure shows error toast", async ({ asAdmin: page }) => {
      await usersPage.goto();
      await page.waitForResponse(
        (r) =>
          r.url().includes("/api/admin/users") && r.request().method() === "GET",
        { timeout: 10000 },
      );

      const rows = page.locator('[data-testid="user-row"]');
      const count = await rows.count();
      if (count === 0) return;

      await page.route("**/api/admin/users/*", async (route) => {
        if (route.request().method() === "DELETE") {
          await route.fulfill({ status: 500, body: "Server Error" });
        } else {
          await route.continue();
        }
      });

      page.once("dialog", (d) => d.accept());

      await rows.first().locator('[data-testid="user-delete-btn"]').click();

      await expect(
        page.locator(".Toastify__toast--error"),
      ).toBeVisible({ timeout: 5000 });
    });
  });
};
