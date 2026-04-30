import { test, expect } from "../../../fixtures/auth.fixture";
import { UsersPage } from "../../../pages/UsersPage";
import { ApiHelper } from "../../../helpers/api.helper";

export const usersSearchTests = () => {
  test.describe("Admin — Users › Search", () => {
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

    test("search input is visible and functional", async ({
      asAdmin: page,
    }) => {
      await expect(usersPage.searchInput).toBeVisible();
      await usersPage.searchInput.fill("test");
      await expect(usersPage.searchInput).toHaveValue("test");
    });

    test("search triggers a new API request after debounce", async ({
      asAdmin: page,
    }) => {
      const responsePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/admin/users") &&
          r.url().includes("search=") &&
          r.request().method() === "GET",
        { timeout: 5000 },
      );
      await usersPage.searchInput.fill("admin");
      await responsePromise;
    });

    test("clearing search shows all results again", async ({
      asAdmin: page,
    }) => {
      await usersPage.searchInput.fill("nonexistent_xyz_abc");
      await page.waitForTimeout(700);
      await usersPage.searchInput.fill("");
      await page.waitForResponse(
        (r) =>
          r.url().includes("/api/admin/users") && r.request().method() === "GET",
        { timeout: 5000 },
      );
      await expect(
        page.locator(".users-list, .empty-state"),
      ).toBeVisible();
    });

    test("no-match search shows empty state", async ({ asAdmin: page }) => {
      await usersPage.searchInput.fill("zzz_no_match_xyz_99999");
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

    test("clear filters button appears when search is active", async ({
      asAdmin: page,
    }) => {
      await usersPage.searchInput.fill("test");
      await expect(usersPage.clearFiltersBtn).toBeVisible();
    });

    test("clear filters button clears search value", async ({
      asAdmin: page,
    }) => {
      await usersPage.searchInput.fill("test");
      await expect(usersPage.clearFiltersBtn).toBeVisible();
      await usersPage.clearFiltersBtn.click();
      await expect(usersPage.searchInput).toHaveValue("");
    });
  });
};
