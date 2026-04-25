import { test, expect } from "../../../fixtures/auth.fixture";
import { RolesPage } from "../../../pages/RolesPage";
import { ApiHelper } from "../../../helpers/api.helper";
import { expectSuccessToast } from "../../../helpers/validation.helper";
export const rolesPermissionsTests = () => {
  test.describe("Admin — Roles › Permissions", () => {
    let rolesPage: RolesPage;
    let api: ApiHelper;
    let createdRoleIds: string[] = [];

    test.beforeEach(async ({ asAdmin: page }) => {
      rolesPage = new RolesPage(page);
      api = new ApiHelper();
      await api.login();

      const perms = await api.getPermissions();
      if (perms.length === 0) {
        await api.createPermission({
          name: "test.permission",
          description: "Test Permission",
          category: "General",
        });
      }

      await rolesPage.goto();
      await expect(page.locator(".loading")).not.toBeVisible({
        timeout: 10000,
      });
    });

    test.afterEach(async () => {
      for (const id of createdRoleIds) {
        try {
          await api.deleteRole(id);
        } catch {
          /* skip */
        }
      }
      createdRoleIds = [];
    });

    async function ensureRoleAndNavigate(
      page: import("@playwright/test").Page,
    ) {
      let roles = await api.getRoles();
      if (roles.length === 0) {
        const res = await api.createRole({
          name: `Perm-Role-${Date.now()}`,
          description: "for permission testing",
        });
        createdRoleIds.push(res._id ?? res.data?._id);
        await page.reload();
        await expect(page.locator(".loading")).not.toBeVisible({
          timeout: 10000,
        });
        roles = await api.getRoles();
      }
      await page.locator(".role-card").first().click();
      await expect(page.locator(".loading")).not.toBeVisible({
        timeout: 10000,
      });
      await expect(page.locator("h1")).toContainText(/უფლებების მართვა/);
    }

    test("toggle a permission and verify it persists after reload", async ({
      asAdmin: page,
    }) => {
      await ensureRoleAndNavigate(page);

      const checkbox = page
        .locator('.permission-item input[type="checkbox"]')
        .first();
      await expect(checkbox).toBeVisible({ timeout: 15000 });

      const before = await checkbox.isChecked();
      await checkbox.click({ force: true });
      await page.locator('button.btn-success:has-text("შენახვა")').click();
      await expectSuccessToast(page);

      await page.reload();
      await expect(page.locator(".loading")).not.toBeVisible({
        timeout: 10000,
      });
      await expect(checkbox).toBeVisible();
      expect(await checkbox.isChecked()).not.toBe(before);

      // Restore
      await checkbox.click({ force: true });
      await page.locator('button.btn-success:has-text("შენახვა")').click();
      await expectSuccessToast(page);
    });

    test("save button shows success toast on permission update", async ({
      asAdmin: page,
    }) => {
      await ensureRoleAndNavigate(page);

      const checkbox = page
        .locator('.permission-item input[type="checkbox"]')
        .first();
      await expect(checkbox).toBeVisible({ timeout: 15000 });

      await checkbox.click({ force: true });
      await page.locator('button.btn-success:has-text("შენახვა")').click();
      await expectSuccessToast(page);

      // Restore
      await checkbox.click({ force: true });
      await page.locator('button.btn-success:has-text("შენახვა")').click();
      await expectSuccessToast(page);
    });
  });
};
