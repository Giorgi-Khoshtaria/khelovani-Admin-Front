import { test, expect } from "../fixtures/auth.fixture";

test.describe("Security — RBAC Isolation", () => {
  // backtest: tests/api/admin/rbac_isolation.spec.ts (or equivalent backend permission tests)

  test("RBAC-001: ❌ Organizer cannot access Admin Roles page", async ({
    asOrganizer: page,
  }) => {
    await page.goto("/roles");
    await expect(page.locator(".Toastify__toast--error").first()).toContainText(/წვდომის უფლება|Denied/);
    await expect(page).not.toHaveURL(/\/roles/);
  });

  test("RBAC-002: ❌ Organizer cannot access Admin Translations page", async ({
    asOrganizer: page,
  }) => {
    await page.goto("/translations");
    await expect(page.locator(".Toastify__toast--error").first()).toContainText(/წვდომის უფლება|Denied/);
    await expect(page).not.toHaveURL(/\/translations/);
  });

  test("RBAC-003: ❌ Organizer cannot access Admin Partners list", async ({
    asOrganizer: page,
  }) => {
    await page.goto("/partners");
    await expect(page.locator(".Toastify__toast--error").first()).toContainText(/წვდომის უფლება|Denied/);
    await expect(page).not.toHaveURL(/\/partners$/);
  });

  test("RBAC-004: ❌ Organizer cannot access another partner's details", async ({
    asOrganizer: page,
  }) => {
    const otherPartnerId = "60d5ec49f1b2c1a2c8f8b888"; // Random ID
    await page.goto(`/partners/${otherPartnerId}`);
    await expect(page.locator(".Toastify__toast--error").first()).toContainText(/წვდომის უფლება|Denied/);
    await expect(page).not.toHaveURL(new RegExp(`/partners/${otherPartnerId}`));
  });

  test("SEC-AUTH: ❌ Unauthenticated partner is redirected to login", async ({
    page,
  }) => {
    await page.goto("/menu");
    await expect(page).toHaveURL(/\/login/);
  });

  test("SEC-RBAC: ✅ Admin can access everything", async ({
    asAdmin: page,
  }) => {
    await page.goto("/menu");
    await expect(page).toHaveURL(/\/menu/);

    await page.goto("/partners");
    await expect(page).toHaveURL(/\/partners/);

    await page.goto("/roles");
    await expect(page).toHaveURL(/\/roles/);
  });
});
