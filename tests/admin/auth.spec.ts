import { test, expect } from "../fixtures/auth.fixture";
import { LoginPage } from "../pages/LoginPage";

test.describe("Admin — Auth", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("✅ login with valid admin credentials", async ({ page }) => {
    await loginPage.login(
      process.env.ADMIN_EMAIL!,
      process.env.ADMIN_PASSWORD!,
    );

    // button shows "მიმდინარეობს..." while loading
    // Note: This transition can be very fast, but we can check if it exists or was there
    // await expect(loginPage.submitButton).toHaveText("მიმდინარეობს...");

    await expect(loginPage.successToast).toHaveText(/წარმატებით შეხვედით/);

    // redirects to /menu
    await expect(page).toHaveURL(/\/menu/, { timeout: 10000 });

    // localStorage "adminToken" is set
    const token = await page.evaluate(() => localStorage.getItem("adminToken"));
    expect(token).toBeTruthy();
  });

  test("✅ session persists on page reload", async ({ page }) => {
    // Perform login first (or use storageState if this was a separate spec)
    await loginPage.login(
      process.env.ADMIN_EMAIL!,
      process.env.ADMIN_PASSWORD!,
    );
    await expect(page).toHaveURL(/\/menu/);

    await page.reload();
    await expect(page).toHaveURL(/\/menu/);
  });

  test("✅ logout", async ({ page }) => {
    await loginPage.login(
      process.env.ADMIN_EMAIL!,
      process.env.ADMIN_PASSWORD!,
    );
    await expect(page).toHaveURL(/\/menu/);

    // Logout logic (assuming there's a logout button in Header)
    await page
      .locator('button:has-text("გასვლა")')
      .or(page.locator(".logout-btn"))
      .click();

    await expect(page).toHaveURL(/\/login/);
    const token = await page.evaluate(() => localStorage.getItem("adminToken"));
    expect(token).toBeNull();
  });

  test("❌ login with empty email", async ({ page }) => {
    await loginPage.login("", "password");
    await expect(loginPage.emailError).toHaveText("ელ-ფოსტა აუცილებელია");
    await expect(page).toHaveURL(/\/login/);
  });

  test("❌ login with empty password", async ({ page }) => {
    await loginPage.login("admin@test.com", "");
    await expect(loginPage.passwordError).toHaveText("პაროლი აუცილებელია");
    await expect(page).toHaveURL(/\/login/);
  });

  test("❌ login with XSS in email", async () => {
    const xss = "<script>alert(1)</script>@test.com";
    await loginPage.login(xss, "password");
    await expect(loginPage.emailError).toHaveText("არასწორი ელ-ფოსტის ფორმატი");
  });

  test("❌ login with SQL injection in email", async () => {
    const sqli = "' OR '1'='1";
    await loginPage.login(sqli, "password");
    await expect(loginPage.emailError).toHaveText("არასწორი ელ-ფოსტის ფორმატი");
  });

  test("❌ login with invalid email format", async () => {
    await loginPage.login("notanemail", "password");
    await expect(loginPage.emailError).toHaveText("არასწორი ელ-ფოსტის ფორმატი");
  });

  test("❌ login with valid format email but wrong password", async () => {
    await loginPage.login(process.env.ADMIN_EMAIL!, "wrongpassword");
    await expect(loginPage.errorToast).toBeVisible();
  });

  test("❌ accessing protected route unauthenticated", async ({ page }) => {
    await page.goto("/menu");
    await expect(page).toHaveURL(/\/login/);
  });
});
