import { test, expect } from "../../../fixtures/auth.fixture";
import { RolesPage } from "../../../pages/RolesPage";
import { ApiHelper } from "../../../helpers/api.helper";

export const rolesSystemRoleProtectionTests = () => {
  test.describe("Admin — Roles › System Role Protection", () => {
    let rolesPage: RolesPage;
    let api: ApiHelper;

    test.beforeEach(async ({ asAdmin: page }) => {
      rolesPage = new RolesPage(page);
      api = new ApiHelper();
      await api.login();
      await rolesPage.goto();
      await expect(page.locator(".loading")).not.toBeVisible({ timeout: 10000 });
    });

    test("delete button is hidden for the admin system role", async ({
      asAdmin: page,
    }) => {
      // Find the admin role card
      const adminCard = page.locator(".role-card", { hasText: "admin" }).first();
      await expect(adminCard).toBeVisible({ timeout: 10000 });

      // Delete button must not be visible
      await expect(adminCard.locator("button:has-text('წაშლა')")).not.toBeVisible();
    });

    test("delete button IS visible for non-system roles", async ({
      asAdmin: page,
    }) => {
      const name = `DeletableRole-${Date.now()}`;
      const res = await api.createRole({ name, description: "deletable" });
      const roleId = res?._id ?? res?.data?._id;

      try {
        await page.reload();
        await expect(page.locator(".loading")).not.toBeVisible({ timeout: 10000 });

        const card = page.locator(".role-card", { hasText: name });
        await expect(card).toBeVisible({ timeout: 10000 });
        await expect(card.locator("button:has-text('წაშლა')")).toBeVisible();
      } finally {
        if (roleId) await api.deleteRole(roleId).catch(() => {});
      }
    });

    test("allowedPanels checkboxes are disabled on system role detail page", async ({
      asAdmin: page,
    }) => {
      // Navigate to the admin role's detail page
      const adminCard = page.locator(".role-card", { hasText: "admin" }).first();
      await expect(adminCard).toBeVisible({ timeout: 10000 });
      await adminCard.locator("a:has-text('უფლებების მართვა')").click();

      await expect(page.locator(".loading")).not.toBeVisible({ timeout: 10000 });
      await expect(page.locator("h1")).toContainText(/უფლებების მართვა/);

      // Panel checkboxes should be disabled for system role
      const panelCheckboxes = page.locator(".allowed-panels-section input[type='checkbox']");
      const count = await panelCheckboxes.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        await expect(panelCheckboxes.nth(i)).toBeDisabled();
      }
    });

    test("allowedPanels checkboxes are enabled on non-system role detail page", async ({
      asAdmin: page,
    }) => {
      const name = `PanelRole-${Date.now()}`;
      const res = await api.createRole({
        name,
        description: "panel test",
        allowedPanels: ["admin"],
      });
      const roleId = res?._id ?? res?.data?._id;

      try {
        await page.reload();
        await expect(page.locator(".loading")).not.toBeVisible({ timeout: 10000 });

        const card = page.locator(".role-card", { hasText: name });
        await expect(card).toBeVisible({ timeout: 10000 });
        await card.click();

        await expect(page.locator(".loading")).not.toBeVisible({ timeout: 10000 });
        await expect(page.locator("h1")).toContainText(/უფლებების მართვა/);

        const panelCheckboxes = page.locator(".allowed-panels-section input[type='checkbox']");
        const count = await panelCheckboxes.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
          await expect(panelCheckboxes.nth(i)).not.toBeDisabled();
        }
      } finally {
        if (roleId) await api.deleteRole(roleId).catch(() => {});
      }
    });
  });
};
