import { test, expect } from "../../../fixtures/auth.fixture";
import { LoginPage } from "../../../pages/LoginPage";
import {
  expectErrorToast,
  expectFieldError,
  expectNoXssDialog,
  expectRedirectToLogin,
} from "../../../helpers/validation.helper";

export const securityTests = () => {
  test.describe("Admin — Auth › Security", () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
      loginPage = new LoginPage(page);
      await loginPage.goto();
    });

    test("XSS payload in email → client rejects as invalid format", async ({
      page,
    }) => {
      await loginPage.login("<script>alert(1)</script>@test.com", "password");
      await expectFieldError(
        loginPage.emailError,
        "არასწორი ელ-ფოსტის ფორმატი",
      );
      await expectRedirectToLogin(page);
    });

    test("HTML injection in email → no alert dialog fires", async ({
      page,
    }) => {
      await expectNoXssDialog(page, () =>
        loginPage.login(`"><img src=x onerror=alert(1)>@x.com`, "password"),
      );
      await expectRedirectToLogin(page);
    });

    test("XSS payload in password → no alert dialog, server rejects", async ({
      page,
    }) => {
      await expectNoXssDialog(page, () =>
        loginPage.login(process.env.ADMIN_EMAIL!, "<script>alert(1)</script>"),
      );
      await expectErrorToast(page);
    });

    test("extremely long email (500 chars) → validation error, no crash", async ({
      page,
    }) => {
      const longEmail = "a".repeat(245) + "@" + "b".repeat(247) + ".com";
      await loginPage.login(longEmail, "password");
      await expect(loginPage.emailError).toBeVisible();
      await expectRedirectToLogin(page);
    });

    test("extremely long password (500 chars) → field error, no crash", async ({
      page,
    }) => {
      const longPw = "P@ssw0rd" + "x".repeat(492);
      await loginPage.login(process.env.ADMIN_EMAIL!, longPw);
      await expectFieldError(loginPage.passwordError, "პაროლი არ უნდა აღემატებოდეს 128 სიმბოლოს");
      await expectRedirectToLogin(page);
    });

    test("null-byte in email → no server crash, stays on /login", async ({
      page,
    }) => {
      await loginPage.emailInput.fill("admin\x00@test.com");
      await loginPage.passwordInput.fill("password");
      await loginPage.submitButton.click();
      await expectRedirectToLogin(page);
    });

    test("failed login never stores a token in localStorage", async ({
      page,
    }) => {
      await loginPage.login("nobody@nowhere.com", "badpassword");
      await expectErrorToast(page);
      const token = await page.evaluate(() =>
        localStorage.getItem("adminToken"),
      );
      expect(token).toBeNull();
    });
  });
};
