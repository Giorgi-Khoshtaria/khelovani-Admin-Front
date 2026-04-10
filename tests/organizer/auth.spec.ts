import { test, expect } from "../fixtures/auth.fixture";
import { LoginPage } from "../pages/LoginPage";
import * as fs from "fs";
import * as path from "path";


test.describe("Organizer — Auth", () => {
  let loginPage: LoginPage;
  let dynamicPassword = process.env.ORGANIZER_PASSWORD!;
  
  // Try to load dynamic password if it exists
  const passFile = path.resolve(process.cwd(), "tests/.auth/organizer-password.txt");
  if (fs.existsSync(passFile)) {
    dynamicPassword = fs.readFileSync(passFile, "utf-8").trim();
  }

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("✅ login with valid organizer credentials", async ({ page }) => {
    await loginPage.login(process.env.ORGANIZER_EMAIL!, dynamicPassword);
    await expect(loginPage.successToast).toBeVisible();
    
    // redirects to /partners/:partnerId
    await expect(page).toHaveURL(/\/partners\/[a-f0-9]{24}/);
  });

  test("✅ organizer CANNOT access admin-only /menu", async ({ page }) => {
    // Navigate
    await page.goto("/menu");
    
    await expect(page).not.toHaveURL(/\/menu/);
  });

  test("✅ logout", async ({ page }) => {
      await loginPage.login(process.env.ORGANIZER_EMAIL!, dynamicPassword);
      await page.locator('button:has-text("გამოსვლა")').or(page.locator('.logout-btn')).click();
      await expect(page).toHaveURL(/\/login/);
  });
});

