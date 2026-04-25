import { test, expect } from "../../../fixtures/auth.fixture";
import { LoginPage } from "../../../pages/LoginPage";
import { loadOrganizerPassword } from "../../../helpers/auth.helper";
import { ADMIN_ONLY_ROUTES } from "../../../helpers/validation.helper";

export const accessControlTests = () => {
  test.describe("Organizer — Auth › Access Control", () => {
    // ── Unauthenticated ───────────────────────────────────────────────────────

    test("unauthenticated visitor → /partners redirects to /login", async ({
      page,
    }) => {
      await page.goto("/partners");
      await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
    });

    // ── Admin-only routes blocked for organizer ───────────────────────────────

    for (const route of ADMIN_ONLY_ROUTES) {
      test(`organizer CANNOT access admin-only ${route}`, async ({
        asOrganizer: page,
      }) => {
        await page.goto(route);
        await expect(page).not.toHaveURL(new RegExp(`${route}$`), {
          timeout: 8000,
        });
      });
    }

    // ── Organizer can access own page ─────────────────────────────────────────

    test("organizer CAN access own /partners/:id page after login", async ({
      page,
    }) => {
      const orgPw = loadOrganizerPassword();
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(process.env.ORGANIZER_EMAIL!, orgPw);
      await expect(page).toHaveURL(/\/partners\/[a-f0-9]{24}/, {
        timeout: 10000,
      });
    });

    test("organizer token cannot unlock /menu", async ({
      asOrganizer: page,
    }) => {
      await page.goto("/menu");
      await expect(page).not.toHaveURL(/\/menu/, { timeout: 8000 });
    });

    test("organizer cannot access a different partner's page", async ({
      asOrganizer: page,
    }) => {
      await page.goto("/partners/000000000000000000000001");
      await expect(page).not.toHaveURL(/\/partners\/000000000000000000000001/, {
        timeout: 8000,
      });
    });
  });
};
