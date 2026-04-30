import { test, expect } from "../../../fixtures/auth.fixture";
import { UsersPage } from "../../../pages/UsersPage";
import { ApiHelper } from "../../../helpers/api.helper";

export const usersFiltersTests = () => {
  test.describe("Admin — Users › Date Filters", () => {
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

    test("date-from input is visible", async ({ asAdmin: page }) => {
      await expect(usersPage.dateFromInput).toBeVisible();
    });

    test("date-to input is visible", async ({ asAdmin: page }) => {
      await expect(usersPage.dateToInput).toBeVisible();
    });

    test("setting date-from triggers a filtered API request", async ({
      asAdmin: page,
    }) => {
      const responsePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/admin/users") &&
          r.url().includes("dateFrom=") &&
          r.request().method() === "GET",
        { timeout: 5000 },
      );
      await usersPage.dateFromInput.fill("2020-01-01");
      await responsePromise;
    });

    test("setting date-to triggers a filtered API request", async ({
      asAdmin: page,
    }) => {
      const responsePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/admin/users") &&
          r.url().includes("dateTo=") &&
          r.request().method() === "GET",
        { timeout: 5000 },
      );
      await usersPage.dateToInput.fill("2030-12-31");
      await responsePromise;
    });

    test("clear filters button removes date filters", async ({
      asAdmin: page,
    }) => {
      await usersPage.dateFromInput.fill("2020-01-01");
      await usersPage.dateToInput.fill("2030-12-31");
      await expect(usersPage.clearFiltersBtn).toBeVisible();
      await usersPage.clearFiltersBtn.click();
      await expect(usersPage.dateFromInput).toHaveValue("");
      await expect(usersPage.dateToInput).toHaveValue("");
    });

    test("future-only date range returns empty state if no future users", async ({
      asAdmin: page,
    }) => {
      await usersPage.dateFromInput.fill("2099-01-01");
      await page.waitForResponse(
        (r) =>
          r.url().includes("/api/admin/users") && r.request().method() === "GET",
        { timeout: 5000 },
      );
      const rows = page.locator('[data-testid="user-row"]');
      const count = await rows.count();
      if (count === 0) {
        await expect(page.locator(".empty-state")).toBeVisible();
      }
    });
  });
};
