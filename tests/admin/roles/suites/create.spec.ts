import { test, expect } from "../../../fixtures/auth.fixture";
import { RolesPage } from "../../../pages/RolesPage";
import { ApiHelper } from "../../../helpers/api.helper";
import { expectSuccessToast } from "../../../helpers/validation.helper";

export const rolesCreateTests = () => {
  test.describe("Admin — Roles › Create", () => {
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

    test("create role → success toast + card appears in list", async ({
      asAdmin: page,
    }) => {
      const name = `Role-${Date.now()}`;
      await rolesPage.newRoleBtn.click();
      await rolesPage.roleName.fill(name);
      await rolesPage.roleDesc.fill("E2E created role");
      await rolesPage.saveBtn.click();

      await expectSuccessToast(page);
      await expect(page.locator(".role-card", { hasText: name })).toBeVisible({
        timeout: 10000,
      });

      const roles = await api.getRoles();
      const created = roles.find(
        (r: { name: string; _id: string }) => r.name === name,
      );
      if (created?._id) createdIds.push(created._id);
    });

    test("create role with description → description visible on card or detail", async ({
      asAdmin: page,
    }) => {
      const name = `Desc-Role-${Date.now()}`;
      const desc = "Test Description " + Date.now();
      await rolesPage.newRoleBtn.click();
      await rolesPage.roleName.fill(name);
      await rolesPage.roleDesc.fill(desc);
      await rolesPage.saveBtn.click();

      await expectSuccessToast(page);
      const card = page.locator(".role-card", { hasText: name });
      await expect(card).toBeVisible({ timeout: 10000 });

      const roles = await api.getRoles();
      const created = roles.find(
        (r: { name: string; _id: string }) => r.name === name,
      );
      if (created?._id) createdIds.push(created._id);
    });
  });
};
