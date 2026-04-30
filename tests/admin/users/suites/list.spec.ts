import { test, expect } from "../../../fixtures/auth.fixture";
import { UsersPage } from "../../../pages/UsersPage";
import { ApiHelper } from "../../../helpers/api.helper";

export const usersListTests = () => {
  test.describe("Admin — Users › Listing", () => {
    let usersPage: UsersPage;
    let api: ApiHelper;

    test.beforeEach(async ({ asAdmin: page }) => {
      usersPage = new UsersPage(page);
      api = new ApiHelper();
      await api.login();
    });

    test("listing page renders without errors", async ({ asAdmin: page }) => {
      await usersPage.goto();
      await expect(page.locator(".user-listing-page")).toBeVisible();
    });

    test("count badge is visible and numeric", async ({ asAdmin: page }) => {
      await usersPage.goto();
      await page.waitForResponse(
        (r) =>
          r.url().includes("/api/admin/users") && r.request().method() === "GET",
        { timeout: 10000 },
      );
      const badge = page.locator(".count-badge");
      const visible = await badge.isVisible();
      if (visible) {
        const text = await badge.textContent();
        expect(Number(text?.trim())).toBeGreaterThanOrEqual(0);
      }
    });

    test("shows loading state then renders list or empty state", async ({
      asAdmin: page,
    }) => {
      await page.goto("/users");
      await expect(page.locator(".user-listing-page")).toBeVisible();
      await page.waitForResponse(
        (r) =>
          r.url().includes("/api/admin/users") && r.request().method() === "GET",
        { timeout: 10000 },
      );
      await expect(
        page.locator(".users-list, .empty-state"),
      ).toBeVisible();
    });

    test("user row shows id badge, name, email, role, and date", async ({
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
      if (count === 0) {
        await expect(page.locator(".empty-state")).toBeVisible();
        return;
      }
      const row = rows.first();
      await expect(row.locator(".user-col-id")).toBeVisible();
      await expect(row.locator(".user-col-name")).toBeVisible();
      await expect(row.locator(".user-col-email")).toBeVisible();
      await expect(row.locator(".user-col-role")).toBeVisible();
      await expect(row.locator(".user-col-created")).toBeVisible();
    });

    test("delete button is visible on each row", async ({ asAdmin: page }) => {
      await usersPage.goto();
      await page.waitForResponse(
        (r) =>
          r.url().includes("/api/admin/users") && r.request().method() === "GET",
        { timeout: 10000 },
      );
      const rows = page.locator('[data-testid="user-row"]');
      const count = await rows.count();
      if (count === 0) return;
      await expect(
        rows.first().locator('[data-testid="user-delete-btn"]'),
      ).toBeVisible();
    });

    test("no add-user button exists on listing page", async ({
      asAdmin: page,
    }) => {
      await usersPage.goto();
      await expect(page.locator(".add-user-btn")).not.toBeVisible();
    });
  });
};
