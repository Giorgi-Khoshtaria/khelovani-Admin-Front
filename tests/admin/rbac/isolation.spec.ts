import { test, expect } from "../../fixtures/auth.fixture";
import { ADMIN_ONLY_ROUTES } from "../../helpers/validation.helper";

test.describe("Admin — RBAC › Role Isolation", () => {
  // ── Organizer blocked from admin-only routes ──────────────────────────────

  for (const route of ADMIN_ONLY_ROUTES) {
    test(`organizer CANNOT access ${route}`, async ({ asOrganizer: page }) => {
      await page.goto(route);
      await expect(page).not.toHaveURL(new RegExp(`${route}$`), {
        timeout: 8000,
      });
    });
  }

  test("organizer CANNOT access /partners list (admin view)", async ({
    asOrganizer: page,
  }) => {
    await page.goto("/partners");
    await expect(page).not.toHaveURL(/\/partners$/, { timeout: 8000 });
  });

  test("organizer CANNOT access /export", async ({ asOrganizer: page }) => {
    await page.goto("/export");
    await expect(
      page.locator("h1:has-text('მონაცემების ექსპორტი')"),
    ).not.toBeVisible({ timeout: 5000 });
  });

  test("organizer CANNOT access another partner's details", async ({
    asOrganizer: page,
  }) => {
    await page.goto("/partners/000000000000000000000001");
    await expect(page).not.toHaveURL(
      /\/partners\/000000000000000000000001/,
      { timeout: 8000 },
    );
  });

  // ── Unauthenticated ───────────────────────────────────────────────────────

  test("unauthenticated visitor is redirected to /login for any protected route", async ({
    page,
  }) => {
    await page.goto("/menu");
    await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
  });

  // ── Admin full access ─────────────────────────────────────────────────────

  test("admin CAN access all admin routes", async ({ asAdmin: page }) => {
    for (const route of ["/menu", "/partners", "/roles", "/translations", "/export"]) {
      await page.goto(route);
      await expect(page).toHaveURL(new RegExp(route), { timeout: 8000 });
    }
  });
});
