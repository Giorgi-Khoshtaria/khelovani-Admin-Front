import { test, expect } from "../../../fixtures/auth.fixture";
import { RolesPage } from "../../../pages/RolesPage";
import { ApiHelper } from "../../../helpers/api.helper";
import { expectSuccessToast } from "../../../helpers/validation.helper";

export const rolesDeleteTests = () => {
  test.describe("Admin — Roles › Delete", () => {
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

    test("delete role → success toast + card removed from list", async ({
      asAdmin: page,
    }) => {
      const name = `ToDelete-${Date.now()}`;
      const res = await api.createRole({
        name,
        description: "will be deleted",
      });
      const roleId = res._id ?? res.data?._id;
      if (roleId) createdIds.push(roleId);

      await page.reload();
      await expect(page.locator(".loading")).not.toBeVisible({
        timeout: 10000,
      });

      const card = page.locator(".role-card", { hasText: name });
      await expect(card).toBeVisible();

      page.on("dialog", (d) => d.accept());
      await card.locator(".delete-btn, button:has-text('წაშლა')").click();

      await expectSuccessToast(page);
      await expect(card).not.toBeVisible();
      createdIds = createdIds.filter((id) => id !== roleId);
    });

    test("cancel delete dialog keeps role in list", async ({
      asAdmin: page,
    }) => {
      const name = `KeepRole-${Date.now()}`;
      const res = await api.createRole({ name, description: "keep me" });
      const roleId = res._id ?? res.data?._id;
      if (roleId) createdIds.push(roleId);

      await page.reload();
      await expect(page.locator(".loading")).not.toBeVisible({
        timeout: 10000,
      });

      const card = page.locator(".role-card", { hasText: name });
      await expect(card).toBeVisible();

      page.on("dialog", (d) => d.dismiss());
      await card.locator(".delete-btn, button:has-text('წაშლა')").click();

      await expect(card).toBeVisible();
    });
  });
};
