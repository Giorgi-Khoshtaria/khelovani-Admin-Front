import { test, expect } from "../../../fixtures/auth.fixture";
import type { Page } from "@playwright/test";
import { expectRedirectToLogin } from "../../../helpers/validation.helper";

export const logoutTests = () => {
  test.describe("Admin — Auth › Logout", () => {
    test.beforeEach(async ({ asAdmin }) => {
      await asAdmin.goto("/menu");
      await expect(asAdmin).toHaveURL(/\/menu/, { timeout: 10000 });
    });

    const logoutBtn = (page: Page) => page.locator(".logout-btn");

    test("logout button is visible after login", async ({ asAdmin }) => {
      await expect(logoutBtn(asAdmin)).toBeVisible();
    });

    test("logout redirects to /login", async ({ asAdmin }) => {
      await logoutBtn(asAdmin).click();
      await expectRedirectToLogin(asAdmin);
    });

    test("logout clears adminToken from localStorage", async ({ asAdmin }) => {
      await logoutBtn(asAdmin).click();
      await expectRedirectToLogin(asAdmin);
      const token = await asAdmin.evaluate(() =>
        localStorage.getItem("adminToken"),
      );
      expect(token).toBeNull();
    });

    test("logout clears all token keys from localStorage", async ({ asAdmin }) => {
      await logoutBtn(asAdmin).click();
      await expectRedirectToLogin(asAdmin);
      const tokenKeys = await asAdmin.evaluate(() => {
        const keys: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i)!;
          if (k.toLowerCase().includes("token")) keys.push(k);
        }
        return keys;
      });
      expect(tokenKeys).toHaveLength(0);
    });

    test("accessing /menu after logout redirects back to /login", async ({
      asAdmin,
    }) => {
      await logoutBtn(asAdmin).click();
      await expectRedirectToLogin(asAdmin);
      await asAdmin.goto("/menu");
      await expectRedirectToLogin(asAdmin);
    });

    test("browser back button after logout cannot restore session", async ({
      asAdmin,
    }) => {
      await logoutBtn(asAdmin).click();
      await expectRedirectToLogin(asAdmin);
      await asAdmin.goBack();
      await expect(asAdmin)
        .toHaveURL(/\/login/, { timeout: 5000 })
        .catch(() => expect(asAdmin).not.toHaveURL(/\/menu/));
    });
  });
};
