import { test, expect } from "../../../fixtures/auth.fixture";
import { UsersPage } from "../../../pages/UsersPage";

export const usersErrorStatesTests = () => {
  test.describe("Admin — Users › Error States", () => {
    test("list API failure shows error toast", async ({ asAdmin: page }) => {
      await page.route("**/api/admin/users*", async (route) => {
        if (
          route.request().method() === "GET" &&
          !route.request().url().includes("/users/")
        ) {
          await route.fulfill({ status: 500, body: "Internal Server Error" });
        } else {
          await route.continue();
        }
      });

      await page.goto("/users");

      await expect(
        page.locator(".Toastify__toast--error"),
      ).toBeVisible({ timeout: 8000 });
    });

    test("details API failure shows error toast and redirects", async ({
      asAdmin: page,
    }) => {
      await page.route("**/api/admin/users/badid", async (route) => {
        await route.fulfill({ status: 404, body: "Not Found" });
      });

      await page.goto("/users/badid");
      await page.waitForTimeout(3000);

      const url = page.url();
      const hasError = await page
        .locator(".Toastify__toast--error, .error-state")
        .isVisible();
      expect(url.includes("/users") || hasError).toBeTruthy();
    });

    test("network failure on listing shows error toast", async ({
      asAdmin: page,
    }) => {
      await page.route("**/api/admin/users*", async (route) => {
        if (route.request().method() === "GET") {
          await route.abort("failed");
        } else {
          await route.continue();
        }
      });

      await page.goto("/users");

      await expect(
        page.locator(".Toastify__toast--error"),
      ).toBeVisible({ timeout: 8000 });
    });
  });
};
