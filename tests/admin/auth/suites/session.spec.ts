import { test, expect } from "../../../fixtures/auth.fixture";
import { LoginPage } from "../../../pages/LoginPage";

export const sessionTests = () => {
  test.describe("Admin — Auth › Session", () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
      loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(
        process.env.ADMIN_EMAIL!,
        process.env.ADMIN_PASSWORD!,
      );
      await expect(page).toHaveURL(/\/menu/, { timeout: 10000 });
    });

    test("adminToken stored in localStorage after login", async ({ page }) => {
      const token = await page.evaluate(() =>
        localStorage.getItem("adminToken"),
      );
      expect(token).toBeTruthy();
    });

    test("adminToken is a valid JWT (three dot-separated parts)", async ({
      page,
    }) => {
      const token = await page.evaluate(() =>
        localStorage.getItem("adminToken"),
      );
      expect(token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
    });

    test("session persists after hard page reload", async ({ page }) => {
      await page.reload();
      await expect(page).toHaveURL(/\/menu/);
      const token = await page.evaluate(() =>
        localStorage.getItem("adminToken"),
      );
      expect(token).toBeTruthy();
    });

    test("token is unchanged after page reload", async ({ page }) => {
      const before = await page.evaluate(() =>
        localStorage.getItem("adminToken"),
      );
      await page.reload();
      const after = await page.evaluate(() =>
        localStorage.getItem("adminToken"),
      );
      expect(after).toBe(before);
    });

    test("session survives multiple reloads", async ({ page }) => {
      await page.reload();
      await page.reload();
      await expect(page).toHaveURL(/\/menu/);
    });
  });
};
