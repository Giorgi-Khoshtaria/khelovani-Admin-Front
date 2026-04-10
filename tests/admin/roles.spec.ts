import { Page } from "@playwright/test";
import { test, expect } from "../fixtures/auth.fixture";
import { RolesPage } from "../pages/RolesPage";
import { ApiHelper } from "../helpers/api.helper";

test.describe("Admin — Roles", () => {
  let rolesPage: RolesPage;

  test.beforeEach(async ({ asAdmin: page }) => {
    rolesPage = new RolesPage(page);
    await ensurePermissionsExist();
    await rolesPage.goto();
    // Wait for the loading to disappear
    await expect(page.locator(".loading")).not.toBeVisible();
  });

  async function ensurePermissionsExist() {
    const api = new ApiHelper();
    await api.login();
    const perms = await api.getPermissions();
    if (perms.length === 0) {
      await api.createPermission({
        name: "test.permission",
        description: "Test Permission Description",
        category: "General"
      });
    }
  }

  async function ensureRoleExists(page: Page) {
    // Wait for loading to finish if it hasn't or is re-loading
    await expect(page.locator(".loading")).not.toBeVisible();
    
    // Check for roles
    const roleCard = page.locator(".role-card").first();
    const count = await roleCard.count();
    
    if (count === 0) {
      await rolesPage.newRoleBtn.click();
      await rolesPage.roleName.fill("Test-Role-" + Date.now());
      await rolesPage.roleDesc.fill("Automated Test Role Description");
      await rolesPage.saveBtn.click();
      
      // Verify success and wait for refresh
      await expect(page.locator(".Toastify__toast--success").first()).toBeVisible();
      await expect(page.locator(".role-card").first()).toBeVisible({ timeout: 10000 });
    }
  }

  test("PR-008: ✅ roles list page loads correctly", async ({ asAdmin: page }) => {
    await expect(page).toHaveURL(/\/roles/);
    await expect(page.locator("h1")).toContainText(/როლები და უფლებები/);
  });

  test("PR-009: ✅ read: navigate to role detail page", async ({ asAdmin: page }) => {
    await ensureRoleExists(page);
    const roleCard = page.locator(".role-card").first();
    await roleCard.click();
    await expect(page).toHaveURL(/\/roles\/.+/);
    // Detail page also has loading
    await expect(page.locator(".loading")).not.toBeVisible();
    await expect(page.locator("h1")).toContainText(/უფლებების მართვა/);
  });

  test("PR-010: ✅ toggle permission in role detail", async ({ asAdmin: page }) => {
    await ensureRoleExists(page);
    await page.locator(".role-card").first().click();

    // Detail page loading
    await expect(page.locator(".loading")).not.toBeVisible();

    // Wait for permissions (checkboxes inside items)
    const checkbox = page.locator('.permission-item input[type="checkbox"]').first();
    await expect(checkbox).toBeVisible({ timeout: 15000 });

    const isChecked = await checkbox.isChecked();
    await checkbox.click({ force: true });

    await page.locator('button.btn-success:has-text("შენახვა")').click();
    await expect(page.locator(".Toastify__toast--success").first()).toBeVisible();

    await page.reload();
    await expect(page.locator(".loading")).not.toBeVisible();
    await expect(checkbox).toBeVisible();
    expect(await checkbox.isChecked()).not.toBe(isChecked);
  });
});
