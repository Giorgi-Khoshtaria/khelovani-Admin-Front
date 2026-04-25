import { test, expect } from "../../../fixtures/auth.fixture";
import { LoginPage } from "../../../pages/LoginPage";
import {
  ADMIN_PROTECTED_ROUTES,
  assertRedirectedToLogin,
} from "../../../helpers/validation-scenarios.helper";
export const navigationGuardTests = () => {
  test.describe("Admin — Auth › Navigation Guards", () => {
    for (const route of ADMIN_PROTECTED_ROUTES) {
      test(`unauthenticated → ${route} redirects to /login`, async ({
        page,
      }) => {
        await page.goto(route);
        await assertRedirectedToLogin(page);
      });
    }

    test("unauthenticated → / redirects to /login", async ({ page }) => {
      await page.goto("/");
      await assertRedirectedToLogin(page);
    });

    test("unauthenticated → unknown route redirects to /login", async ({
      page,
    }) => {
      await page.goto("/this-does-not-exist");
      await assertRedirectedToLogin(page);
    });

    test("/login is publicly accessible without a token", async ({ page }) => {
      await page.goto("/login");
      await expect(page).toHaveURL(/\/login/);
    });

    test("authenticated admin is redirected from /login to /menu", async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(
        process.env.ADMIN_EMAIL!,
        process.env.ADMIN_PASSWORD!,
      );
      await expect(page).toHaveURL(/\/menu/, { timeout: 10000 });
    });

    test("authenticated admin can revisit /menu without redirect loop", async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(
        process.env.ADMIN_EMAIL!,
        process.env.ADMIN_PASSWORD!,
      );
      await expect(page).toHaveURL(/\/menu/, { timeout: 10000 });
      await page.goto("/menu");
      await expect(page).toHaveURL(/\/menu/);
    });
  });
};
