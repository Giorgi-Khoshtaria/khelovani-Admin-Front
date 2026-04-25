import { test, expect } from "../../../fixtures/auth.fixture";
import { RolesPage } from "../../../pages/RolesPage";
import { ApiHelper } from "../../../helpers/api.helper";
export const rolesListTests = () => {
  test.describe("Admin — Roles › List", () => {
    let rolesPage: RolesPage;
    let api: ApiHelper;
    let createdIds: string[] = [];

    test.beforeEach(async ({ asAdmin: page }) => {
      rolesPage = new RolesPage(page);
      api = new ApiHelper();
      await api.login();
      await rolesPage.goto();
      await expect(page.locator(".loading")).not.toBeVisible({
        timeout: 10000,
      });
    });

    test.afterEach(async () => {
      for (const id of createdIds) {
        try {
          await api.deleteRole(id);
        } catch {
          /* skip */
        }
      }
      createdIds = [];
    });

    test("roles page loads at /roles", async ({ asAdmin: page }) => {
      await expect(page).toHaveURL(/\/roles/);
      await expect(page.locator("h1")).toContainText(/როლები და უფლებები/);
    });

    test("clicking a role card navigates to detail page", async ({
      asAdmin: page,
    }) => {
      // Ensure at least one role exists
      const roles = await api.getRoles();
      if (roles.length === 0) {
        const res = await api.createRole({
          name: `List-Role-${Date.now()}`,
          description: "list test",
        });
        createdIds.push(res._id ?? res.data?._id);
        await page.reload();
        await expect(page.locator(".loading")).not.toBeVisible({
          timeout: 10000,
        });
      }

      await page.locator(".role-card").first().click();
      await expect(page).toHaveURL(/\/roles\/.+/);
      await expect(page.locator(".loading")).not.toBeVisible({
        timeout: 10000,
      });
      await expect(page.locator("h1")).toContainText(/უფლებების მართვა/);
    });

    test("roles list shows role name on each card", async ({
      asAdmin: page,
    }) => {
      const name = `ListCheck-${Date.now()}`;
      const res = await api.createRole({ name, description: "check" });
      createdIds.push(res._id ?? res.data?._id);

      await page.reload();
      await expect(page.locator(".loading")).not.toBeVisible({
        timeout: 10000,
      });
      await expect(page.locator(".role-card", { hasText: name })).toBeVisible();
    });
  });
};
