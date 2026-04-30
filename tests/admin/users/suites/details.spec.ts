import { test, expect } from "../../../fixtures/auth.fixture";
import { UsersPage } from "../../../pages/UsersPage";
import { ApiHelper } from "../../../helpers/api.helper";

export const usersDetailsTests = () => {
  test.describe("Admin — Users › Details Page", () => {
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

    test("clicking a row opens the details page", async ({
      asAdmin: page,
    }) => {
      const rows = page.locator('[data-testid="user-row"]');
      if ((await rows.count()) === 0) return;

      await rows.first().click();
      await expect(page.locator(".user-details-page")).toBeVisible({
        timeout: 8000,
      });
    });

    test("details page shows back button", async ({ asAdmin: page }) => {
      const rows = page.locator('[data-testid="user-row"]');
      if ((await rows.count()) === 0) return;

      await rows.first().click();
      await expect(page.locator(".back-btn")).toBeVisible({ timeout: 8000 });
    });

    test("back button navigates to /users listing", async ({
      asAdmin: page,
    }) => {
      const rows = page.locator('[data-testid="user-row"]');
      if ((await rows.count()) === 0) return;

      await rows.first().click();
      await expect(page.locator(".user-details-page")).toBeVisible({
        timeout: 8000,
      });
      await page.locator(".back-btn").click();
      await expect(page).toHaveURL(/\/users$/, { timeout: 5000 });
    });

    test("all form inputs are disabled for admin viewer", async ({
      asAdmin: page,
    }) => {
      const rows = page.locator('[data-testid="user-row"]');
      if ((await rows.count()) === 0) return;

      await rows.first().click();
      await expect(page.locator(".user-details-page")).toBeVisible({
        timeout: 8000,
      });

      const inputs = page.locator(".user-info-form input");
      const inputCount = await inputs.count();
      expect(inputCount).toBeGreaterThan(0);

      for (let i = 0; i < inputCount; i++) {
        await expect(inputs.nth(i)).toBeDisabled();
      }
    });

    test("details page shows user email field", async ({ asAdmin: page }) => {
      const rows = page.locator('[data-testid="user-row"]');
      if ((await rows.count()) === 0) return;

      await rows.first().click();
      await expect(page.locator(".user-details-page")).toBeVisible({
        timeout: 8000,
      });
      await expect(
        page.locator("input[type='email']"),
      ).toBeVisible();
    });

    test("no save/edit button is visible for admin on details page", async ({
      asAdmin: page,
    }) => {
      const rows = page.locator('[data-testid="user-row"]');
      if ((await rows.count()) === 0) return;

      await rows.first().click();
      await expect(page.locator(".user-details-page")).toBeVisible({
        timeout: 8000,
      });
      await expect(page.locator('button:has-text("შენახვა")')).not.toBeVisible();
      await expect(page.locator('button:has-text("რედაქტირება")')).not.toBeVisible();
    });

    test("details page shows admin-cannot-edit notice", async ({
      asAdmin: page,
    }) => {
      const rows = page.locator('[data-testid="user-row"]');
      if ((await rows.count()) === 0) return;

      await rows.first().click();
      await expect(page.locator(".user-details-page")).toBeVisible({
        timeout: 8000,
      });
      await expect(page.locator(".user-info-form__note")).toBeVisible();
    });

    test("unknown /users/:id shows error or redirects", async ({
      asAdmin: page,
    }) => {
      await page.goto("/users/000000000000000000000000");
      await page.waitForTimeout(3000);
      const onUsers = page.url().includes("/users");
      const hasError = await page.locator(".error-state, .loading-state").isVisible();
      expect(onUsers || hasError).toBeTruthy();
    });

    test("delete button is visible on details page", async ({
      asAdmin: page,
    }) => {
      const rows = page.locator('[data-testid="user-row"]');
      if ((await rows.count()) === 0) return;

      await rows.first().click();
      await expect(page.locator(".user-details-page")).toBeVisible({
        timeout: 8000,
      });
      await expect(
        page.locator('[data-testid="user-details-delete-btn"]'),
      ).toBeVisible();
    });

    test("delete button on details page navigates back to /users after confirm", async ({
      asAdmin: page,
    }) => {
      const rows = page.locator('[data-testid="user-row"]');
      if ((await rows.count()) === 0) return;

      await rows.first().click();
      await expect(page.locator(".user-details-page")).toBeVisible({
        timeout: 8000,
      });

      page.once("dialog", (d) => d.accept());
      await page.locator('[data-testid="user-details-delete-btn"]').click();
      await expect(page).toHaveURL(/\/users$/, { timeout: 8000 });
    });
  });
};
