import { test, expect } from "../../../fixtures/auth.fixture";
import { LoginPage } from "../../../pages/LoginPage";
import {
  loginEmailScenarios,
  loginPasswordScenarios,
  assertScenario,
  assertStaysOnLogin,
  assertErrorToast,
  assertSuccessToast,
} from "../../../helpers/validation-scenarios.helper";

export const loginValidationTests = () => {
  test.describe("Admin — Login › Validation", () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
      loginPage = new LoginPage(page);
      await loginPage.goto();
    });

    // ── Email field ───────────────────────────────────────────────────────────

    for (const s of loginEmailScenarios) {
      test(`${s.id} — email: ${s.note}`, async ({ page }) => {
        await loginPage.emailInput.fill(s.value);
        await loginPage.passwordInput.fill("somepassword");
        await loginPage.submitButton.click();
        await assertScenario(loginPage.emailError, s);
        await assertStaysOnLogin(page);
      });
    }

    // ── Password field ────────────────────────────────────────────────────────

    for (const s of loginPasswordScenarios) {
      test(`${s.id} — password: ${s.note}`, async ({ page }) => {
        await loginPage.emailInput.fill("admin@test.com");
        await loginPage.passwordInput.fill(s.value);
        await loginPage.submitButton.click();
        await assertScenario(loginPage.passwordError, s);
        await assertStaysOnLogin(page);
      });
    }

    // ── Wrong credentials ─────────────────────────────────────────────────────

    test("wrong password → error toast, stays on login", async ({ page }) => {
      await loginPage.login(process.env.ADMIN_EMAIL!, "wrongpassword");
      await assertErrorToast(page);
      await assertStaysOnLogin(page);
    });

    test("nonexistent email → error toast, stays on login", async ({
      page,
    }) => {
      await loginPage.login("nobody@nowhere.com", "anypassword");
      await assertErrorToast(page);
      await assertStaysOnLogin(page);
    });

    // ── Happy path ────────────────────────────────────────────────────────────

    test("valid credentials → success toast + redirects to /menu", async ({
      page,
    }) => {
      await loginPage.login(
        process.env.ADMIN_EMAIL!,
        process.env.ADMIN_PASSWORD!,
      );
      await assertSuccessToast(page, /წარმატებით შეხვედით/);
      await expect(page).toHaveURL(/\/menu/, { timeout: 10000 });
    });

    test("password field is masked (type=password)", async () => {
      await expect(loginPage.passwordInput).toHaveAttribute("type", "password");
    });
  });
};
