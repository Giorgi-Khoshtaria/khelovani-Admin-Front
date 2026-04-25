import { test, expect } from "../../../fixtures/auth.fixture";
import { LoginPage } from "../../../pages/LoginPage";
import { loadOrganizerPassword } from "../../../helpers/auth.helper";

export const sessionTests = () => {
  test.describe("Organizer — Auth › Session", () => {
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

    test("adminToken is a valid JWT in localStorage", async ({ page }) => {
      const token = await page.evaluate(() =>
        localStorage.getItem("adminToken"),
      );
      expect(token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
    });

    test("partnerId in localStorage matches URL segment", async ({ page }) => {
      const id = await page.evaluate(() => localStorage.getItem("partnerId"));
      expect(id).toBeTruthy();
      expect(partnerUrl).toContain(id);
    });

    test("session persists after page reload", async ({ page }) => {
      await page.reload();
      await expect(page).toHaveURL(/\/partners\/[a-f0-9]{24}/);
      const token = await page.evaluate(() =>
        localStorage.getItem("adminToken"),
      );
      expect(token).toBeTruthy();
    });

    test("token unchanged after reload", async ({ page }) => {
      const before = await page.evaluate(() =>
        localStorage.getItem("adminToken"),
      );
      await page.reload();
      const after = await page.evaluate(() =>
        localStorage.getItem("adminToken"),
      );
      expect(after).toBe(before);
    });

    test("reload stays on the same /partners/:id URL", async ({ page }) => {
      await page.reload();
      await expect(page).toHaveURL(partnerUrl);
    });
  });
};
