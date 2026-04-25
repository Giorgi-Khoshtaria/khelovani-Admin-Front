import { test, expect } from "../../../fixtures/auth.fixture";
import { LoginPage } from "../../../pages/LoginPage";
import { assertSuccessToast } from "../../../helpers/validation-scenarios.helper";

export const loginTests = () => {
  test.describe("Admin — Auth › Login", () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
      loginPage = new LoginPage(page);
      await loginPage.goto();
    });

    test("login page renders all form elements", async () => {
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.submitButton).toBeVisible();
    });

    test("valid credentials → success toast + /menu redirect + token stored", async ({
      page,
    }) => {
      await loginPage.login(
        process.env.ADMIN_EMAIL!,
        process.env.ADMIN_PASSWORD!,
      );
      await assertSuccessToast(page, /წარმატებით შეხვედით/);
      await expect(page).toHaveURL(/\/menu/, { timeout: 10000 });
      const token = await page.evaluate(() =>
        localStorage.getItem("adminToken"),
      );
      expect(token).toBeTruthy();
    });
  });
};
