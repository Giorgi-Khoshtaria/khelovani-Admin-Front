import { test, expect } from "../../../fixtures/auth.fixture";
import { RolesPage } from "../../../pages/RolesPage";
import { ApiHelper } from "../../../helpers/api.helper";
import { expectSuccessToast } from "../../../helpers/validation.helper";

export const rolesPermissionCreateTests = () => {
  test.describe("Admin — Roles › Permission CRUD", () => {
    let rolesPage: RolesPage;
    let api: ApiHelper;
    let createdPermissionIds: string[] = [];

    test.beforeEach(async ({ asAdmin: page }) => {
      rolesPage = new RolesPage(page);
      api = new ApiHelper();
      await api.login();
      await rolesPage.goto();
      await expect(page.locator(".loading")).not.toBeVisible({ timeout: 10000 });
      await rolesPage.permissionsTab.click();
      await expect(page.locator(".loading")).not.toBeVisible({ timeout: 10000 });
    });

    test.afterEach(async () => {
      for (const id of createdPermissionIds) {
        try {
          await api.deletePermission(id);
        } catch {
          /* skip */
        }
      }
      createdPermissionIds = [];
    });

    test("create permission → success toast + appears in table", async ({
      asAdmin: page,
    }) => {
      const name = `perm.create.${Date.now()}`;
      await rolesPage.newPermissionBtn.click();

      await page.locator("#name").fill(name);
      await page.locator("#description").fill("E2E created permission");
      await page.locator('button[type="submit"]:has-text("დამატება")').click();

      await expectSuccessToast(page);
      await expect(page.locator("table tbody")).toContainText(name, {
        timeout: 10000,
      });

      // cleanup via API
      const perms = await api.getPermissions();
      const created = perms?.data?.find((p: { name: string; _id: string }) => p.name === name);
      if (created?._id) createdPermissionIds.push(created._id);
    });

    test("category dropdown is populated from DB, not hardcoded", async ({
      asAdmin: page,
    }) => {
      const uniqueCat = `Dynamiccat${Date.now()}`;
      // Create a permission with a brand-new category via API
      const res = await api.createPermission({
        name: `perm.cat.${Date.now()}`,
        description: "category test",
        category: uniqueCat,
      });
      const permId = res?.data?._id ?? res?._id;
      if (permId) createdPermissionIds.push(permId);

      // Reload the page so categories re-fetch
      await page.reload();
      await expect(page.locator(".loading")).not.toBeVisible({ timeout: 10000 });
      await rolesPage.permissionsTab.click();
      await expect(page.locator(".loading")).not.toBeVisible({ timeout: 10000 });

      // Open create permission modal and check the category dropdown contains the new category
      await rolesPage.newPermissionBtn.click();
      const select = page.locator("#category");
      await expect(select).toBeVisible();

      // The option text should match title-cased category
      const titleCased = uniqueCat.charAt(0).toUpperCase() + uniqueCat.slice(1).toLowerCase();
      await expect(select).toContainText(titleCased);
    });

    test("category filter dropdown is populated from DB", async ({
      asAdmin: page,
    }) => {
      const cats = await api.getPermissionCategories();
      const filterSelect = page.locator("select.category-filter");
      await expect(filterSelect).toBeVisible();

      for (const cat of cats.slice(0, 3)) {
        await expect(filterSelect).toContainText(cat);
      }
    });

    test("edit permission — category updates correctly", async ({
      asAdmin: page,
    }) => {
      const name = `perm.edit.${Date.now()}`;
      const res = await api.createPermission({
        name,
        description: "edit test",
        category: "General",
      });
      const permId = res?.data?._id ?? res?._id;
      if (permId) createdPermissionIds.push(permId);

      await page.reload();
      await expect(page.locator(".loading")).not.toBeVisible({ timeout: 10000 });
      await rolesPage.permissionsTab.click();
      await expect(page.locator(".loading")).not.toBeVisible({ timeout: 10000 });

      // Find and click edit for this permission
      const row = page.locator("tr", { hasText: name });
      await expect(row).toBeVisible({ timeout: 10000 });
      await row.locator("button:has-text('რედაქტირება')").click();

      // Edit modal should open with the correct category selected
      const categorySelect = page.locator("#category");
      await expect(categorySelect).toBeVisible();
      await expect(categorySelect).toHaveValue("General");

      await page.locator('button[type="submit"]:has-text("შენახვა")').click();
      await expectSuccessToast(page);
    });
  });
};
