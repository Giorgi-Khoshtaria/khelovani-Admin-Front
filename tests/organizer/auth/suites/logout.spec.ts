import { test, expect } from "../../../fixtures/auth.fixture";
import { LoginPage } from "../../../pages/LoginPage";
import { loadOrganizerPassword } from "../../../helpers/auth.helper";
import { expectRedirectToLogin } from "../../../helpers/validation.helper";

export const logoutTests = () => {
  test.describe("Organizer — Auth › Logout", () => {
    let loginPage: LoginPage;
    let orgPw: string;
    let partnerUrl: string;

    test.beforeEach(async ({ page }) => {
      orgPw = loadOrganizerPassword();
      loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(process.env.ORGANIZER_EMAIL!, orgPw);
      await expect(page).toHaveURL(/\/partners\/[a-f0-9]{24}/, {
        timeout: 10000,
      });
      partnerUrl = page.url();
    });

    const logoutBtn = (page: import("@playwright/test").Page) =>
      page
        .locator('button:has-text("გამოსვლა")')
        .or(page.locator(".logout-btn"))
        .first();

    test("logout button is visible after login", async ({ page }) => {
      await expect(logoutBtn(page)).toBeVisible();
    });

    test("logout redirects to /login", async ({ page }) => {
      await logoutBtn(page).click();
      await expectRedirectToLogin(page);
    });

    test("logout clears adminToken from localStorage", async ({ page }) => {
      await logoutBtn(page).click();
      await expectRedirectToLogin(page);
      const token = await page.evaluate(() =>
        localStorage.getItem("adminToken"),
      );
      expect(token).toBeNull();
    });

    test("logout clears partnerId from localStorage", async ({ page }) => {
      await logoutBtn(page).click();
      await expectRedirectToLogin(page);
      const id = await page.evaluate(() => localStorage.getItem("partnerId"));
      expect(id).toBeNull();
    });

    test("after logout, partner page redirects to /login", async ({ page }) => {
      await logoutBtn(page).click();
      await expectRedirectToLogin(page);
      await page.goto(partnerUrl);
      await expectRedirectToLogin(page);
    });
  });
};
