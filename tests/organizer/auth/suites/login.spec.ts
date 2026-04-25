import { test, expect } from "../../../fixtures/auth.fixture";
import { LoginPage } from "../../../pages/LoginPage";
import { loadOrganizerPassword } from "../../../helpers/auth.helper";
import {
  loginEmailScenarios,
  loginPasswordScenarios,
  assertScenario,
  assertSuccessToast,
  assertErrorToast,
  assertStaysOnLogin,
} from "../../../helpers/validation-scenarios.helper";

export const loginTests = () => {
  test.describe("Organizer — Auth › Login", () => {
    let loginPage: LoginPage;
    let orgPw: string;

    test.beforeEach(async ({ page }) => {
      orgPw = loadOrganizerPassword();
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
        await loginPage.emailInput.fill(process.env.ORGANIZER_EMAIL!);
        await loginPage.passwordInput.fill(s.value);
        await loginPage.submitButton.click();
        await assertScenario(loginPage.passwordError, s);
        await assertStaysOnLogin(page);
      });
    }

    // ── Wrong credentials ─────────────────────────────────────────────────────

    test("wrong password → error toast, stays on login", async ({ page }) => {
      await loginPage.login(
        process.env.ORGANIZER_EMAIL!,
        "definitely-wrong-pw",
      );
      await assertErrorToast(page);
      await assertStaysOnLogin(page);
    });

    test("nonexistent email → error toast, stays on login", async ({
      page,
    }) => {
      await loginPage.login("nobody@nowhere.com", "anypass");
      await assertErrorToast(page);
      await assertStaysOnLogin(page);
    });

    // ── Happy path ────────────────────────────────────────────────────────────

    test("valid credentials → success toast + redirect to /partners/:id", async ({
      page,
    }) => {
      await loginPage.login(process.env.ORGANIZER_EMAIL!, orgPw);
      await assertSuccessToast(page);
      await expect(page).toHaveURL(/\/partners\/[a-f0-9]{24}/, {
        timeout: 10000,
      });
    });

    test("valid login stores adminToken in localStorage", async ({ page }) => {
      await loginPage.login(process.env.ORGANIZER_EMAIL!, orgPw);
      await expect(page).toHaveURL(/\/partners\/[a-f0-9]{24}/, {
        timeout: 10000,
      });
      const token = await page.evaluate(() =>
        localStorage.getItem("adminToken"),
      );
      expect(token).toBeTruthy();
    });

    test("valid login stores partnerId in localStorage", async ({ page }) => {
      await loginPage.login(process.env.ORGANIZER_EMAIL!, orgPw);
      await expect(page).toHaveURL(/\/partners\/[a-f0-9]{24}/, {
        timeout: 10000,
      });
      const id = await page.evaluate(() => localStorage.getItem("partnerId"));
      expect(id).toMatch(/^[a-f0-9]{24}$/);
    });
  });
};
