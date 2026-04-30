import { test, expect } from "../../../fixtures/auth.fixture";
import { UsersPage } from "../../../pages/UsersPage";
import { ApiHelper } from "../../../helpers/api.helper";

export const usersBulkDeleteTests = () => {
  test.describe("Admin — Users › Bulk Delete", () => {
    let usersPage: UsersPage;
    let api: ApiHelper;

    test.beforeEach(async ({ asAdmin: page }) => {
      usersPage = new UsersPage(page);
      api = new ApiHelper();
      await api.login();
    });

    test("select-all checkbox is visible in list header", async ({
      asAdmin: page,
    }) => {
      await usersPage.goto();
      await page.waitForResponse(
        (r) =>
          r.url().includes("/api/admin/users") && r.request().method() === "GET",
        { timeout: 10000 },
      );

      const rows = page.locator('[data-testid="user-row"]');
      if ((await rows.count()) === 0) return;

      await expect(usersPage.selectAllCheckbox).toBeVisible();
    });

    test("bulk toolbar is hidden initially", async ({ asAdmin: page }) => {
      await usersPage.goto();
      await page.waitForResponse(
        (r) =>
          r.url().includes("/api/admin/users") && r.request().method() === "GET",
        { timeout: 10000 },
      );

      await expect(usersPage.bulkToolbar).not.toBeVisible();
    });

    test("checking a row reveals bulk toolbar", async ({ asAdmin: page }) => {
      await usersPage.goto();
      await page.waitForResponse(
        (r) =>
          r.url().includes("/api/admin/users") && r.request().method() === "GET",
        { timeout: 10000 },
      );

      const rows = page.locator('[data-testid="user-row"]');
      if ((await rows.count()) === 0) return;

      const firstCheckbox = rows.first().locator('[data-testid="user-row-checkbox"]');
      await firstCheckbox.click();

      await expect(usersPage.bulkToolbar).toBeVisible();
      await expect(usersPage.bulkDeleteBtn).toBeVisible();
    });

    test("select-all checks all rows and shows bulk toolbar", async ({
      asAdmin: page,
    }) => {
      await usersPage.goto();
      await page.waitForResponse(
        (r) =>
          r.url().includes("/api/admin/users") && r.request().method() === "GET",
        { timeout: 10000 },
      );

      const rows = page.locator('[data-testid="user-row"]');
      const rowCount = await rows.count();
      if (rowCount === 0) return;

      await usersPage.selectAllCheckbox.click();

      await expect(usersPage.bulkToolbar).toBeVisible();

      const checked = await page
        .locator('[data-testid="user-row-checkbox"]:checked')
        .count();
      expect(checked).toBe(rowCount);
    });

    test("unchecking all rows hides the bulk toolbar", async ({
      asAdmin: page,
    }) => {
      await usersPage.goto();
      await page.waitForResponse(
        (r) =>
          r.url().includes("/api/admin/users") && r.request().method() === "GET",
        { timeout: 10000 },
      );

      const rows = page.locator('[data-testid="user-row"]');
      if ((await rows.count()) === 0) return;

      await usersPage.selectAllCheckbox.click();
      await expect(usersPage.bulkToolbar).toBeVisible();

      await usersPage.selectAllCheckbox.click();
      await expect(usersPage.bulkToolbar).not.toBeVisible();
    });

    test("bulk delete removes selected users from list", async ({
      asAdmin: page,
    }) => {
      const u1 = await api.getUsers({ limit: 1 });
      const existingUsers: { _id: string; email: string }[] = u1.data ?? [];
      if (existingUsers.length === 0) return;

      await usersPage.goto();
      await page.waitForResponse(
        (r) =>
          r.url().includes("/api/admin/users") && r.request().method() === "GET",
        { timeout: 10000 },
      );

      const rows = page.locator('[data-testid="user-row"]');
      if ((await rows.count()) === 0) return;

      const firstRow = rows.first();
      const emailText = await firstRow.locator(".user-email").textContent();
      await firstRow.locator('[data-testid="user-row-checkbox"]').click();

      await expect(usersPage.bulkToolbar).toBeVisible();

      page.once("dialog", (d) => d.accept());
      await usersPage.bulkDeleteBtn.click();

      await page.waitForResponse(
        (r) =>
          r.url().includes("/api/admin/users/bulk-delete") &&
          r.request().method() === "POST",
        { timeout: 10000 },
      );

      if (emailText) {
        await expect(
          page.locator(`[data-testid="user-row"]`).filter({ hasText: emailText }),
        ).not.toBeVisible({ timeout: 5000 });
      }
    });

    test("cancelling bulk delete dialog keeps users in list", async ({
      asAdmin: page,
    }) => {
      await usersPage.goto();
      await page.waitForResponse(
        (r) =>
          r.url().includes("/api/admin/users") && r.request().method() === "GET",
        { timeout: 10000 },
      );

      const rows = page.locator('[data-testid="user-row"]');
      const rowCount = await rows.count();
      if (rowCount === 0) return;

      await usersPage.selectAllCheckbox.click();
      await expect(usersPage.bulkToolbar).toBeVisible();

      page.once("dialog", (d) => d.dismiss());
      await usersPage.bulkDeleteBtn.click();

      await expect(rows).toHaveCount(rowCount);
    });
  });
};
